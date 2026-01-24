import { formatNumber } from '@/utils/format';
import RocketAnimation from './components/RocketAnimation';
import CrashChart from './components/CrashChart';
import { CrashBackground } from '@/components/CrashGame/components/CrashBackground';
import { MultiplierDisplay } from '@/components/CrashGame/components/MultiplierDisplay';
import { WinModal } from '@/components/CrashGame/components/modals/WinModal';
import { LoseModal } from '@/components/CrashGame/components/modals/LoseModal';
import { useCrashStore } from '@/stores/useCrashStore';

interface GameDisplayProps {
  rocketPosition: { x: number; y: number };
  animationPhase: 'idle' | 'launching' | 'flying' | 'crashed' | 'respawning';
  shakeIntensity: 'light' | 'medium' | 'heavy';
  isRocketCrashed: boolean;
  gameState: 'waiting' | 'running' | 'crashed';
  crashPoint: number | null;
}

export default function GameDisplay({
  rocketPosition,
  animationPhase,
  shakeIntensity,
  isRocketCrashed,
  gameState,
  crashPoint,
}: GameDisplayProps) {
  const {
    showWinModal,
    showLoseModal,
    modalWinAmount,
    modalMultiplier,
    modalBetAmount,
    modalCrashPoint,
  } = useCrashStore();

  return (
    <div className="h-[550px] w-full max-lg:h-[350px] sm:pl-16">
      <div className="relative mb-16 flex h-[500px] flex-1 rounded-xl bg-[#1a1625] shadow-[0_0_20px_rgba(227,61,148,0.6)] max-lg:h-[300px]">
        {/* Crash Chart */}
        <CrashChart />

        {/* Static Background */}
        <CrashBackground />

        {/* Modals */}
        {showWinModal && modalWinAmount && modalMultiplier && (
          <WinModal winAmount={modalWinAmount} multiplier={modalMultiplier} />
        )}
        {showLoseModal && modalBetAmount && modalCrashPoint && (
          <LoseModal betAmount={modalBetAmount} crashPoint={modalCrashPoint} />
        )}

        <div className="absolute top-3/12 right-1/2 translate-x-1/2">
          <MultiplierDisplay />
        </div>

        {/* Rocket */}
        <RocketAnimation
          rocketPosition={rocketPosition}
          animationPhase={animationPhase}
          shakeIntensity={shakeIntensity}
          isRocketCrashed={isRocketCrashed}
        />

        {/* Crashed Message */}
        {gameState === 'crashed' && crashPoint && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
            <span className="text-4xl font-bold text-red-400">
              Crashed at {formatNumber(crashPoint)}x
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
