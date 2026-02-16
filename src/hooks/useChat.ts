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
  reconnect: () => void;
}

export function useChat(
  initialRoom: string = CHAT_ROOMS.GENERAL
): UseChatReturn {
  const { data: user } = useCurrentUser();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );
  const [error, setError] = useState<string | null>(null);

  const roomRef = useRef<string>(initialRoom);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setConnectionStatus(ConnectionStatus.CONNECTING);
    setError(null);

    const handleConnect = () => {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      setError(null);
      socketService.joinRoom(roomRef.current);
    };

    const handleDisconnect = (reason: string) => {
      setConnectionStatus(ConnectionStatus.DISCONNECTED);
      if (reason === 'io server disconnect') {
        setError('Disconnected by server');
      }
    };

    const handleConnectError = (err: Error) => {
      setConnectionStatus(ConnectionStatus.ERROR);
      setError(err.message || 'Connection failed');
    };

    const handleRooms = (roomList: ChatRoom[]) => {
      setRooms(roomList);
    };

    const handleHistory = ({
      roomId,
      messages: serverMessages,
    }: {
      roomId: string;
      messages: ServerMessage[];
    }) => {
      if (roomId === roomRef.current) {
        const normalized = serverMessages.map(normalizeMessage);
        setMessages(normalized);
      }
    };

    const handleMessage = (serverMessage: ServerMessage) => {
      const message = normalizeMessage(serverMessage);
      if (message.roomId === roomRef.current) {
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
    };

    const handleError = ({ message }: { message: string }) => {
      setError(message);
    };

    socketService.onConnect(handleConnect);
    socketService.onDisconnect(handleDisconnect);
    socketService.onConnectError(handleConnectError);
    socketService.onRooms(handleRooms);
    socketService.onHistory(handleHistory);
    socketService.onMessage(handleMessage);
    socketService.onError(handleError);

    socketService.connect();

    if (socketService.isConnected()) {
      setConnectionStatus(ConnectionStatus.CONNECTED);
      socketService.joinRoom(roomRef.current);
    }

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

  const sendMessage = useCallback(
    (text: string) => {
      if (
        !text.trim() ||
        !user ||
        connectionStatus !== ConnectionStatus.CONNECTED
      )
        return;

      socketService.sendMessage({
        roomId: roomRef.current,
        message: text.trim(),
        username: user.username,
        userId: user._id,
      });
    },
    [user, connectionStatus]
  );

  const reconnect = useCallback(() => {
    socketService.disconnect();
    setConnectionStatus(ConnectionStatus.CONNECTING);
    socketService.connect();
  }, []);

  return {
    messages,
    rooms,
    currentRoom: initialRoom,
    connectionStatus,
    error,
    sendMessage,
    reconnect,
  };
}
