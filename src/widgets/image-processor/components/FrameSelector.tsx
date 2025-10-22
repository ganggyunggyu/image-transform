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
    value: 'line-thin',
    label: '얇은 선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="5" y1="6" x2="19" y2="6" strokeWidth={0.5} />
        <line x1="5" y1="18" x2="19" y2="18" strokeWidth={0.5} />
      </svg>
    ),
  },
  {
    value: 'line-medium',
    label: '중간 선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="5" y1="6" x2="19" y2="6" strokeWidth={1} />
        <line x1="5" y1="18" x2="19" y2="18" strokeWidth={1} />
      </svg>
    ),
  },
  {
    value: 'line-thick',
    label: '두꺼운 선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="5" y1="6" x2="19" y2="6" strokeWidth={1.5} />
        <line x1="5" y1="18" x2="19" y2="18" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    value: 'line-extra-thick',
    label: '매우 두꺼운 선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="5" y1="6" x2="19" y2="6" strokeWidth={2.5} />
        <line x1="5" y1="18" x2="19" y2="18" strokeWidth={2.5} />
      </svg>
    ),
  },
  {
    value: 'vline-thin',
    label: '얇은 세로선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="6" y1="5" x2="6" y2="19" strokeWidth={0.5} />
        <line x1="18" y1="5" x2="18" y2="19" strokeWidth={0.5} />
      </svg>
    ),
  },
  {
    value: 'vline-medium',
    label: '중간 세로선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="6" y1="5" x2="6" y2="19" strokeWidth={1} />
        <line x1="18" y1="5" x2="18" y2="19" strokeWidth={1} />
      </svg>
    ),
  },
  {
    value: 'vline-thick',
    label: '두꺼운 세로선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="6" y1="5" x2="6" y2="19" strokeWidth={1.5} />
        <line x1="18" y1="5" x2="18" y2="19" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    value: 'vline-extra-thick',
    label: '매우 두꺼운 세로선',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <line x1="6" y1="5" x2="6" y2="19" strokeWidth={2.5} />
        <line x1="18" y1="5" x2="18" y2="19" strokeWidth={2.5} />
      </svg>
    ),
  },
];

export const FrameSelector: React.FC<FrameSelectorProps> = ({ selectedShape, onShapeChange }) => {
  return (
    <div className={cn('flex gap-1.5 overflow-x-auto')}>
      {frameShapes.map((frame) => {
        const isSelected = selectedShape === frame.value;
        return (
          <button
            key={frame.value}
            onClick={() => onShapeChange(frame.value)}
            className={cn(
              'flex items-center justify-center rounded-lg border p-2 transition-all duration-200 flex-shrink-0',
              isSelected
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm active:scale-95 active:bg-slate-100'
            )}
          >
            {React.cloneElement(frame.icon as React.ReactElement, {
              className: 'w-5 h-5'
            })}
          </button>
        );
      })}
    </div>
  );
};
