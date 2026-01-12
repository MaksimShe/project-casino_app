import { type ChatInfo } from '@/components/Dashboard/LiveChat/LiveChat';
import { type FC } from 'react';

interface Props {
  chatInfo: ChatInfo;
}

export const LiveChatHeader: FC<Props> = ({ chatInfo }) => {
  return (
    <div className="text-white">
      <p className="text-center text-2xl font-bold">
        L
        <span className="relative inline-block">
          ı
          <span className="absolute top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#FF0047] to-[#FF417B] shadow-[0px_0px_7.1px_3px_#FF0B50]" />
        </span>
        ve chat
      </p>
      <div className="mt-1 flex w-full items-center justify-between gap-4 border-t-1 pt-1">
        <p>{chatInfo.online} online</p>
        <p className="text-[#E59603]">{chatInfo.friends} friends</p>
        <p>{chatInfo.playing} playing</p>
      </div>
    </div>
  );
};
