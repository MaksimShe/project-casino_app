'use client';

import { useEffect, useRef } from 'react';
import { useCrashStore } from '@/stores/useCrashStore';

/* ---------- CONFIG ---------- */

const PLANET_COLORS = ['#7c6cff', '#ffb703', '#6a994e', '#adb5bd', '#5dade2'];

const PLANET_SPEED = 0.5; // ← ВОТ СКОРОСТЬ ДВИЖЕНИЯ

/* ---------- TYPES ---------- */

type Crater = {
  x: number;
  y: number;
  r: number;
};

type Planet = {
  x: number;
  y: number;
  radius: number;
  color: string;
  craters: Crater[];
};

function createPlanet(x: number, y: number, radius: number): Planet {
  const color = PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)];

  const craterCount = Math.floor(radius / 4);

  const craters: Crater[] = Array.from({ length: craterCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * radius * 0.7;

    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      r: Math.random() * radius * 0.12 + radius * 0.04,
    };
  });

  return { x, y, radius, color, craters };
}

function drawPlanet(ctx: CanvasRenderingContext2D, planet: Planet) {
  const { x, y, radius, color, craters } = planet;

  /* base sphere */
  const gradient = ctx.createRadialGradient(
    x - radius * 0.35,
    y - radius * 0.35,
    radius * 0.2,
    x,
    y,
    radius
  );

  gradient.addColorStop(0, '#ffffff33');
  gradient.addColorStop(0.4, color);
  gradient.addColorStop(1, '#000000aa');

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();

  /* rim shadow */
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = '#00000055';
  ctx.lineWidth = radius * 0.05;
  ctx.stroke();

  /* craters */
  for (const crater of craters) {
    const cx = x + crater.x;
    const cy = y + crater.y;

    const g = ctx.createRadialGradient(
      cx - crater.r * 0.3,
      cy - crater.r * 0.3,
      crater.r * 0.2,
      cx,
      cy,
      crater.r
    );

    g.addColorStop(0, '#00000066');
    g.addColorStop(1, '#00000000');

    ctx.beginPath();
    ctx.arc(cx, cy, crater.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }
}

/* ---------- COMPONENT ---------- */

export const PlanetsCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const planetRef = useRef<Planet | null>(null);

  const gameState = useCrashStore(state => state.gameState);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      if (!planetRef.current) {
        planetRef.current = createPlanet(
          canvas.width * 0.85,
          canvas.height * 0.3,
          90
        );
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let frameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const p = planetRef.current;

      if (p && gameStateRef.current === 'running') {
        // move diagonally
        p.x -= PLANET_SPEED;
        p.y += PLANET_SPEED;

        const margin = 70;

        // planet left screen → create NEW one
        if (p.x + p.radius < 0 || p.y - p.radius > canvas.height) {
          if (Math.random() > 0.5) {
            // spawn from right
            planetRef.current = createPlanet(
              canvas.width + margin,
              Math.random() * canvas.height * 0.6,
              p.radius
            );
          } else {
            // spawn from top
            planetRef.current = createPlanet(
              Math.random() * canvas.width * 0.6,
              -margin,
              p.radius
            );
          }

          frameId = requestAnimationFrame(animate);
          return;
        }
      }

      if (planetRef.current) {
        drawPlanet(ctx, planetRef.current);
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
