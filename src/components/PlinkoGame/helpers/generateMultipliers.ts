/**
 * Generate multiplier array for display purposes
 * Note: Backend is the source of truth for multipliers.
 * This is used only for initial UI display before fetching from API.
 *
 * @param risk Risk level
 * @param lines Number of lines
 * @returns Array of multipliers (for display only)
 */
export function generateMultipliers(
  risk: 'low' | 'medium' | 'high',
  lines: number
): number[] {
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

    if (risk === 'high') {
      // High risk: extreme values at edges
      multiplier =
        distanceFromCenter === half
          ? 110
          : distanceFromCenter === half - 1
            ? 41
            : distanceFromCenter === half - 2
              ? 10
              : distanceFromCenter === half - 3
                ? 5
                : distanceFromCenter === half - 4
                  ? 3
                  : 1;
    } else if (risk === 'medium') {
      // Medium risk: moderate distribution
      multiplier =
        distanceFromCenter === half
          ? 16
          : distanceFromCenter === half - 1
            ? 9
            : distanceFromCenter === half - 2
              ? 3
              : distanceFromCenter === half - 3
                ? 1.5
                : 1;
    } else {
      // Low risk: conservative values
      multiplier =
        distanceFromCenter === half
          ? 5.6
          : distanceFromCenter === half - 1
            ? 2.1
            : distanceFromCenter === half - 2
              ? 1.5
              : 1.1;
    }

    multipliers.push(multiplier);
  }

  return multipliers;
}
