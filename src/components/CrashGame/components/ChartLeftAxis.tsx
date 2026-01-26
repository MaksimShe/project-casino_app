import { motion, type MotionValue } from 'framer-motion';

interface ChartLeftAxisProps {
  multiplierMarkers: { value: string; key: string }[];
  smoothMultiplierOffset: MotionValue<number>;
  multSpacing: number;
}

export default function ChartLeftAxis({
  multiplierMarkers,
  smoothMultiplierOffset,
  multSpacing,
}: ChartLeftAxisProps) {
  return (
    <div className="absolute top-0 bottom-0 -left-24 w-32 overflow-hidden">
      {/* Sliding multiplier markers - 1.0x at center, higher numbers above */}
      <motion.div
        className="absolute top-0 bottom-0 left-6 flex flex-col-reverse items-end pb-[172%] max-lg:pb-[91%]"
        style={{ y: smoothMultiplierOffset }}
      >
        {multiplierMarkers.map(marker => (
          <div
            key={marker.key}
            className="text-base whitespace-nowrap"
            style={{
              minHeight: `${multSpacing}px`,
              lineHeight: `${multSpacing}px`,
            }}
          >
            {marker.value}
          </div>
        ))}
      </motion.div>

      {/* Fixed lupe at vertical center (1x origin) - NO TEXT */}
      <div className="absolute left-8 z-20 flex h-full flex-col">
        <div className="flex-11 backdrop-blur-sm" />
        <div className="relative h-7 w-12 border-2 border-purple-500 bg-gray-900/20">
          <div className="absolute top-1/2 left-0 h-0.5 w-1 -translate-y-1/2 rounded-r-xs bg-purple-500" />
          <div className="absolute top-1/2 right-0 h-0.5 w-1 -translate-y-1/2 rounded-l-xs bg-purple-500" />
        </div>
        <div className="flex-12 backdrop-blur-sm" />
      </div>
    </div>
  );
}
