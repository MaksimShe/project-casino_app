import { RISK_LEVEL, type RiskLevel } from '../constants';

export function generateMultipliers(risk: RiskLevel, lines: number): number[] {
  // This is a placeholder implementation
  // In production, always fetch multipliers from backend via PlinkoService
  // These are approximate values for initial display only

  const slots = lines + 1; // Number of slots = lines + 1
  const multipliers: number[] = [];

  // Symmetric distribution
  const half = Math.floor(slots / 2);

  for (let i = 0; i < slots; i++) {
    const distanceFromCenter = Math.abs(i - half);
    let multiplier: number;

    if (risk === RISK_LEVEL.HIGH) {
      // High risk: extreme values at edges
      switch (distanceFromCenter) {
        case half:
          multiplier = 110;
          break;
        case half - 1:
          multiplier = 41;
          break;
        case half - 2:
          multiplier = 10;
          break;
        case half - 3:
          multiplier = 5;
          break;
        case half - 4:
          multiplier = 3;
          break;
        default:
          multiplier = 1;
      }
    } else if (risk === RISK_LEVEL.MEDIUM) {
      // Medium risk: moderate distribution
      switch (distanceFromCenter) {
        case half:
          multiplier = 16;
          break;
        case half - 1:
          multiplier = 9;
          break;
        case half - 2:
          multiplier = 3;
          break;
        case half - 3:
          multiplier = 1.5;
          break;
        default:
          multiplier = 1;
      }
    } else {
      // Low risk: conservative values
      switch (distanceFromCenter) {
        case half:
          multiplier = 5.6;
          break;
        case half - 1:
          multiplier = 2.1;
          break;
        case half - 2:
          multiplier = 1.5;
          break;
        default:
          multiplier = 1.1;
      }
    }

    multipliers.push(multiplier);
  }

  return multipliers;
}
