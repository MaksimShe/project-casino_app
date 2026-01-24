import { useCrashStore } from '@/stores/useCrashStore';
import { formatNumber } from '@/utils/format';

export const MultiplierDisplay = () => {
  const { multiplier } = useCrashStore();
  return (
    <div>
      <span className="text-9xl font-black text-purple-500 shadow-black text-shadow-lg max-lg:text-7xl">
        x{formatNumber(multiplier)}
      </span>
    </div>
  );
};
