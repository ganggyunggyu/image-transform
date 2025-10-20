import React from 'react';
import { cn } from '@/shared/lib';
import type { FrameShape } from '@/shared/types';

interface FrameSelectorProps {
  selectedShape: FrameShape;
  onShapeChange: (shape: FrameShape) => void;
}

const frameShapes: { value: FrameShape; label: string; icon: React.ReactNode }[] = [
  {
    value: 'none',
    label: '없음',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  {
    value: 'rectangle',
    label: '사각형',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" strokeWidth={1.5} rx="0" />
      </svg>
    ),
  },
  {
    value: 'rounded',
    label: '둥근 사각형',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" strokeWidth={1.5} rx="3" />
      </svg>
    ),
  },
  {
    value: 'circle',
    label: '원형',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="8" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    value: 'polaroid',
    label: '폴라로이드',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="3" width="16" height="18" strokeWidth={1.5} rx="1" />
        <line x1="4" y1="16" x2="20" y2="16" strokeWidth={1.5} />
      </svg>
    ),
  },
];

export const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedShape, onShapeChange }) => {
  return (
    <div className={cn('grid grid-cols-2 gap-2')}>
      {frameShapes.map((frame) => {
        const isSelected = selectedShape === frame.value;
        return (
          <button
            key={frame.value}
            onClick={() => onShapeChange(frame.value)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition-all duration-200',
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
            )}
          >
            {frame.icon}
            <span>{frame.label}</span>
          </button>
        );
      })}
    </div>
  );
};
