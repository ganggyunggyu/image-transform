import React from 'react';
import { cn } from '@/shared/lib';
import type { FrameShape } from '@/shared/types';
import { FramePreviewButton } from './FramePreviewButton';

interface FrameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedShape: FrameShape;
  onShapeChange: (shape: FrameShape) => void;
}

type LineType = 'thin' | 'medium' | 'thick' | 'extra-thick';
type LineDirection = 'horizontal' | 'vertical';
type LineColor = 'white' | 'black';

const generateLineFrames = (
  direction: LineDirection,
  types: LineType[],
  colors: LineColor[]
): { value: FrameShape; label: string; icon: React.ReactNode }[] => {
  const prefix = direction === 'horizontal' ? 'line' : 'vline';
  const directionLabel = direction === 'horizontal' ? '가로' : '세로';
  const typeLabels: Record<LineType, string> = {
    thin: '얇은',
    medium: '중간',
    thick: '두꺼운',
    'extra-thick': '매우두꺼운',
  };
  const strokeWidths: Record<LineType, number> = {
    thin: 0.5,
    medium: 1,
    thick: 1.5,
    'extra-thick': 2.5,
  };
  const frames: { value: FrameShape; label: string; icon: React.ReactNode }[] = [];

  for (const color of colors) {
    for (const type of types) {
      const value = `${prefix}-${type}-${color}` as FrameShape;
      const label = `${directionLabel} ${typeLabels[type]} ${color === 'white' ? '흰색' : '검정'}`;
      const strokeWidth = strokeWidths[type];

      const icon =
        direction === 'horizontal' ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <line x1="5" y1="6" x2="19" y2="6" strokeWidth={strokeWidth} />
            <line x1="5" y1="18" x2="19" y2="18" strokeWidth={strokeWidth} />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
            <line x1="6" y1="5" x2="6" y2="19" strokeWidth={strokeWidth} />
            <line x1="18" y1="5" x2="18" y2="19" strokeWidth={strokeWidth} />
          </svg>
        );

      frames.push({ value, label, icon });
    }
  }

  return frames;
};

const baseFrames: { value: FrameShape; label: string; icon: React.ReactNode }[] = [
  {
    value: 'none',
    label: '없음',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  {
    value: 'rectangle',
    label: '사각형',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <rect x="4" y="4" width="16" height="16" strokeWidth={1.5} rx="0" />
      </svg>
    ),
  },
];

const lineTypes: LineType[] = ['thin', 'medium', 'thick', 'extra-thick'];

const frameShapes = [
  ...baseFrames,
  ...generateLineFrames('horizontal', lineTypes, ['white']),
  ...generateLineFrames('horizontal', lineTypes, ['black']),
  ...generateLineFrames('vertical', lineTypes, ['white']),
  ...generateLineFrames('vertical', lineTypes, ['black']),
];

export const FrameSelectorModal: React.FC<FrameSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedShape,
  onShapeChange,
}) => {
  if (!isOpen) return null;

  const handleSelect = (shape: FrameShape) => {
    onShapeChange(shape);
  };

  return (
    <div
      className={cn(
        'absolute inset-0 z-50 bg-white'
      )}
    >
      <div className={cn('flex h-full flex-col')}>
        <div className={cn('flex items-center justify-between border-b border-slate-200 px-6 py-4')}>
          <h3 className={cn('text-sm font-semibold text-slate-900')}>
            프레임 선택
          </h3>
          <button
            onClick={onClose}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-full',
              'text-slate-400 hover:text-slate-900 hover:bg-slate-100',
              'transition-all duration-200'
            )}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={cn('flex-1 overflow-y-auto p-6')}>
          <div className={cn('grid grid-cols-3 gap-3')}>
            {frameShapes.map((frame) => (
              <FramePreviewButton
                key={frame.value}
                shape={frame.value}
                icon={frame.icon}
                isSelected={selectedShape === frame.value}
                onClick={() => handleSelect(frame.value)}
              />
            ))}
          </div>
        </div>

        <div className={cn('border-t border-slate-200 p-4')}>
          <button
            onClick={onClose}
            className={cn(
              'w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white',
              'transition-all duration-200',
              'hover:bg-slate-800 hover:shadow-sm',
              'active:scale-95'
            )}
          >
            완료
          </button>
        </div>
      </div>
    </div>
  );
};
