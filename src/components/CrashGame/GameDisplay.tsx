import { formatNumber } from '@/utils/format';
import RocketAnimation from './components/RocketAnimation';
import CrashChart from './components/CrashChart';
import { CrashBackground } from '@/components/CrashGame/components/CrashBackground';
import { MultiplierDisplay } from '@/components/CrashGame/components/MultiplierDisplay';
import { WinModal } from '@/components/CrashGame/components/modals/WinModal';
import { LoseModal } from '@/components/CrashGame/components/modals/LoseModal';
import { useCrashStore } from '@/stores/useCrashStore';
import {
  GAME_DISPLAY_COLORS,
  GAME_DISPLAY_POSITIONING,
  GAME_DISPLAY_TEXT,
} from './GameDisplay.constants';

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
      <div
        className="relative mb-16 flex h-[500px] flex-1 rounded-xl max-lg:h-[300px]"
        style={{
          backgroundColor: GAME_DISPLAY_COLORS.BACKGROUND,
          boxShadow: `0 0 20px ${GAME_DISPLAY_COLORS.SHADOW_GLOW}`,
        }}
      >
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

        <div
          className={`absolute ${GAME_DISPLAY_POSITIONING.MULTIPLIER.TOP} ${GAME_DISPLAY_POSITIONING.MULTIPLIER.RIGHT} ${GAME_DISPLAY_POSITIONING.MULTIPLIER.TRANSFORM}`}
        >
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
            <span
              className={`${GAME_DISPLAY_TEXT.CRASHED_MESSAGE_SIZE} ${GAME_DISPLAY_TEXT.CRASHED_MESSAGE_WEIGHT} ${GAME_DISPLAY_COLORS.CRASHED_TEXT}`}
            >
              Crashed at {formatNumber(crashPoint)}x
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
