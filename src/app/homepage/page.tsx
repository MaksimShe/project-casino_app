'use client';

import { useState } from 'react';
import { Leaderboard } from '@/components/Dashboard/LeaderBoard/Leaderboard';
import { GameSelector } from '@/components/Dashboard/GameSelector/GameSelector';
import { LiveChat } from '@/components/Dashboard/LiveChat/LiveChat';
import chatIcon from '@/../public/logo/chat.svg';
import Image from 'next/image';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

export default function MainPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useLockBodyScroll(isChatOpen);

  const handleCloseChat = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsChatOpen(false);
      setIsClosing(false);
    }, 300);
  };

  return (
    <div className="m-10 flex items-center justify-between max-xl:m-6 max-lg:mx-4 max-lg:flex-col">
      <div className="order-1 max-lg:order-2 max-lg:mt-10 max-lg:w-full">
        <Leaderboard />
      </div>
      <div className="order-2 max-lg:order-1 max-lg:w-full">
        <GameSelector />
      </div>
      <div className="order-3 h-[83vh] w-80 max-xl:w-60 max-lg:hidden">
        <LiveChat />
      </div>

      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed right-4 bottom-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-[#FFCD71] to-[#E59603] shadow-lg max-lg:flex"
      >
        <Image src={chatIcon} alt="chat" width={24} height={24} />
      </button>

      {isChatOpen && (
        <div
          className={`fixed inset-0 z-50 hidden items-end justify-center max-lg:flex bg-black/50${
            isClosing ? 'animate-fade-out' : 'animate-fade-in'
          }`}
        >
          <div
            className={`relative h-[90%] w-full ${
              isClosing ? 'animate-slide-down' : 'animate-slide-up'
            }`}
          >
            <button
              onClick={handleCloseChat}
              className="absolute top-0 left-0 z-10 h-4/12 w-full translate-y-[-100%]"
            />
            <LiveChat />
          </div>
        </div>
      )}
    </div>
  );
}
