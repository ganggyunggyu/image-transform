import React from 'react';
import { cn } from '@/shared/lib';
import type { FrameShape } from '@/shared/types';

interface FramePreviewButtonProps {
  shape: FrameShape;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const FramePreviewButton: React.FC<FramePreviewButtonProps> = ({
  shape,
  icon,
  isSelected,
  onClick,
}) => {
  const getStrokeColor = () => {
    if (isSelected) return '#ffffff';
    if (shape.includes('white')) return '#cbd5e1';
    if (shape.includes('black')) return '#1e293b';
    return 'currentColor';
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-xl border p-2 transition-all duration-200 aspect-square',
        isSelected
          ? 'border-slate-900 bg-slate-900 shadow-lg'
          : 'border-slate-200 bg-gradient-to-br from-slate-50 to-white hover:border-slate-900 hover:shadow-md active:scale-95'
      )}
    >
      <div className={cn('w-full h-full flex items-center justify-center')}>
        {React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<any>, {
            style: { width: '100%', height: '100%', stroke: getStrokeColor() },
          })}
      </div>
    </button>
  );
};
