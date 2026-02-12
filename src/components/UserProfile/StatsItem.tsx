import { type FC } from 'react';

type StatsItemProps = {
  title: string;
  description: string | number;
};

export const StatsItem: FC<StatsItemProps> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-base text-[var(--second-text-color)]">{title}</span>
      <span className="text-2xl font-semibold text-[var(--main-text-color)]">
        {description}
      </span>
    </div>
  );
};
