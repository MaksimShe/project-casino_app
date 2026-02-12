'use client';

import { type FC, memo } from 'react';
import Image from 'next/image';
import { type ChatMessage } from '@/types/chat';

interface Props {
  message: ChatMessage;
}

const getInitials = (username: string) => {
  return username
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const LiveChatMessage: FC<Props> = memo(({ message }) => {
  return (
    <div className="mx-auto mb-1.5 w-11/12 overflow-visible rounded-xl bg-[var(--chat-message-bg)] p-4 shadow-[0px_2px_10px_0px_#BFD8FF33]">
      <div className="flex items-center justify-between border-b pb-1.5">
        <div className="relative flex items-center gap-3 font-bold text-[var(--main-text-color)]">
          <div
            className="absolute -top-8 -left-8 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] p-0.5"
            style={{ boxShadow: '0px 0px 16px 0px #FFCD71' }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-[#3A88FF] to-[#004BBC]">
              {message.avatarURL ? (
                <Image
                  src={message.avatarURL}
                  alt={message.username}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-medium text-white">
                  {getInitials(message.username)}
                </span>
              )}
            </div>
          </div>
          <p>{message.username}</p>
        </div>
        <p className="text-sm text-[var(--second-text-color)]">
          {message.time}
        </p>
      </div>

      <div className="mt-2">
        <p className="w-full break-words whitespace-pre-wrap text-[var(--main-text-color)]">
          {message.text}
        </p>
      </div>
    </div>
  );
});
