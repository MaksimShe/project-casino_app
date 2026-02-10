import { useMinesStore } from '@/stores/useMinesStore';
import { MinesCellState, type GridSize } from '@/types/mines';
import { MinesCell } from './MinesCell';
import { EndGameModal } from '@/shared/EndGameModal';
import { GRID_DIMENSIONS } from '@/components/MinesGame/constants';
import { useTranslation } from '@/i18n/useTranslation';

interface MinesBoardProps {
  onCellClick: (index: number) => void;
  onNewGame: () => void;
}

export const MinesBoard = ({ onCellClick, onNewGame }: MinesBoardProps) => {
  const { t } = useTranslation();
  const {
    gridSize,
    cells,
    showWinModal,
    showLoseModal,
    modalData,
    isDisabled,
  } = useMinesStore();

  const dimensions = GRID_DIMENSIONS[gridSize as GridSize];
  const totalCells = gridSize * gridSize;

  const getCellState = (index: number): MinesCellState => {
    return cells.get(index) || MinesCellState.UNREVEALED;
  };

  return (
    <div className="relative flex aspect-square w-[500px] items-center justify-center max-sm:w-full">
      <div
        key={`grid-${gridSize}`}
        className="grid h-full w-full gap-2 max-sm:gap-1"
        style={{
          gridTemplateColumns: `repeat(${dimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${dimensions.rows}, 1fr)`,
        }}
      >
        {Array.from({ length: totalCells }, (_, index) => (
          <MinesCell
            key={`${gridSize}-${index}`}
            index={index}
            state={getCellState(index)}
            isDisabled={isDisabled()}
            onClick={onCellClick}
          />
        ))}
      </div>

      {(showWinModal || showLoseModal) && modalData && (
        <EndGameModal
          isWin={showWinModal}
          amount={modalData.amount}
          multiplier={modalData.multiplier}
          additionalInfo={`${t.modalWindows.tilesRevealed} ${modalData.tilesRevealed}`}
          onClose={onNewGame}
          betAmount={modalData.betAmount}
        />
      )}
    </div>
  );
};
