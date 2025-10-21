import React from 'react';
import { cn } from '@/shared/lib';

interface PresetTransformButtonsProps {
  onApplyPreset: (presetType: string) => void;
}

export const PresetTransformButtons: React.FC<PresetTransformButtonsProps> = ({
  onApplyPreset,
}) => {
  const mainPresets = [
    { value: 'perspective-left', label: '좌측', icon: '←' },
    { value: 'perspective-right', label: '우측', icon: '→' },
    { value: 'perspective-top', label: '상단', icon: '↑' },
    { value: 'perspective-bottom', label: '하단', icon: '↓' },
  ];

  const additionalPresets = [
    { value: 'skew-left', label: '좌 기울기', icon: '⤡' },
    { value: 'skew-right', label: '우 기울기', icon: '⤢' },
    { value: 'tilt-left', label: '좌 틸트', icon: '↙' },
    { value: 'tilt-right', label: '우 틸트', icon: '↗' },
    { value: 'expand', label: '확대', icon: '⤢' },
    { value: 'contract', label: '축소', icon: '⤡' },
  ];

  return (
    <React.Fragment>
      <div className={cn('grid grid-cols-2 gap-2')}>
        {mainPresets.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onApplyPreset(value)}
            className={cn(
              'group relative flex h-12 items-center justify-center gap-2 rounded-xl border px-3',
              'border-slate-200 bg-white text-slate-600 transition-all duration-200',
              'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
              'active:scale-95 active:bg-slate-100'
            )}
          >
            <span className={cn('text-lg font-semibold')}>{icon}</span>
            <span className={cn('text-xs font-semibold tracking-tight')}>{label}</span>
          </button>
        ))}
      </div>

      <div className={cn('mt-3 grid grid-cols-3 gap-2')}>
        {additionalPresets.map(({ value, label, icon }) => (
          <button
            key={value}
            onClick={() => onApplyPreset(value)}
            className={cn(
              'group flex h-10 flex-col items-center justify-center gap-1 rounded-lg border',
              'border-slate-200 bg-slate-50 text-[11px] text-slate-500 transition-all duration-200',
              'hover:border-slate-900 hover:bg-white hover:text-slate-900 hover:shadow-sm',
              'active:scale-95 active:bg-slate-100'
            )}
          >
            <span className={cn('text-xs font-semibold')}>{icon}</span>
            <span className={cn('text-[10px] font-medium tracking-tight uppercase')}>{label}</span>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
};
