'use client';

import { LiveChatHeader } from '@/components/Dashboard/LiveChat/components/LiveChatHeader';
import { LiveChatBody } from '@/components/Dashboard/LiveChat/components/LiveChatBody';
import { LiveChatFooter } from '@/components/Dashboard/LiveChat/components/LiveChatFooter';
import { useChat } from '@/hooks/useChat';
import { CHAT_ROOMS } from '@/constants/chat';

export const LiveChat = () => {
  const { messages, connectionStatus, error, sendMessage } = useChat(
    CHAT_ROOMS.GENERAL
  );

  return (
    <div className="relative flex h-full w-full flex-col items-center max-lg:rounded-t-2xl max-lg:bg-[#423E69] max-lg:p-6">
      <LiveChatHeader />

      <LiveChatBody
        messages={messages}
        isLoading={connectionStatus === 'connecting'}
        error={error}
      />

      <LiveChatFooter
        onSendMessage={sendMessage}
        disabled={connectionStatus !== 'connected'}
      />
    </div>
  );
};
