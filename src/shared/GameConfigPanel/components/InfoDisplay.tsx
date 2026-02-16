import { type FC } from 'react';

interface InfoItem {
  label: string;
  value?: string | number;
}

interface InfoDisplayProps {
  items: InfoItem[];
}

export const InfoDisplay: FC<InfoDisplayProps> = ({ items }) => {
  if (!items.length) return null;

  // Show info if any values are defined and not default values
  const hasActualInfo = items.some(item => {
    return !(
      item.value === undefined ||
      item.value === null ||
      item.value === 0 ||
      item.value === '0'
    );
  });

  return (
    hasActualInfo && (
      <div className="space-y-2 border-t pt-2 text-sm">
        {items.map(item => (
          <div key={item.label} className="flex justify-between">
            <span className="text-[color:var(--second-text-color)]">
              {item.label}
            </span>
            <span className="font-bold text-[color:var(--system-success-color)]">
              {item.value ?? '0'}
            </span>
          </div>
        ))}
      </div>
    )
  );
};
