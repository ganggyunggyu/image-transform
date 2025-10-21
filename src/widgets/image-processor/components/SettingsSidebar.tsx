import React from 'react';
import { useAtom } from 'jotai';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  transformModeAtom,
  frameOptionsAtom,
} from '@/shared/stores/atoms';
import type { FrameOptions } from '@/shared/types';
import { PresetTransformButtons } from './PresetTransformButtons';
import { TransformModeSelector } from './TransformModeSelector';
import { FrameSelector } from './FrameSelector';

export const SettingsSidebar: React.FC = () => {
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const [frameOptions, setFrameOptions] = useAtom(frameOptionsAtom);
  const [moveAmount, setMoveAmount] = React.useState(10);

  const handleFrameOptionChange = React.useCallback(
    (patch: Partial<FrameOptions>) => {
      setFrameOptions((prev) => ({ ...prev, ...patch }));
    },
    [setFrameOptions]
  );

  const {
    adjustHorizontal,
    adjustVertical,
    resetAllAdjustments,
    applyPresetTransform,
  } = useTransform();

  return (
    <aside
      className={cn(
        'flex h-full w-full flex-col border-l border-slate-200/80 bg-white'
      )}
    >
      <div className={cn('flex-1 space-y-5 overflow-y-auto px-6 py-5')}>
        <section className={cn('space-y-3')}>
          <h4
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
            )}
          >
            Frame
          </h4>
          <div
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-4 space-y-4'
            )}
          >
            <FrameSelector
              selectedShape={frameOptions.shape}
              onShapeChange={(shape) => handleFrameOptionChange({ shape })}
            />

            {frameOptions.shape !== 'none' && (
              <>
                <div className={cn('space-y-2')}>
                  <label className={cn('text-xs font-semibold text-slate-600')}>
                    패딩
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={frameOptions.padding}
                    onChange={(e) =>
                      handleFrameOptionChange({
                        padding: Number(e.target.value),
                      })
                    }
                    className={cn('w-full')}
                  />
                  <span className={cn('text-xs text-slate-400')}>
                    {frameOptions.padding}px
                  </span>
                </div>

                <div className={cn('space-y-2')}>
                  <label className={cn('text-xs font-semibold text-slate-600')}>
                    테두리 두께
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={frameOptions.borderWidth}
                    onChange={(e) =>
                      handleFrameOptionChange({
                        borderWidth: Number(e.target.value),
                      })
                    }
                    className={cn('w-full')}
                  />
                  <span className={cn('text-xs text-slate-400')}>
                    {frameOptions.borderWidth}px
                  </span>
                </div>

                {frameOptions.borderWidth > 0 && (
                  <>
                    <div className={cn('space-y-2')}>
                      <label
                        className={cn('text-xs font-semibold text-slate-600')}
                      >
                        테두리 색상
                      </label>
                      <input
                        type="color"
                        value={frameOptions.borderColor}
                        onChange={(e) =>
                          handleFrameOptionChange({
                            borderColor: e.target.value,
                          })
                        }
                        className={cn(
                          'h-10 w-full rounded-xl border border-slate-200'
                        )}
                      />
                    </div>
                  </>
                )}

                {frameOptions.shape === 'rounded' && (
                  <div className={cn('space-y-2')}>
                    <label
                      className={cn('text-xs font-semibold text-slate-600')}
                    >
                      모서리 반경
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={frameOptions.cornerRadius}
                      onChange={(e) =>
                        handleFrameOptionChange({
                          cornerRadius: Number(e.target.value),
                        })
                      }
                      className={cn('w-full')}
                    />
                    <span className={cn('text-xs text-slate-400')}>
                      {frameOptions.cornerRadius}px
                    </span>
                  </div>
                )}

                <div className={cn('flex items-center gap-2')}>
                  <input
                    type="checkbox"
                    id="shadowEnabled"
                    checked={frameOptions.shadowEnabled}
                    onChange={(e) =>
                      handleFrameOptionChange({
                        shadowEnabled: e.target.checked,
                      })
                    }
                    className={cn('h-4 w-4 rounded border-slate-300')}
                  />
                  <label
                    htmlFor="shadowEnabled"
                    className={cn('text-xs font-semibold text-slate-600')}
                  >
                    그림자 효과
                  </label>
                </div>

                {frameOptions.shadowEnabled && (
                  <>
                    <div className={cn('space-y-2')}>
                      <label
                        className={cn('text-xs font-semibold text-slate-600')}
                      >
                        그림자 색상
                      </label>
                      <input
                        type="color"
                        value={frameOptions.shadowColor}
                        onChange={(e) =>
                          handleFrameOptionChange({
                            shadowColor: e.target.value,
                          })
                        }
                        className={cn(
                          'h-10 w-full rounded-xl border border-slate-200'
                        )}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        <section className={cn('space-y-3')}>
          <h4
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
            )}
          >
            Presets
          </h4>
          <div
            className={cn(
              'rounded-2xl border border-slate-200 bg-slate-50/60 p-4'
            )}
          >
            <PresetTransformButtons onApplyPreset={applyPresetTransform} />
          </div>
        </section>

        <section className={cn('space-y-3')}>
          <h4
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
            )}
          >
            Mode
          </h4>
          <div
            className={cn('rounded-2xl border border-slate-200 bg-white p-4')}
          >
            <TransformModeSelector
              transformMode={transformMode}
              onModeChange={setTransformMode}
            />
          </div>
        </section>

        <section className={cn('space-y-3')}>
          <h4
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
            )}
          >
            Adjust
          </h4>
          <div
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-5 space-y-4'
            )}
          >
            <div className={cn('space-y-3')}>
              <div className={cn('flex items-center gap-2')}>
                <input
                  type="text"
                  value={moveAmount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 1 && val <= 500) {
                      setMoveAmount(val);
                    }
                  }}
                  className={cn(
                    'flex-1 px-3 py-2 rounded-lg border border-slate-200',
                    'text-xs font-medium text-slate-900',
                    'focus:outline-none focus:border-slate-900'
                  )}
                  placeholder="10"
                />
              </div>

              <div
                className={cn(
                  'grid grid-cols-2 gap-3 text-xs font-semibold text-slate-500'
                )}
              >
                <div className={cn('space-y-2 text-center')}>
                  <p>상하 이동</p>
                  <div className={cn('flex items-center justify-center gap-2')}>
                    <button
                      onClick={() => adjustVertical('up', moveAmount)}
                      className={cn(
                        'h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600',
                        'flex items-center justify-center transition-all duration-200',
                        'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
                        'active:scale-90 active:bg-slate-100'
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
                          strokeWidth={1.5}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => adjustVertical('down', moveAmount)}
                      className={cn(
                        'h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600',
                        'flex items-center justify-center transition-all duration-200',
                        'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
                        'active:scale-90 active:bg-slate-100'
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
                          strokeWidth={1.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className={cn('space-y-2 text-center')}>
                  <p>좌우 이동</p>
                  <div className={cn('flex items-center justify-center gap-2')}>
                    <button
                      onClick={() => adjustHorizontal('left', moveAmount)}
                      className={cn(
                        'h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600',
                        'flex items-center justify-center transition-all duration-200',
                        'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
                        'active:scale-90 active:bg-slate-100'
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
                          strokeWidth={1.5}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => adjustHorizontal('right', moveAmount)}
                      className={cn(
                        'h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-600',
                        'flex items-center justify-center transition-all duration-200',
                        'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
                        'active:scale-90 active:bg-slate-100'
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
                          strokeWidth={1.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={resetAllAdjustments}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600',
                'transition-all duration-200',
                'hover:border-slate-900 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
                'active:scale-95 active:bg-slate-100'
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
                  strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              모서리 초기화
            </button>
          </div>
        </section>
      </div>
    </aside>
  );
};
