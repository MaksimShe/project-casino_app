export const LiveChatHeader = () => {
  return (
    <div className="text-white">
      <div className="flex items-center justify-center">
        <p className="text-center text-2xl font-bold">
          L
          <span className="relative inline-block">
            ı
            <span className="absolute top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gradient-to-t from-[#FF0047] to-[#FF417B] shadow-[0px_0px_7.1px_3px_#FF0B50]" />
          </span>
          ve chat
        </p>
      </div>
      <div className="mt-1.5 flex items-center justify-between border-t pt-1.5">
        <p className="text-center">250 online</p>
        <p className="bg-gradient-to-b from-[#FFCD71] to-[#E59603] bg-clip-text text-center text-transparent">
          38 friends
        </p>
        <p className="text-center">66 playing</p>
      </div>
    </div>
  );
};
