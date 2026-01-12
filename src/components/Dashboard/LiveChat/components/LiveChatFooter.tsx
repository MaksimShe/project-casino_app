import { Input } from '@/shared/Input';

export const LiveChatFooter = () => {
  return (
    <div className="mt-2 flex w-full items-center gap-2">
      <div className="flex-1">
        <Input
          placeholder="Write a message..."
          className="h-12 w-full rounded-4xl bg-[#7C7CE854] text-white"
        />
      </div>
      <button className="h-12 w-12 shrink-0 rounded-4xl bg-[#7C7CE854] text-2xl font-black text-white">
        ↑
      </button>
    </div>
  );
};
