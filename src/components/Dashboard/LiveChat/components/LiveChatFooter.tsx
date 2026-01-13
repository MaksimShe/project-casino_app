import { Input } from '@/shared/Input';

export const LiveChatFooter = () => {
  return (
    <div className="mt-2 flex items-center gap-2 max-lg:absolute max-lg:right-6 max-lg:bottom-8 max-lg:left-6">
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
