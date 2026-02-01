'use client';

import { LiveChatHeader } from '@/components/Dashboard/LiveChat/components/LiveChatHeader';
import { LiveChatBody } from '@/components/Dashboard/LiveChat/components/LiveChatBody';
import { LiveChatFooter } from '@/components/Dashboard/LiveChat/components/LiveChatFooter';
import { useChat } from '@/hooks/useChat';
import { useAccountCount } from '@/hooks/useAccountCount';
import { CHAT_ROOMS } from '@/constants/chat';
import { ConnectionStatus } from '@/types/chat';

export const LiveChat = () => {
  const { messages, rooms, currentRoom, connectionStatus, error, sendMessage } =
    useChat(CHAT_ROOMS.GENERAL);
  const { data: accountCount = 0 } = useAccountCount();
  const isLoading = connectionStatus === ConnectionStatus.CONNECTING;

  const currentRoomData = rooms.find(room => room.id === currentRoom);
  const onlineCount = currentRoomData?.activeUsers ?? 0;

  return (
    <div className="relative flex h-full w-full flex-col items-center max-lg:rounded-t-2xl max-lg:bg-[#423E69] max-lg:p-6">
      <LiveChatHeader onlineCount={onlineCount} friendsCount={accountCount} />

      <LiveChatBody messages={messages} isLoading={isLoading} error={error} />

      <LiveChatFooter
        onSendMessage={sendMessage}
        disabled={connectionStatus !== ConnectionStatus.CONNECTED}
      />
    </div>
  );
};
