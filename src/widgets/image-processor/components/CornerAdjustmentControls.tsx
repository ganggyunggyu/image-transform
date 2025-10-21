import React from 'react';
import { cn } from '@/shared/lib';
import type { Point, TransformMode } from '@/shared/types';

type CornerKey = 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft';

interface CornerAdjustmentControlsProps {
  cornerPoints: Point[];
  transformMode: TransformMode;
  onAdjustCorner: (corner: CornerKey, axis: 'x' | 'y', delta: number) => void;
}

export const CornerAdjustmentControls: React.FC<CornerAdjustmentControlsProps> = ({
  cornerPoints,
  transformMode,
  onAdjustCorner,
}) => {
  const corners = [
    { label: '↖', name: '좌상', corner: 'topLeft' as CornerKey, index: 0 },
    { label: '↗', name: '우상', corner: 'topRight' as CornerKey, index: 1 },
    { label: '↘', name: '우하', corner: 'bottomRight' as CornerKey, index: 2 },
    { label: '↙', name: '좌하', corner: 'bottomLeft' as CornerKey, index: 3 },
  ];

  return (
    <div className={cn('space-y-2')}>
      {corners.map(({ label, name, corner, index }) => {
        const point = cornerPoints[index];
        const isActive =
          transformMode === 'free' ||
          (transformMode === 'perspective' && (index === 0 || index === 2)) ||
          transformMode === 'distort' ||
          transformMode === 'skew';

        return (
          <div
            key={corner}
            className={cn(
              'rounded-xl border px-3 py-3 transition-colors',
              isActive
                ? 'border-slate-200 bg-white'
                : 'border-slate-100 bg-slate-50 opacity-60'
            )}
          >
            <div className={cn('mb-2 flex items-center justify-between')}> 
              <div className={cn('flex items-center gap-2')}>
                <span className={cn('text-base text-slate-400')}>{label}</span>
                <span className={cn('text-sm font-semibold text-slate-700')}>
                  {name}
                </span>
              </div>
              <span className={cn('font-mono text-[11px] text-slate-400')}>
                {Math.round(point[0])}, {Math.round(point[1])}
              </span>
            </div>

            {isActive && (
              <div className={cn('flex gap-2')}>
                {/* X Axis Controls */}
                <div className={cn('flex-1')}>
                  <div className={cn('flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5')}>
                    <span className={cn('ml-1 text-[10px] font-semibold text-slate-500')}>X</span>
                    <div className={cn('flex gap-0.5')}>
                      <button
                        onClick={() => onAdjustCorner(corner, 'x', -1)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500',
                          'transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
                          'active:scale-90 active:bg-slate-100'
                        )}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onAdjustCorner(corner, 'x', 1)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500',
                          'transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
                          'active:scale-90 active:bg-slate-100'
                        )}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Y Axis Controls */}
                <div className={cn('flex-1')}>
                  <div className={cn('flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1.5')}>
                    <span className={cn('ml-1 text-[10px] font-semibold text-slate-500')}>Y</span>
                    <div className={cn('flex gap-0.5')}>
                      <button
                        onClick={() => onAdjustCorner(corner, 'y', -1)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500',
                          'transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
                          'active:scale-90 active:bg-slate-100'
                        )}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onAdjustCorner(corner, 'y', 1)}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500',
                          'transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300',
                          'active:scale-90 active:bg-slate-100'
                        )}
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
