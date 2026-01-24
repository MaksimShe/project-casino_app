import { useCrashStore } from '@/stores/useCrashStore';

type Star = {
  x: number;
  y: number;
  r: number;
  speed: number;
  brightness: number;
  brightnessSpeed: number;
};

export class StarsAnimationController {
  private stars: Star[] = [];
  private previousWidth: number = 0;
  private previousHeight: number = 0;

  constructor(private starCount: number = 50) {}

  initialize(width: number, height: number): void {
    if (
      this.stars.length > 0 &&
      this.previousWidth > 0 &&
      this.previousHeight > 0
    ) {
      this.updateStarPositions(width, height);
    } else {
      this.stars = Array.from({ length: this.starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
        brightness: Math.random() * 0.5 + 0.5,
        brightnessSpeed: Math.random() * 0.02 + 0.01,
      }));
    }

    this.previousWidth = width;
    this.previousHeight = height;
  }

  private updateStarPositions(width: number, height: number): void {
    const scaleX = width / this.previousWidth;
    const scaleY = height / this.previousHeight;

    for (const star of this.stars) {
      star.x = Math.min(star.x * scaleX, width);
      star.y = Math.min(star.y * scaleY, height);
    }
  }

  animate(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gameState = useCrashStore.getState().gameState;

    for (const star of this.stars) {
      this.updateStarBrightness(star);

      if (gameState === 'running') {
        this.moveStar(star, canvas);
      }

      this.drawStar(ctx, star);
    }
  }

  private updateStarBrightness(star: Star): void {
    star.brightness += star.brightnessSpeed;
    if (star.brightness > 1 || star.brightness < 0.3) {
      star.brightnessSpeed *= -1;
    }
  }

  private moveStar(star: Star, canvas: HTMLCanvasElement): void {
    star.y += star.speed;
    star.x -= star.speed;

    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    } else if (star.x < 0) {
      star.x = canvas.width;
      star.y = Math.random() * canvas.height;
    }
  }

  private drawStar(ctx: CanvasRenderingContext2D, star: Star): void {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }
}
