import { MinesCellState } from '@/types/mines';
import { MINES_CONSTANTS } from './constants';
import Image from 'next/image';
import cn from 'classnames';

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
    if (state === MinesCellState.SAFE) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--btn-secondary-start)] to-[var(--btn-secondary-end)] shadow-[0_0_16px_0_#00FF0040]">
          <Image
            src={MINES_CONSTANTS.COIN_IMAGE}
            alt="safe"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>
      );
    }

    if (state === MinesCellState.MINE) {
      return (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-b from-[var(--btn-primary-start)] to-[var(--btn-primary-end)] shadow-[0_0_16px_0_#FF000040]">
          <Image
            src={MINES_CONSTANTS.BOMB_IMAGE}
            alt="mine"
            width={40}
            height={40}
            className="object-contain"
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
