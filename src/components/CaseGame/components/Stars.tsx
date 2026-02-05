import Image from 'next/image';
import starImg from '@/../public/cases-game/star.svg';
import { type FC } from 'react';

interface StarsProps {
  starsCount: number;
}

export const Stars: FC<StarsProps> = ({ starsCount }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: starsCount }).map((_, index) => (
        <Image key={index} src={starImg} alt="star" height={32} width={32} />
      ))}
    </div>
  );
};
