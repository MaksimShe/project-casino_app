export interface ChatRoom {
  id: string;
  name: string;
}

export interface ServerMessage {
  _id: string;
  username: string;
  text: string;
  userId: string;
  time: string;
  createdAt: string;
  roomId: string;
  avatarURL?: string;
}

export interface ChatMessage {
  id: string;
  username: string;
  userId: string;
  text: string;
  time: string;
  createdAt: Date;
  roomId: string;
  avatarURL?: string;
}

export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
}

export interface SendMessagePayload {
  roomId: string;
  message: string;
  username: string;
  userId: string;
}

export interface ChatHistoryPayload {
  roomId: string;
  messages: ServerMessage[];
}

export interface ChatErrorPayload {
  message: string;
}
