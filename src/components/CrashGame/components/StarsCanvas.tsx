'use client';

import { useEffect, useRef } from 'react';
import { useCrashStore } from '@/stores/useCrashStore';

type Star = {
  x: number;
  y: number;
  r: number;
  speed: number;
  brightness: number;
  brightnessSpeed: number;
};

export const StarsCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<Star[]>([]);
  const gameState = useCrashStore(state => state.gameState);
  const gameStateRef = useRef(gameState);

  // Keep gameStateRef in sync with gameState
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initStars = () => {
      stars.current = Array.from({ length: 50 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        brightness: Math.random() * 0.5 + 0.5, // 0.5 to 1.0
        brightnessSpeed: Math.random() * 0.02 + 0.01, // speed of twinkle
      }));
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
        initStars();
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let frameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const star of stars.current) {
        // Always animate brightness (twinkling)
        star.brightness += star.brightnessSpeed;
        if (star.brightness > 1 || star.brightness < 0.3) {
          star.brightnessSpeed *= -1;
        }

        // Only move stars when rocket is flying
        if (gameStateRef.current === 'running') {
          star.y += star.speed;
          star.x -= star.speed;
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          } else if (star.x < 0) {
            star.x = canvas.width;
            star.y = Math.random() * canvas.width;
          }
        }

        // Draw star with current brightness
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
};
