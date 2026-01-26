import { CRASH_POINT_COLOR_THRESHOLDS } from './constants';

export function getCrashPointColorClass(crashPoint: number): string {
  if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.YELLOW) {
    return 'bg-[var(--history-gray-bg)] text-[var(--history-gray-text)]';
  } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.BLUE) {
    return 'bg-[var(--history-yellow-bg)] text-[var(--history-yellow-text)]';
  } else if (crashPoint < CRASH_POINT_COLOR_THRESHOLDS.PURPLE) {
    return 'bg-[var(--history-blue-bg)] text-[var(--history-blue-text)]';
  } else {
    return 'bg-[var(--history-purple-bg)] text-[var(--history-purple-text)]';
  }
}
