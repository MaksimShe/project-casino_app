import { motion, type MotionValue } from 'framer-motion';

interface ChartBottomAxisProps {
  timeMarkers: { value: string; key: string }[];
  timeOffsetMotion: MotionValue<number>;
  timeSpacing: number;
}

export default function ChartBottomAxis({
  timeMarkers,
  timeOffsetMotion,
  timeSpacing,
}: ChartBottomAxisProps) {
  return (
    <div className="absolute right-0 -bottom-18 left-0 h-24 overflow-hidden">
      {/* Sliding time markers - 0s at center, slides LEFT as time increases */}
      <motion.div
        className="absolute right-0 bottom-7 left-0 flex pl-[49%] text-white opacity-90"
        style={{
          x: timeOffsetMotion,
          gap: `${timeSpacing}px`,
        }}
      >
        {timeMarkers.map(time => (
          <div
            key={time.key}
            className="font-mono text-base whitespace-nowrap"
            style={{ minWidth: `${timeSpacing}px`, textAlign: 'center' }}
          >
            {time.value}
          </div>
        ))}
      </motion.div>

      {/* Fixed lupe at horizontal center (0s origin) - NO TEXT */}
      <div className="absolute bottom-5 z-20 flex h-10 w-full">
        <div className="flex-1 backdrop-blur-sm" />
        <div className="relative my-auto h-6 w-12 border-2 border-purple-500 bg-gray-900/20 shadow-2xl">
          <div className="absolute top-0 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-b-xs bg-purple-500" />
          <div className="absolute bottom-0 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-t-xs bg-purple-500" />
        </div>
        <div className="flex-1 backdrop-blur-sm" />
      </div>
    </div>
  );
}
