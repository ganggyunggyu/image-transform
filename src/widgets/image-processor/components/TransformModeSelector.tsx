import React from 'react';
import { cn } from '@/shared/lib';
import type { TransformMode } from '@/shared/types';

interface TransformModeSelectorProps {
  transformMode: TransformMode;
  onModeChange: (mode: TransformMode) => void;
}

export const TransformModeSelector: React.FC<TransformModeSelectorProps> = ({
  transformMode,
  onModeChange,
}) => {
  const modes = [
    { value: 'free', label: '자유', desc: '모든 점 독립' },
    { value: 'perspective', label: '원근', desc: '원근법 적용' },
    { value: 'distort', label: '왜곡', desc: '형태 변형' },
    { value: 'skew', label: '기울기', desc: '평행 유지' },
  ];

  return (
    <div className={cn('grid grid-cols-2 gap-2')}>
      {modes.map(({ value, label, desc }) => (
        <button
          key={value}
          onClick={() => onModeChange(value as TransformMode)}
          className={cn(
            'rounded-xl border px-3 py-2.5 text-left transition-colors',
            transformMode === value
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
          )}
        >
          <div className={cn('text-sm font-semibold')}>{label}</div>
          <div className={cn('text-[11px] text-slate-400')}>{desc}</div>
        </button>
      ))}
    </div>
  );
};
