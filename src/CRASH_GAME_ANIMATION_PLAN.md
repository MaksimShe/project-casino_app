# Crash Game Animation Implementation Plan

## Overview
Add immersive rocket animation to the crash game with smooth transitions, shaking effects, and moving background. The rocket will be fixed in center during flight while the background moves upward, creating an illusion of rocket movement.

## Assets Available
- `/public/crash-game/rocket.png` - Main rocket image
- `/public/crash-game/bacground.png` - Tall background image (will scroll upward)
- `/public/crash-game/3ea3b2784fc4350d7c56a0b724d10ca794ee825d.jpg` - (to be identified)
- Rocket crash image - **TO BE ADDED LATER** (use crash smile emoji "💥" as placeholder)

## Animation States & Behavior

### 1. WAITING State (Game Not Started)
**Rocket Position:**
- Initial position: Bottom-left corner of the game container
- Position: `left: 10%`, `bottom: 10%`
- Rotation: 0 degrees, because rocket img - have rotation
- Size: 64x64px
- Opacity: 1.0

**Background:**
- Static, no movement
- Position: Default (bottom aligned)

### 2. STARTING Transition (Game Starts)
**Rocket Animation:**
- Smooth movement from bottom-left to center
- Duration: 1.5-2 seconds
- Easing: `ease-out` or cubic-bezier for smooth deceleration
- Target position: Center of container (`left: 50%`, `top: 50%`, `transform: translate(-50%, -50%)`)
- Rotation smoothly changes to pointing upward (0 degrees)

**Background:**
- Starts moving upward slowly
- Initial speed: Slow fade-in of movement

### 3. RUNNING State (Game Active, Multiplier Growing)
**Rocket Position:**
- **FIXED IN CENTER** - rocket stays at `left: 50%`, `top: 50%`
- No vertical/horizontal movement
- Rotation: 0 degrees (pointing up)

**Rocket Vibration/Shaking:**
- Add continuous shake/vibration effect using CSS keyframes
- Small random movements: ±2-4px horizontal, ±1-3px vertical
- Rotation wobble: ±1-3 degrees
- Animation: `shake 0.15s infinite` or similar
- Gets slightly more intense as multiplier increases:
  - 1x-5x: Light shake
  - 5x-10x: Medium shake
  - 10x+: Heavy shake

**Background Movement:**
- Scrolls upward continuously
- Speed tied to multiplier increase rate
- Background scrolls from bottom to top
- When background reaches end, loop/reset seamlessly (infinite scroll effect)
- Implementation: CSS `transform: translateY()` animated
- Speed calculation: `scrollSpeed = baseSpeed * (1 + multiplier * 0.1)` (gets faster as multiplier increases)

**Visual Enhancements:**
- Optional: Add trail/particle effects behind rocket
- Optional: Flame/engine glow at rocket base (pulsing animation)

### 4. CRASHED State (Game Ended)
**Rocket Transformation:**
- Immediately change image from `rocket.png` to crash image:
  - **Placeholder:** Show "💥" emoji overlay or crash smile
  - **Final:** Use `rocket-crash.png` when available
- Add explosion effect:
  - Scale animation: Quick scale up (1.2x) then back to 1.0
  - Shake violently for 0.5s
  - Fade out slightly or change opacity
- Duration: 0.5-1 second

**Background:**
- Stop scrolling immediately
- Optional: Slight screen shake effect

### 5. RESPAWN (After Crashed, New Round Waiting)
**Rocket Reset:**
- Fade out from center (if still visible)
- Teleport/reset to bottom-left corner
- Duration: 0.5-1 second
- Easing: `ease-in`
- Reset rotation to initial angle
- Reset image back to normal `rocket.png`

**Background:**
- Scroll back to bottom/initial position
- Or reset instantly with fade transition

## Technical Implementation Tasks

### Task 1: Component Structure & State Management
**File:** `src/app/crash-game/page.tsx`

- [ ] Add new state variables:
  ```typescript
  const [rocketPosition, setRocketPosition] = useState({ x: 10, y: 10 }); // percentage
  const [isRocketCrashed, setIsRocketCrashed] = useState(false);
  const [backgroundOffset, setBackgroundOffset] = useState(0); // pixels
  const [shakeIntensity, setShakeIntensity] = useState('light'); // 'light' | 'medium' | 'heavy'
  ```

- [ ] Add animation transition state:
  ```typescript
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'launching' | 'flying' | 'crashed' | 'respawning'>('idle');
  ```

