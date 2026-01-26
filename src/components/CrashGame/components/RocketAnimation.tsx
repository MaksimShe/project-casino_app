import { memo } from 'react';
import Image from 'next/image';
import { ANIMATION_DURATION } from '../constants';

interface RocketAnimationProps {
  rocketPosition: { x: number; y: number };
  animationPhase: 'idle' | 'launching' | 'flying' | 'crashed' | 'respawning';
  shakeIntensity: 'light' | 'medium' | 'heavy';
  isRocketCrashed: boolean;
}

const SHAKE_ANIMATION_CLASSES = {
  light: 'animate-shake-light',
  medium: 'animate-shake-medium',
  heavy: 'animate-shake-heavy',
} as const;

const getShakeAnimationClass = (
  animationPhase: RocketAnimationProps['animationPhase'],
  shakeIntensity: RocketAnimationProps['shakeIntensity']
): string => {
  if (animationPhase !== 'flying') return '';
  return SHAKE_ANIMATION_CLASSES[shakeIntensity];
};

const getCrashAnimationClass = (
  animationPhase: RocketAnimationProps['animationPhase']
): string => {
  return animationPhase === 'crashed' ? 'animate-crash-explosion' : '';
};

const RocketAnimation = memo(
  ({
    rocketPosition,
    animationPhase,
    shakeIntensity,
    isRocketCrashed,
  }: RocketAnimationProps) => {
    return (
      <div
        className={`absolute z-10 transition-all ${
          animationPhase === 'launching'
            ? `duration-[${ANIMATION_DURATION.LAUNCH}ms] ease-out`
            : ''
        } ${animationPhase === 'respawning' ? `duration-[${ANIMATION_DURATION.RESPAWN}ms] ease-in` : ''}`}
        style={{
          left: `${rocketPosition.x}%`,
          top: `${rocketPosition.y}%`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <div
          className={`relative z-10 ${getShakeAnimationClass(animationPhase, shakeIntensity)} ${getCrashAnimationClass(animationPhase)}`}
        >
          {!isRocketCrashed ? (
            <Image
              src="/crash-game/rocket.png"
              alt="Rocket"
              width={128}
              height={128}
              className="h-24 w-24 lg:h-32 lg:w-32"
              style={{
                filter:
                  animationPhase === 'flying' || animationPhase === 'launching'
                    ? 'drop-shadow(-16px 16px 8px rgba(255, 140, 0, 0.8)) drop-shadow(-6px 6px 4px rgba(255, 69, 0, 0.6))'
                    : 'none',
                transition: 'filter 200ms ease-in-out',
              }}
            />
          ) : (
            <Image
              src="/crash-game/rocket-boom/rocket-boom1.gif"
              alt="Explosion"
              width={128}
              height={128}
              className="h-24 w-24 lg:h-32 lg:w-32"
              unoptimized
            />
          )}
        </div>
      </div>
    );
  }
);

RocketAnimation.displayName = 'RocketAnimation';

export default RocketAnimation;
