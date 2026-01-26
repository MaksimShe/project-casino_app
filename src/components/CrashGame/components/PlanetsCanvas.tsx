'use client';

import { useCallback, useMemo } from 'react';
import { useCanvasAnimation } from './canvas/useCanvasAnimation';
import { PlanetsAnimationController } from './canvas/PlanetsAnimationController';

export const PlanetsCanvas = () => {
  const controller = useMemo(() => new PlanetsAnimationController(), []);

  const handleResize = useCallback(
    (canvas: HTMLCanvasElement) => {
      const isSmallScreen = window.innerWidth < 640;
      const radius = isSmallScreen ? 45 : 90;
      controller.initialize(canvas.width, canvas.height, radius);
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
