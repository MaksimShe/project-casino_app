import { MinesCellState } from '@/types/mines';
import Image from 'next/image';
import cn from 'classnames';
import { MINES_IMAGES } from '@/components/MinesGame/constants';

interface MinesCellProps {
  index: number;
  state: MinesCellState;
  isDisabled: boolean;
  onClick: (index: number) => void;
}

export const MinesCell = ({
  index,
  state,
  isDisabled,
  onClick,
}: MinesCellProps) => {
  const isUsedCell = isDisabled || state !== MinesCellState.UNREVEALED;

  const handleClick = () => {
    if (isUsedCell) {
      return;
    }
    onClick(index);
  };

  const getCellContent = () => {
    const isRevealed =
      state === MinesCellState.SAFE || state === MinesCellState.MINE;

    if (isRevealed) {
      const isSafe = state === MinesCellState.SAFE;

      return (
        <div
          className={cn(
            'flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-b',
            isSafe
              ? 'from-[var(--btn-secondary-start)] to-[var(--btn-secondary-end)] shadow-[0_0_16px_0_#00FF0040]'
              : 'from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] shadow-[0_0_16px_0_#FF000040]'
          )}
        >
          <Image
            src={isSafe ? MINES_IMAGES.COIN : MINES_IMAGES.BOMB}
            alt={isSafe ? 'safe' : 'mine'}
            width={40}
            height={40}
            className="h-10 w-10 object-contain max-sm:h-8 max-sm:w-8"
          />
        </div>
      );
    }

    return (
      <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#0F0C29] shadow-[0_0_16px_0_#FFFFFF40] transition-all hover:scale-105 hover:brightness-110" />
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isUsedCell}
      className={cn(
        'h-full w-full rounded-2xl transition-transform active:scale-95',
        { 'cursor-pointer': isUsedCell },
        { 'cursor-default': !isUsedCell }
      )}
    >
      {getCellContent()}
    </button>
  );
};
