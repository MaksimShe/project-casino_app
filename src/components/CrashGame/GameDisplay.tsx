import RocketAnimation from './components/RocketAnimation';
import CrashChart from './components/CrashChart';
import { CrashBackground } from '@/components/CrashGame/components/CrashBackground';
import { MultiplierDisplay } from '@/components/CrashGame/components/MultiplierDisplay';
import { EndGameModal } from '@/shared/EndGameModal';
import { useCrashStore } from '@/stores/useCrashStore';
import { useTranslation } from '@/i18n/useTranslation';

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
  const { t } = useTranslation();
  const {
    showWinModal,
    showLoseModal,
    modalWinAmount,
    modalMultiplier,
    modalBetAmount,
    modalCrashPoint,
    hideModals,
  } = useCrashStore();
  const winModalActive =
    showWinModal && modalWinAmount !== null && modalMultiplier !== null;
  const loseModalActive =
    showLoseModal && modalBetAmount !== null && modalCrashPoint !== null;

  return (
    <div className="h-[550px] w-full max-lg:h-[350px] sm:pl-16">
      <div className="relative mb-16 flex h-[500px] flex-1 rounded-xl bg-[var(--crash-game-bg)] shadow-[0_0_20px_var(--crash-game-shadow)] max-lg:h-[300px]">
        {/* Crash Chart */}
        <CrashChart />

        {/* Static Background */}
        <CrashBackground />

        {winModalActive && (
          <EndGameModal
            isWin={true}
            amount={modalWinAmount}
            multiplier={modalMultiplier}
            onClose={hideModals}
            betAmount={modalBetAmount ?? undefined}
          />
        )}
        {loseModalActive && (
          <EndGameModal
            isWin={false}
            amount={modalBetAmount}
            multiplier={modalCrashPoint}
            additionalInfo={`${t.modalWindows.crashedAt}${modalCrashPoint}x`}
            onClose={hideModals}
          />
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
