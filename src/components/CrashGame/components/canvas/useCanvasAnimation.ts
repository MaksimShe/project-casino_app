import { useEffect, useRef } from 'react';

type AnimationCallback = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) => void;
type ResizeCallback = (canvas: HTMLCanvasElement) => void;

interface UseCanvasAnimationProps {
  onResize?: ResizeCallback;
  animate: AnimationCallback;
}

export const useCanvasAnimation = ({
  onResize,
  animate,
}: UseCanvasAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIdRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
    };

    const handleResize = () => {
      updateCanvasSize();
      onResize?.(canvas);
    };

    // Initial setup: set canvas size and initialize controllers
    updateCanvasSize();
    onResize?.(canvas);

    window.addEventListener('resize', handleResize);

    const animationLoop = () => {
      animate(ctx, canvas);
      frameIdRef.current = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      if (frameIdRef.current !== undefined) {
        cancelAnimationFrame(frameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, onResize]);

  return canvasRef;
};
