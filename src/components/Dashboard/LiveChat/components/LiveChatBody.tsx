'use client';

import { type FC, useRef, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LiveChatMessage } from './LiveChatMessage';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { type ChatMessage } from '@/types/chat';
import { VIRTUALIZER_CONFIG } from '../constants';

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

export const LiveChatBody: FC<Props> = ({ messages, isLoading, error }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<{ handleVirtualizerChange: () => void } | null>(
    null
  );

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => VIRTUALIZER_CONFIG.ESTIMATED_SIZE,
    overscan: VIRTUALIZER_CONFIG.OVERSCAN,
    gap: VIRTUALIZER_CONFIG.GAP,
    onChange: () => {
      autoScrollRef.current?.handleVirtualizerChange();
    },
  });

  const { scrollToBottom, handleVirtualizerChange } = useAutoScroll({
    virtualizer,
    itemCount: messages.length,
  });

  autoScrollRef.current = { handleVirtualizerChange };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [scrollToBottom]);

  if (isLoading) {
    return (
      <div className="mt-4 flex h-[83%] flex-col items-center justify-center max-lg:h-[90%]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#3A88FF]" />
        <p className="mt-2 text-sm text-white/70">Connecting to chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 flex h-[83%] flex-col items-center justify-center max-lg:h-[90%]">
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="mt-4 flex h-[83%] flex-col items-center justify-center max-lg:h-[90%]">
        <p className="text-sm text-white/50">
          No messages yet. Start the conversation!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className="mt-4 w-[120%] flex-1 overflow-y-auto pt-8 pl-10 max-lg:pb-20 max-lg:pl-14"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '87%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map(virtualRow => {
          const message = messages[virtualRow.index];
          return (
            <div
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <LiveChatMessage message={message} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