### Task 2: Game State Effects
**File:** `src/app/crash-game/page.tsx`

- [ ] Add useEffect for `gameState` changes:
  - When `gameState === 'waiting'`: Set `animationPhase = 'idle'` or `'respawning'`
  - When `gameState === 'running'` (game starts): Trigger `animationPhase = 'launching'`
  - When `gameState === 'crashed'`: Trigger `animationPhase = 'crashed'`

- [ ] Add useEffect for launch animation:
  ```typescript
  useEffect(() => {
    if (animationPhase === 'launching') {
      // Smooth transition to center over 1.5s
      setRocketPosition({ x: 50, y: 50 });
      setRocketRotation(0);

      // After 1.5s, switch to flying
      setTimeout(() => {
        setAnimationPhase('flying');
      }, 1500);
    }
  }, [animationPhase]);
  ```

- [ ] Add useEffect for crash animation:
  ```typescript
  useEffect(() => {
    if (animationPhase === 'crashed') {
      setIsRocketCrashed(true);

      // After crash animation (1s), trigger respawn
      setTimeout(() => {
        setAnimationPhase('respawning');
      }, 1000);
    }
  }, [animationPhase]);
  ```

- [ ] Add useEffect for respawn animation:
  ```typescript
  useEffect(() => {
    if (animationPhase === 'respawning') {
      setIsRocketCrashed(false);
      setRocketPosition({ x: 10, y: 10 });
      setBackgroundOffset(0);

      // After respawn (0.5s), go back to idle
      setTimeout(() => {
        setAnimationPhase('idle');
      }, 500);
    }
  }, [animationPhase]);
  ```

### Task 3: Background Scroll Animation
**File:** `src/app/crash-game/page.tsx`

- [ ] Add useEffect with requestAnimationFrame for smooth background scroll:
  ```typescript
  useEffect(() => {
    if (animationPhase !== 'flying') return;

    let animationId: number;
    const scrollSpeed = 2; // base pixels per frame

    const animate = () => {
      setBackgroundOffset(prev => {
        const newOffset = prev + scrollSpeed * (1 + multiplier * 0.05);
        // Reset when reaching background height (loop)
        const bgHeight = 2000; // adjust to actual background height
        return newOffset >= bgHeight ? 0 : newOffset;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [animationPhase, multiplier]);
  ```

### Task 4: Shake Intensity Calculation
**File:** `src/app/crash-game/page.tsx`

- [ ] Add useEffect to update shake intensity based on multiplier:
  ```typescript
  useEffect(() => {
    if (animationPhase === 'flying') {
      if (multiplier >= 10) {
        setShakeIntensity('heavy');
      } else if (multiplier >= 5) {
        setShakeIntensity('medium');
      } else {
        setShakeIntensity('light');
      }
    }
  }, [multiplier, animationPhase]);
  ```

### Task 5: CSS Animations & Keyframes
**File:** Create `src/app/crash-game/animations.css` or add to global CSS

- [ ] Create shake keyframes:
  ```css
  @keyframes shake-light {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(2px, -1px) rotate(1deg); }
    50% { transform: translate(-2px, 1px) rotate(-1deg); }
    75% { transform: translate(1px, -2px) rotate(0.5deg); }
  }

  @keyframes shake-medium {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(3px, -2px) rotate(2deg); }
    50% { transform: translate(-3px, 2px) rotate(-2deg); }
    75% { transform: translate(2px, -3px) rotate(1deg); }
  }

  @keyframes shake-heavy {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(4px, -3px) rotate(3deg); }
    50% { transform: translate(-4px, 3px) rotate(-3deg); }
    75% { transform: translate(3px, -4px) rotate(2deg); }
  }

  @keyframes crash-explosion {
    0% { transform: scale(1) rotate(0deg); opacity: 1; }
    50% { transform: scale(1.3) rotate(10deg); opacity: 0.8; }
    100% { transform: scale(1.1) rotate(-5deg); opacity: 0.9; }
  }

  @keyframes fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  ```

### Task 6: JSX & Styling for Rocket & Background
**File:** `src/app/crash-game/page.tsx`

