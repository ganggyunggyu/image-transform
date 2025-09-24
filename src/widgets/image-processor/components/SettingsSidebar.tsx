import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  activeTabAtom,
  transformModeAtom,
  cornerPointsAtom,
  rotationAtom,
  flipHorizontalAtom,
  flipVerticalAtom,
} from '@/shared/stores/atoms';
import { PresetTransformButtons } from './PresetTransformButtons';
import { TransformModeSelector } from './TransformModeSelector';
import { CornerAdjustmentControls } from './CornerAdjustmentControls';

export const SettingsSidebar: React.FC = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const cornerPoints = useAtomValue(cornerPointsAtom);
  const [rotation, setRotation] = useAtom(rotationAtom);
  const [flipHorizontal, setFlipHorizontal] = useAtom(flipHorizontalAtom);
  const [flipVertical, setFlipVertical] = useAtom(flipVerticalAtom);

  const {
    adjustHorizontal,
    adjustVertical,
    adjustCornerPrecise,
    resetAllAdjustments,
    applyPresetTransform,
  } = useTransform();

  const handleResetRotation = React.useCallback(() => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  }, [setRotation, setFlipHorizontal, setFlipVertical]);

  return (
    <aside className={cn('flex h-full w-full flex-col border-l border-slate-200/80 bg-white')}> 
      <div className={cn('flex items-center justify-between border-b border-slate-200/80 px-6 py-5')}>
        <div className={cn('flex items-center gap-3')}> 
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600'
          )}>
            {activeTab === 0 ? 'Free' : 'Rotate'}
          </div>
          <div className={cn('space-y-1')}> 
            <h3 className={cn('text-sm font-semibold text-slate-900')}>
              {activeTab === 0 ? '자유 변형 설정' : '회전 설정'}
            </h3>
            <p className={cn('text-xs text-slate-400')}>세밀한 컨트롤을 여기서 조정하세요.</p>
          </div>
        </div>
      </div>

      <div className={cn('flex-1 space-y-5 overflow-y-auto px-6 py-5')}> 
        {activeTab === 0 ? (
          <React.Fragment>
            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Presets</h4>
              <div className={cn('rounded-2xl border border-slate-200 bg-slate-50/60 p-4')}> 
                <PresetTransformButtons onApplyPreset={applyPresetTransform} />
              </div>
            </section>

            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Mode</h4>
              <div className={cn('rounded-2xl border border-slate-200 bg-white p-4')}> 
                <TransformModeSelector transformMode={transformMode} onModeChange={setTransformMode} />
              </div>
            </section>

            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Adjust</h4>
              <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 space-y-4')}> 
                <div className={cn('grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500')}> 
                  <div className={cn('space-y-2 text-center')}> 
                    <p>상하 이동</p>
                    <div className={cn('flex items-center justify-center gap-2')}>
                      <button
                        onClick={() => adjustVertical('up', 2)}
                        className={cn('h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900')}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => adjustVertical('down', 2)}
                        className={cn('h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900')}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={cn('space-y-2 text-center')}> 
                    <p>좌우 이동</p>
                    <div className={cn('flex items-center justify-center gap-2')}>
                      <button
                        onClick={() => adjustHorizontal('left', 2)}
                        className={cn('h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900')}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => adjustHorizontal('right', 2)}
                        className={cn('h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900')}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <CornerAdjustmentControls
                  cornerPoints={cornerPoints}
                  transformMode={transformMode}
                  onAdjustCorner={adjustCornerPrecise}
                />

                <button
                  onClick={resetAllAdjustments}
                  className={cn(
                    'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-900 hover:text-slate-900'
                  )}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  모서리 초기화
                </button>
              </div>
            </section>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Rotation</h4>
              <div className={cn('rounded-2xl border border-slate-200 bg-white p-5 space-y-4')}> 
                <div className={cn('text-center text-2xl font-bold text-slate-900')}>
                  {rotation}°
                </div>
                <input
                  type="range"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  min="-180"
                  max="180"
                  step="1"
                  className={cn('w-full accent-slate-900')}
                />
                <div className={cn('flex justify-between text-[11px] text-slate-400')}>
                  <span>-180°</span>
                  <span>0°</span>
                  <span>180°</span>
                </div>
                <div className={cn('grid grid-cols-4 gap-2 pt-3')}>
                  {[0, 90, 180, -90].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      className={cn(
                        'rounded-xl border px-3 py-2 text-xs font-semibold transition-colors',
                        rotation === angle
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
                      )}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Flip</h4>
              <div className={cn('space-y-3')}> 
                <button
                  onClick={() => setFlipHorizontal(!flipHorizontal)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
                    flipHorizontal
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
                  )}
                >
                  <span>좌우 반전</span>
                  <span className={cn('text-xs font-medium')}>{flipHorizontal ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => setFlipVertical(!flipVertical)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
                    flipVertical
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-900 hover:text-slate-900'
                  )}
                >
                  <span>상하 반전</span>
                  <span className={cn('text-xs font-medium')}>{flipVertical ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </section>

            <section className={cn('space-y-3')}> 
              <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Reset</h4>
              <button
                onClick={handleResetRotation}
                className={cn(
                  'inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-900 hover:text-slate-900'
                )}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                회전 초기화
              </button>
            </section>
          </React.Fragment>
        )}
      </div>
    </aside>
  );
};
