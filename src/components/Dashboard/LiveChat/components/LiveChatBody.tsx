import { type FC } from 'react';
import { LiveChatMessage } from '@/components/Dashboard/LiveChat/components/LiveChatMessage';
import { type Message } from '@/components/Dashboard/LiveChat/LiveChat';

interface Props {
  messages: Message[];
}

export const LiveChatBody: FC<Props> = ({ messages }) => {
  return (
    <div className="mt-4 flex h-[83%] flex-col items-center overflow-y-auto">
      {messages.map(message => (
        <LiveChatMessage message={message} key={message.messageBody} />
      ))}
    </div>
  );
};
