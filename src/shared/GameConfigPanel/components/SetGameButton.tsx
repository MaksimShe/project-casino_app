import { type FC } from 'react';

interface SetBetButtonsProps {
  name: string;
}

export const SetGameButton: FC<SetBetButtonsProps> = ({ name }) => {
  return (
    <button className="h-8 rounded-sm bg-[#302C55] px-4 text-sm text-[var(--main-text-color)]">
      {name}
    </button>
  );
};
