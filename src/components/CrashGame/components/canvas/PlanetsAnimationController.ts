import { useCrashStore } from '@/stores/useCrashStore';

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

const PLANET_COLORS = ['#7c6cff', '#ffb703', '#6a994e', '#adb5bd', '#5dade2'];
const PLANET_SPEED = 0.2;

export class PlanetsAnimationController {
  private planet: Planet | null = null;
  private currentRadius: number = 90;
  private previousWidth: number = 0;

  initialize(width: number, height: number, radius: number = 90): void {
    const wasSmallScreen = this.previousWidth < 640;
    const isSmallScreen = width < 640;
    const crossedBreakpoint =
      this.previousWidth > 0 && wasSmallScreen !== isSmallScreen;

    this.currentRadius = radius;
    this.previousWidth = width;

    if (this.planet && crossedBreakpoint) {
      this.updatePlanetPosition(width, height, radius);
    } else if (!this.planet) {
      this.planet = this.createPlanet(width * 0.85, height * 0.3, radius);
    }
  }

  private updatePlanetPosition(
    width: number,
    height: number,
    radius: number
  ): void {
    if (!this.planet) return;

    const oldRadius = this.planet.radius;
    const scale = radius / oldRadius;

    this.planet.radius = radius;
    this.planet.x = Math.min(this.planet.x * scale, width - radius);
    this.planet.y = Math.min(this.planet.y * scale, height - radius);

    const craterCount = Math.floor(radius / 4);
    this.planet.craters = Array.from({ length: craterCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius * 0.7;

      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        r: Math.random() * radius * 0.12 + radius * 0.04,
      };
    });
  }

  animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gameState = useCrashStore.getState().gameState;

    if (this.planet && gameState === 'running') {
      this.movePlanet();

      if (this.isPlanetOffscreen(canvas)) {
        this.respawnPlanet(canvas);
      }
    }

    if (this.planet) {
      this.drawPlanet(ctx, this.planet);
    }
  }

  private createPlanet(x: number, y: number, radius: number): Planet {
    const color =
      PLANET_COLORS[Math.floor(Math.random() * PLANET_COLORS.length)];
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

  private movePlanet(): void {
    if (!this.planet) return;

    this.planet.x -= PLANET_SPEED;
    this.planet.y += PLANET_SPEED;
  }

  private isPlanetOffscreen(canvas: HTMLCanvasElement): boolean {
    if (!this.planet) return false;

    return (
      this.planet.x + this.planet.radius < 0 ||
      this.planet.y - this.planet.radius > canvas.height
    );
  }

  private respawnPlanet(canvas: HTMLCanvasElement): void {
    if (!this.planet) return;

    const margin = 70;
    const spawnFromRight = Math.random() > 0.5;

    if (spawnFromRight) {
      this.planet = this.createPlanet(
        canvas.width + margin,
        Math.random() * canvas.height * 0.6,
        this.currentRadius
      );
    } else {
      this.planet = this.createPlanet(
        Math.random() * canvas.width * 0.6,
        -margin,
        this.currentRadius
      );
    }
  }

  private drawPlanet(ctx: CanvasRenderingContext2D, planet: Planet): void {
    const { x, y, radius, color, craters } = planet;

    this.drawPlanetSphere(ctx, x, y, radius, color);
    this.drawPlanetRim(ctx, x, y, radius);
    this.drawCraters(ctx, x, y, craters);
  }

  private drawPlanetSphere(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string
  ): void {
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
  }

  private drawPlanetRim(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number
  ): void {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#00000055';
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();
  }

  private drawCraters(
    ctx: CanvasRenderingContext2D,
    planetX: number,
    planetY: number,
    craters: Crater[]
  ): void {
    for (const crater of craters) {
      const cx = planetX + crater.x;
      const cy = planetY + crater.y;

      const gradient = ctx.createRadialGradient(
        cx - crater.r * 0.3,
        cy - crater.r * 0.3,
        crater.r * 0.2,
        cx,
        cy,
        crater.r
      );

      gradient.addColorStop(0, '#00000066');
      gradient.addColorStop(1, '#00000000');

      ctx.beginPath();
      ctx.arc(cx, cy, crater.r, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }
}
