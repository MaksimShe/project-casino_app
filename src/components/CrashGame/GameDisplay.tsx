import RocketAnimation from './components/RocketAnimation';
import CrashChart from './components/CrashChart';
import { CrashBackground } from '@/components/CrashGame/components/CrashBackground';
import { MultiplierDisplay } from '@/components/CrashGame/components/MultiplierDisplay';
import { WinModal } from '@/components/CrashGame/components/modals/WinModal';
import { LoseModal } from '@/components/CrashGame/components/modals/LoseModal';
import { useCrashStore } from '@/stores/useCrashStore';

export const GAME_STATES = {
  WAITING: 'waiting',
  RUNNING: 'running',
  CRASHED: 'crashed',
} as const;

export type GameState = (typeof GAME_STATES)[keyof typeof GAME_STATES];

interface GameDisplayProps {
  rocketPosition: { x: number; y: number };
  animationPhase: 'idle' | 'launching' | 'flying' | 'crashed' | 'respawning';
  shakeIntensity: 'light' | 'medium' | 'heavy';
  isRocketCrashed: boolean;
}

export default function GameDisplay({
  rocketPosition,
  animationPhase,
  shakeIntensity,
  isRocketCrashed,
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
      <div className="relative mb-16 flex h-[500px] flex-1 rounded-xl bg-[var(--crash-game-bg)] shadow-[0_0_20px_var(--crash-game-shadow)] max-lg:h-[300px]">
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
      </div>
    </div>
  );
}