- [ ] Replace current multiplier display container with animated game scene:
  ```jsx
  <div className="relative flex h-[400px] w-[500px] overflow-hidden rounded-xl bg-[#1a1625] lg:h-[500px]">
    {/* Animated Background */}
    <div
      className="absolute inset-0 w-full"
      style={{
        backgroundImage: 'url(/crash-game/bacground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat-y',
        transform: `translateY(-${backgroundOffset}px)`,
        transition: animationPhase === 'respawning' ? 'transform 0.5s ease-in' : 'none',
      }}
    />

    {/* Rocket */}
    <div
      className={`absolute z-10 transition-all ${
        animationPhase === 'launching' ? 'duration-[1500ms] ease-out' : ''
      } ${
        animationPhase === 'respawning' ? 'duration-500 ease-in' : ''
      }`}
      style={{
        left: `${rocketPosition.x}%`,
        top: animationPhase === 'idle' || animationPhase === 'respawning' ? 'auto' : `${rocketPosition.y}%`,
        bottom: animationPhase === 'idle' || animationPhase === 'respawning' ? '10%' : 'auto',
        transform: `translate(-50%, -50%)`,
      }}
    >
      <div
        className={`relative ${
          animationPhase === 'flying'
            ? shakeIntensity === 'heavy'
              ? 'animate-shake-heavy'
              : shakeIntensity === 'medium'
              ? 'animate-shake-medium'
              : 'animate-shake-light'
            : ''
        } ${
          animationPhase === 'crashed' ? 'animate-crash-explosion' : ''
        }`}
      >
        {/* Rocket Image */}
        <img
          src={isRocketCrashed ? '/crash-game/rocket-crash.png' : '/crash-game/rocket.png'}
          alt="Rocket"
          className="h-24 w-24 lg:h-32 lg:w-32"
          onError={(e) => {
            // Fallback if crash image not available
            if (isRocketCrashed) {
              e.currentTarget.style.display = 'none';
            }
          }}
        />

        {/* Crash Placeholder (when crash image not available) */}
        {isRocketCrashed && (
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            💥
          </div>
        )}
      </div>
    </div>

    {/* Multiplier Display (overlay on top) */}
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-7xl font-bold transition-colors lg:text-9xl pointer-events-auto">
        {formatNumber(multiplier)}x
      </span>
      {gameState === 'crashed' && crashPoint && (
        <span className="mt-2 text-xl text-red-400">
          Crashed at {crashPoint}x
        </span>
      )}
    </div>

    {/* Keep existing status/connection indicators */}
    {/* ... */}
  </div>
  ```

- [ ] Add Tailwind config for custom animations (if needed):
  ```js
  // tailwind.config.js
  module.exports = {
    theme: {
      extend: {
        animation: {
          'shake-light': 'shake-light 0.15s infinite',
          'shake-medium': 'shake-medium 0.12s infinite',
          'shake-heavy': 'shake-heavy 0.1s infinite',
          'crash-explosion': 'crash-explosion 0.5s ease-out',
        },
        keyframes: {
          // Add keyframes from Task 5
        }
      }
    }
  }
  ```

### Task 7: Remove Unused Code
**File:** `src/app/crash-game/page.tsx:360`

- [ ] Remove unused `getMultiplierColor` function (line 360) - currently triggers linting error

## Testing Checklist

- [ ] Test rocket appears in bottom-left on page load (waiting state)
- [ ] Test smooth launch animation when game starts
- [ ] Test rocket stays centered while background scrolls during flight
- [ ] Test shake animation gets more intense with higher multipliers
- [ ] Test background scrolls smoothly and loops without visible seam
- [ ] Test crash animation shows explosion/crash image/emoji
- [ ] Test rocket respawns to bottom-left after crash
- [ ] Test all animations work across different screen sizes
- [ ] Test performance - animations should be smooth (60fps)
- [ ] Verify no API calls or button actions were changed

## Future Enhancements (Optional)
- Add particle trail effect behind rocket
- Add flame/engine glow animation
- Add sound effects (whoosh, explosion)
- Add screen shake on crash
- Add parallax effect with multiple background layers
- Make rocket slightly tilt based on multiplier acceleration

## Notes
- **DO NOT** modify any API calls in `crashService`
- **DO NOT** change button onClick handlers (`handlePlaceBet`, `handleCashout`)
- **DO NOT** modify WebSocket event handlers
- Keep all existing game logic intact
- Only add visual animations and effects
- Ensure all animations are GPU-accelerated (use `transform` and `opacity`)
- Test on different devices for performance

## Estimated Complexity
- **Easy:** State management, basic transitions
- **Medium:** Background scroll loop, shake animations
- **Medium-Hard:** Coordinating all animation states with game states
- **Performance Critical:** Background scroll must be optimized for 60fps