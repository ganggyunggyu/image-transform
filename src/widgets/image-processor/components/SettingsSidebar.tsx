import React from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  transformModeAtom,
  cornerPointsAtom,
  frameOptionsAtom,
} from '@/shared/stores/atoms';
import type { FrameOptions } from '@/shared/types';
import { PresetTransformButtons } from './PresetTransformButtons';
import { TransformModeSelector } from './TransformModeSelector';
import { CornerAdjustmentControls } from './CornerAdjustmentControls';
import { FrameSelector } from './FrameSelector';

export const SettingsSidebar: React.FC = () => {
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const cornerPoints = useAtomValue(cornerPointsAtom);
  const [frameOptions, setFrameOptions] = useAtom(frameOptionsAtom);
  const handleFrameOptionChange = React.useCallback((patch: Partial<FrameOptions>) => {
    setFrameOptions((prev) => ({ ...prev, ...patch }));
  }, [setFrameOptions]);

  const {
    adjustHorizontal,
    adjustVertical,
    adjustCornerPrecise,
    resetAllAdjustments,
    applyPresetTransform,
  } = useTransform();

  return (
    <aside className={cn('flex h-full w-full flex-col border-l border-slate-200/80 bg-white')}>
      <div className={cn('flex items-center justify-between border-b border-slate-200/80 px-6 py-5')}>
        <div className={cn('flex items-center gap-3')}>
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600'
          )}>
            Free
          </div>
          <div className={cn('space-y-1')}>
            <h3 className={cn('text-sm font-semibold text-slate-900')}>
              자유 변형 설정
            </h3>
            <p className={cn('text-xs text-slate-400')}>세밀한 컨트롤을 여기서 조정하세요.</p>
          </div>
        </div>
      </div>

      <div className={cn('flex-1 space-y-5 overflow-y-auto px-6 py-5')}>
        <section className={cn('space-y-3')}>
          <h4 className={cn('text-xs font-semibold uppercase tracking-[0.2em] text-slate-400')}>Frame</h4>
          <div className={cn('rounded-2xl border border-slate-200 bg-white p-4 space-y-4')}>
            <FrameSelector
              selectedShape={frameOptions.shape}
              onShapeChange={(shape) => handleFrameOptionChange({ shape })}
            />

            {frameOptions.shape !== 'none' && (
              <>
                <div className={cn('space-y-2')}>
                  <label className={cn('text-xs font-semibold text-slate-600')}>패딩</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={frameOptions.padding}
                    onChange={(e) => handleFrameOptionChange({ padding: Number(e.target.value) })}
                    className={cn('w-full')}
                  />
                  <span className={cn('text-xs text-slate-400')}>{frameOptions.padding}px</span>
                </div>

                <div className={cn('space-y-2')}>
                  <label className={cn('text-xs font-semibold text-slate-600')}>테두리 두께</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={frameOptions.borderWidth}
                    onChange={(e) => handleFrameOptionChange({ borderWidth: Number(e.target.value) })}
                    className={cn('w-full')}
                  />
                  <span className={cn('text-xs text-slate-400')}>{frameOptions.borderWidth}px</span>
                </div>

                {frameOptions.borderWidth > 0 && (
                  <>
                    <div className={cn('space-y-2')}>
                      <label className={cn('text-xs font-semibold text-slate-600')}>테두리 색상</label>
                      <input
                        type="color"
                        value={frameOptions.borderColor}
                        onChange={(e) => handleFrameOptionChange({ borderColor: e.target.value })}
                        className={cn('h-10 w-full rounded-xl border border-slate-200')}
                      />
                    </div>

                    <div className={cn('space-y-2')}>
                      <label className={cn('text-xs font-semibold text-slate-600')}>테두리 투명도</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={frameOptions.borderOpacity}
                        onChange={(e) => handleFrameOptionChange({ borderOpacity: Number(e.target.value) })}
                        className={cn('w-full')}
                      />
                      <span className={cn('text-xs text-slate-400')}>{Math.round(frameOptions.borderOpacity * 100)}%</span>
                    </div>
                  </>
                )}

                {frameOptions.shape === 'rounded' && (
                  <div className={cn('space-y-2')}>
                    <label className={cn('text-xs font-semibold text-slate-600')}>모서리 반경</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={frameOptions.cornerRadius}
                      onChange={(e) => handleFrameOptionChange({ cornerRadius: Number(e.target.value) })}
                      className={cn('w-full')}
                    />
                    <span className={cn('text-xs text-slate-400')}>{frameOptions.cornerRadius}px</span>
                  </div>
                )}

                <div className={cn('flex items-center gap-2')}>
                  <input
                    type="checkbox"
                    id="shadowEnabled"
                    checked={frameOptions.shadowEnabled}
                    onChange={(e) => handleFrameOptionChange({ shadowEnabled: e.target.checked })}
                    className={cn('h-4 w-4 rounded border-slate-300')}
                  />
                  <label htmlFor="shadowEnabled" className={cn('text-xs font-semibold text-slate-600')}>
                    그림자 효과
                  </label>
                </div>

                {frameOptions.shadowEnabled && (
                  <>
                    <div className={cn('space-y-2')}>
                      <label className={cn('text-xs font-semibold text-slate-600')}>그림자 색상</label>
                      <input
                        type="color"
                        value={frameOptions.shadowColor}
                        onChange={(e) => handleFrameOptionChange({ shadowColor: e.target.value })}
                        className={cn('h-10 w-full rounded-xl border border-slate-200')}
                      />
                    </div>

                    <div className={cn('space-y-2')}>
                      <label className={cn('text-xs font-semibold text-slate-600')}>그림자 투명도</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={frameOptions.shadowOpacity}
                        onChange={(e) => handleFrameOptionChange({ shadowOpacity: Number(e.target.value) })}
                        className={cn('w-full')}
                      />
                      <span className={cn('text-xs text-slate-400')}>{Math.round(frameOptions.shadowOpacity * 100)}%</span>
                    </div>

                    <div className={cn('space-y-2')}>
                      <label className={cn('text-xs font-semibold text-slate-600')}>그림자 흐림 정도</label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={frameOptions.shadowBlur}
                        onChange={(e) => handleFrameOptionChange({ shadowBlur: Number(e.target.value) })}
                        className={cn('w-full')}
                      />
                      <span className={cn('text-xs text-slate-400')}>{frameOptions.shadowBlur}px</span>
                    </div>

                    <div className={cn('grid grid-cols-2 gap-3')}>
                      <div className={cn('space-y-2')}>
                        <label className={cn('text-xs font-semibold text-slate-600')}>X 위치</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={frameOptions.shadowOffsetX}
                          onChange={(e) => handleFrameOptionChange({ shadowOffsetX: Number(e.target.value) })}
                          className={cn('w-full')}
                        />
                        <span className={cn('text-xs text-slate-400')}>{frameOptions.shadowOffsetX}px</span>
                      </div>

                      <div className={cn('space-y-2')}>
                        <label className={cn('text-xs font-semibold text-slate-600')}>Y 위치</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={frameOptions.shadowOffsetY}
                          onChange={(e) => handleFrameOptionChange({ shadowOffsetY: Number(e.target.value) })}
                          className={cn('w-full')}
                        />
                        <span className={cn('text-xs text-slate-400')}>{frameOptions.shadowOffsetY}px</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

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
      </div>
    </aside>
  );
};
