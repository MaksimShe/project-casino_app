'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { socketService } from '@/services/SocketService.class';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { CHAT_ROOMS, CHAT_CONFIG } from '@/constants/chat';
import { ConnectionStatus } from '@/types/chat';
import type { ChatMessage, ChatRoom, ServerMessage } from '@/types/chat';

function normalizeMessage(msg: ServerMessage): ChatMessage {
  return {
    id: msg._id,
    username: msg.username,
    userId: msg.userId,
    text: msg.text,
    time: msg.time,
    createdAt: new Date(msg.createdAt),
    roomId: msg.roomId,
    avatarURL: msg.avatarURL,
  };
}

interface UseChatReturn {
  messages: ChatMessage[];
  rooms: ChatRoom[];
  currentRoom: string;
  connectionStatus: ConnectionStatus;
  error: string | null;
  sendMessage: (text: string) => void;
  switchRoom: (roomId: string) => void;
  reconnect: () => void;
}

export function useChat(
  initialRoom: string = CHAT_ROOMS.GENERAL
): UseChatReturn {
  const { data: user } = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>(initialRoom);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<string | null>(null);

  const previousRoomRef = useRef<string | null>(null);
  const currentRoomRef = useRef<string>(initialRoom);

  useEffect(() => {
    currentRoomRef.current = currentRoom;
  }, [currentRoom]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setConnectionStatus(ConnectionStatus.CONNECTING);
    setError(null);

    // Set up all event handlers BEFORE connecting
    socketService.onConnect(() => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      setError(null);
      socketService.joinRoom(currentRoomRef.current);
    });

    socketService.onDisconnect(reason => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      if (reason === 'io server disconnect') {
        setError('Disconnected by server');
      }
    });

    socketService.onConnectError(err => {
      setConnectionStatus(ConnectionStatus.ERROR);
      setError(err.message || 'Connection failed');
    });

    socketService.onRooms(roomList => {
      setRooms(roomList);
    });

    socketService.onHistory(({ roomId, messages: serverMessages }) => {
      if (roomId === currentRoomRef.current) {
        const normalized = serverMessages.map(normalizeMessage);
        setMessages(normalized);
      }
    });

    socketService.onMessage(serverMessage => {
      const message = normalizeMessage(serverMessage);
      if (message.roomId === currentRoomRef.current) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === message.id);
          if (exists) return prev;

          const updated = [...prev, message];
          if (updated.length > CHAT_CONFIG.MAX_MESSAGES) {
            return updated.slice(-CHAT_CONFIG.MAX_MESSAGES);
          }
          return updated;
        });
      }
    });

    socketService.onError(({ message }) => {
      setError(message);
    });

    // Connect AFTER all handlers are set up
    socketService.connect();

    // Check if already connected (can happen on mobile/hot reload)
    if (socketService.isConnected()) {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      socketService.joinRoom(currentRoomRef.current);
    }

    // Connection timeout - prevent endless loading
    const timeout = setTimeout(() => {
      if (!socketService.isConnected()) {
        setConnectionStatus(ConnectionStatus.ERROR);
        setError('Connection timeout');
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      socketService.offAll();
    };
  }, []);

  useEffect(() => {
    if (connectionStatus !== ConnectionStatus.CONNECTED) return;

    const prevRoom = previousRoomRef.current;
    if (prevRoom && prevRoom !== currentRoom) {
      socketService.leaveRoom(prevRoom);
    }

    socketService.joinRoom(currentRoom);
    setMessages([]);
    previousRoomRef.current = currentRoom;
  }, [currentRoom, connectionStatus]);

  const sendMessage = useCallback(
    (text: string) => {
      if (
        !text.trim() ||
        !user ||
        connectionStatus !== ConnectionStatus.CONNECTED
      )
        return;

      socketService.sendMessage({
        roomId: currentRoom,
        message: text.trim(),
        username: user.username,
        userId: user._id,
      });
    },
    [currentRoom, user, connectionStatus]
  );

  const switchRoom = useCallback(
    (roomId: string) => {
      if (roomId !== currentRoom) {
        setCurrentRoom(roomId);
      }
    },
    [currentRoom]
  );

  const reconnect = useCallback(() => {
    socketService.disconnect();
    setConnectionStatus(ConnectionStatus.CONNECTING);
    socketService.connect();
  }, []);

  return {
    messages,
    rooms,
    currentRoom,
    connectionStatus,
    error,
    sendMessage,
    switchRoom,
    reconnect,
  };
}
