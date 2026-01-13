import { type Message } from '@/components/Dashboard/LiveChat/LiveChat';
import { type FC } from 'react';

interface Props {
  message: Message;
}

export const LiveChatMessage: FC<Props> = ({ message }) => {
  return (
    <div
      key={`${message.messageBody} + ${message.time} + ${message.author.username}`}
      className="mb-3 w-11/12 rounded-xl bg-[#24243F] p-4 shadow-[0px_2px_10px_0px_#BFD8FF33]"
    >
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="flex items-center gap-4 font-bold text-white">
          <p className="w-12 rounded-2xl bg-[linear-gradient(116deg,_#3A88FF_-6%,_#004BBC_84%)] p-1 text-center font-medium">
            {message.author.hzSomeV}
          </p>
          <p>{message.author.username}</p>
        </div>
        <p>{message.time}</p>
      </div>

      <div className="mt-2">
        <p>{message.messageBody}</p>
      </div>
    </div>
  );
};
