import { formatNumber } from '@/utils/format';
import RocketAnimation from './components/RocketAnimation';
import CrashChart from './components/CrashChart';
import { CrashBackground } from '@/components/CrashGame/components/CrashBackground';

interface GameDisplayProps {
  rocketPosition: { x: number; y: number };
  animationPhase: 'idle' | 'launching' | 'flying' | 'crashed' | 'respawning';
  shakeIntensity: 'light' | 'medium' | 'heavy';
  isRocketCrashed: boolean;
  isConnected: boolean;
  gameState: 'waiting' | 'running' | 'crashed';
  countdown: number;
  crashPoint: number | null;
}

export default function GameDisplay({
  rocketPosition,
  animationPhase,
  shakeIntensity,
  isRocketCrashed,
  isConnected,
  gameState,
  countdown,
  crashPoint,
}: GameDisplayProps) {
  const getStatusText = () => {
    if (!isConnected) {
      return 'Connecting...';
    }
    if (gameState === 'waiting') {
      return countdown > 0
        ? `Starting in ${countdown}s`
        : 'Waiting for bets...';
    }
    if (gameState === 'crashed') {
      return 'Crashed!';
    }
    return '';
  };

  return (
    <div className="h-[550px] w-[700px]">
      <div className="relative mb-16 ml-20 flex h-[400px] w-[600px] rounded-xl bg-[#1a1625] lg:h-[500px]">
        {/* Crash Chart */}
        <div className="absolute bottom-0 -left-24 z-20 h-full w-full">
          <CrashChart />
        </div>
        {/* Static Background */}
        <CrashBackground />

        {/* Rocket */}
        <RocketAnimation
          rocketPosition={rocketPosition}
          animationPhase={animationPhase}
          shakeIntensity={shakeIntensity}
          isRocketCrashed={isRocketCrashed}
        />

        {/* Connection Status */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <span className="text-xs text-gray-500">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
          <span
            className={`inline-block h-3 w-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
          />
        </div>

        {/* Status Text */}
        <div className="absolute top-4 z-20 w-full text-center">
          <span className="text-lg text-gray-400">{getStatusText()}</span>
        </div>

        {/* Crashed Message */}
        {gameState === 'crashed' && crashPoint && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50">
            <span className="text-4xl font-bold text-red-400">
              Crashed at {formatNumber(crashPoint)}x
            </span>
          </div>
        )}

        {/* Game ID & State */}
        {/*<div className="absolute bottom-4 z-20 w-full text-center text-xs text-gray-500">*/}
        {/*  {gameId && (*/}
        {/*    <div>Game #{gameId.slice(-UI_CONFIG.GAME_ID_DISPLAY_LENGTH)}</div>*/}
        {/*  )}*/}
        {/*  <div>State: {gameState}</div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
