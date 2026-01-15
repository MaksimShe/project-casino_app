import { io, type Socket } from 'socket.io-client';
import { authService } from '@/services/AuthService.class';
import { SOCKET_EVENTS, CHAT_CONFIG } from '@/constants/chat';
import type {
  ChatRoom,
  ServerMessage,
  SendMessagePayload,
  ChatHistoryPayload,
  ChatErrorPayload,
} from '@/types/chat';

export type SocketEventCallback<T> = (data: T) => void;

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private readonly BASE_URL: string;

  private constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.BASE_URL = apiUrl.replace(/\/api$/, '');
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      return this.socket;
    }

    const token = authService.getAccessToken();

    this.socket = io(this.BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: CHAT_CONFIG.RECONNECT_ATTEMPTS,
      reconnectionDelay: CHAT_CONFIG.RECONNECT_DELAY,
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public joinRoom(roomId: string): void {
    this.socket?.emit(SOCKET_EVENTS.JOIN, { roomId });
  }

  public leaveRoom(roomId: string): void {
    this.socket?.emit(SOCKET_EVENTS.LEAVE, { roomId });
  }

  public sendMessage(payload: SendMessagePayload): void {
    this.socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  }

  public onRooms(callback: SocketEventCallback<ChatRoom[]>): void {
    this.socket?.on(SOCKET_EVENTS.ROOMS, callback);
  }

  public onHistory(callback: SocketEventCallback<ChatHistoryPayload>): void {
    this.socket?.on(SOCKET_EVENTS.HISTORY, callback);
  }

  public onMessage(callback: SocketEventCallback<ServerMessage>): void {
    this.socket?.on(SOCKET_EVENTS.MESSAGE, callback);
  }

  public onError(callback: SocketEventCallback<ChatErrorPayload>): void {
    this.socket?.on(SOCKET_EVENTS.ERROR, callback);
  }

  public onConnect(callback: () => void): void {
    this.socket?.on('connect', callback);
  }

  public onDisconnect(callback: (reason: string) => void): void {
    this.socket?.on('disconnect', callback);
  }

  public onConnectError(callback: (error: Error) => void): void {
    this.socket?.on('connect_error', callback);
  }

  public offAll(): void {
    this.socket?.removeAllListeners();
  }
}

export const socketService = SocketService.getInstance();
