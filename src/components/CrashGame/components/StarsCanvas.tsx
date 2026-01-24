'use client';

import { useCallback, useMemo } from 'react';
import { useCanvasAnimation } from './canvas/useCanvasAnimation';
import { StarsAnimationController } from './canvas/StarsAnimationController';

export const StarsCanvas = () => {
  const controller = useMemo(() => new StarsAnimationController(50), []);

  const handleResize = useCallback(
    (canvas: HTMLCanvasElement) => {
      controller.initialize(canvas.width, canvas.height);
    },
    [controller]
  );

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      controller.animate(ctx, canvas);
    },
    [controller]
  );

  const canvasRef = useCanvasAnimation({ onResize: handleResize, animate });

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
};
