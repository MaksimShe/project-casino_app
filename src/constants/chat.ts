export const CHAT_ROOMS = {
  GENERAL: 'general',
  CRASH: 'crash',
} as const;

export const SOCKET_EVENTS = {
  JOIN: 'chat:join',
  LEAVE: 'chat:leave',
  SEND_MESSAGE: 'chat:message',

  ROOMS: 'chat:rooms',
  HISTORY: 'chat:history',
  MESSAGE: 'message',
  ERROR: 'chat:error',
} as const;

export const CHAT_CONFIG = {
  MAX_MESSAGES: 500,
  RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
} as const;
