'use client';

import { useCallback, useRef, useState } from 'react';
import { type Virtualizer } from '@tanstack/react-virtual';

interface UseAutoScrollOptions {
  virtualizer: Virtualizer<HTMLDivElement, Element> | null;
  itemCount: number;
  threshold?: number;
}

export function useAutoScroll({
  virtualizer,
  itemCount,
  threshold = 100,
}: UseAutoScrollOptions) {
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevItemCountRef = useRef(itemCount);

  const checkIsAtBottom = useCallback(() => {
    if (!virtualizer) return true;

    const scrollElement = virtualizer.scrollElement;
    if (!scrollElement) return true;

    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, [virtualizer, threshold]);

  const scrollToBottom = useCallback(() => {
    if (!virtualizer || itemCount === 0) return;

    virtualizer.scrollToIndex(itemCount - 1, {
      align: 'end',
      behavior: 'auto',
    });
  }, [virtualizer, itemCount]);

  const handleScroll = useCallback(() => {
    setIsAtBottom(checkIsAtBottom());
  }, [checkIsAtBottom]);

  const handleVirtualizerChange = useCallback(() => {
    if (itemCount > prevItemCountRef.current && isAtBottom) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
    prevItemCountRef.current = itemCount;
  }, [itemCount, isAtBottom, scrollToBottom]);

  return {
    scrollToBottom,
    handleScroll,
    handleVirtualizerChange,
    isAtBottom,
  };
}
