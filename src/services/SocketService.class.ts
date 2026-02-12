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
  static #instance: SocketService;
  #socket: Socket | null = null;
  #namespaceSockets: Map<string, Socket> = new Map();
  readonly #BASE_URL: string;
  #pendingListeners: Array<{
    event: string;
    callback: (...args: unknown[]) => void;
  }> = [];

  private constructor() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    this.#BASE_URL = apiUrl.replace(/\/api$/, '');
  }

  public static getInstance(): SocketService {
    if (!SocketService.#instance) {
      SocketService.#instance = new SocketService();
    }
    return SocketService.#instance;
  }

  #attachPendingListeners(): void {
    if (this.#pendingListeners.length > 0) {
      this.#pendingListeners.forEach(({ event, callback }) => {
        this.#socket?.on(event, callback);
      });
      this.#pendingListeners = [];
    }
  }

  public connect(): Socket {
    if (this.#socket?.connected) {
      this.#attachPendingListeners();
      return this.#socket;
    }

    if (this.#socket && !this.#socket.connected) {
      this.#socket.connect();
      this.#attachPendingListeners();
      return this.#socket;
    }

    const token = authService.getAccessToken();

    this.#socket = io(this.#BASE_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: CHAT_CONFIG.RECONNECT_ATTEMPTS,
      reconnectionDelay: CHAT_CONFIG.RECONNECT_DELAY,
      transports: ['websocket', 'polling'],
      timeout: 10000,
    });

    this.#attachPendingListeners();

    return this.#socket;
  }

  public disconnect(): void {
    if (this.#socket) {
      this.#socket.disconnect();
      this.#socket = null;
    }
    this.#namespaceSockets.forEach(socket => socket.disconnect());
    this.#namespaceSockets.clear();
    this.#pendingListeners = [];
  }

  public isConnected(): boolean {
    return this.#socket?.connected ?? false;
  }

  public joinRoom(roomId: string): void {
    this.#socket?.emit(SOCKET_EVENTS.JOIN, { roomId });
  }

  public leaveRoom(roomId: string): void {
    this.#socket?.emit(SOCKET_EVENTS.LEAVE, { roomId });
  }

  public sendMessage(payload: SendMessagePayload): void {
    this.#socket?.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
  }

  #registerListener(event: string, callback: (...args: any[]) => void): void {
    if (this.#socket) {
      this.#socket.on(event, callback);
    } else {
      this.#pendingListeners.push({ event, callback });
    }
  }

  public onRooms(callback: SocketEventCallback<ChatRoom[]>): void {
    this.#registerListener(SOCKET_EVENTS.ROOMS, callback);
  }

  public onHistory(callback: SocketEventCallback<ChatHistoryPayload>): void {
    this.#registerListener(SOCKET_EVENTS.HISTORY, callback);
  }

  public onMessage(callback: SocketEventCallback<ServerMessage>): void {
    this.#registerListener(SOCKET_EVENTS.MESSAGE, callback);
  }

  public onError(callback: SocketEventCallback<ChatErrorPayload>): void {
    this.#registerListener(SOCKET_EVENTS.ERROR, callback);
  }

  public onConnect(callback: () => void): void {
    this.#registerListener('connect', callback);
  }

  public onDisconnect(callback: (reason: string) => void): void {
    this.#registerListener('disconnect', callback);
  }

  public onConnectError(callback: (error: Error) => void): void {
    this.#registerListener('connect_error', callback);
  }

  public offAll(): void {
    this.#socket?.removeAllListeners();
    this.#pendingListeners = [];
  }
}

export const socketService = SocketService.getInstance();
