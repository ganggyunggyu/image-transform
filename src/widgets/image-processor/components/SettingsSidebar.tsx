import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  transformModeAtom,
  frameOptionsAtom,
  cropOptionsAtom,
  selectedImageAtom,
  imageElementAtom,
  isProcessingAtom,
  showAlertMessageAtom,
  croppedImageAtom,
  croppedImageRawAtom,
} from '@/shared/stores/atoms';
import type { FrameOptions } from '@/shared/types';
import { PresetTransformButtons } from './PresetTransformButtons';
import { TransformModeSelector } from './TransformModeSelector';
import { FrameSelector } from './FrameSelector';
import { FrameSelectorModal } from './FrameSelectorModal';
import { cropImage, applyFrameToImage } from '@/shared/utils';

export const SettingsSidebar: React.FC = () => {
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const [frameOptions, setFrameOptions] = useAtom(frameOptionsAtom);
  const [cropOptions, setCropOptions] = useAtom(cropOptionsAtom);
  const [moveAmount, setMoveAmount] = React.useState(10);
  const [isFrameModalOpen, setIsFrameModalOpen] = React.useState(false);
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const isProcessing = useAtomValue(isProcessingAtom);
  const setIsProcessing = useSetAtom(isProcessingAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);
  const setCroppedImage = useSetAtom(croppedImageAtom);
  const [croppedImageRaw, setCroppedImageRaw] = useAtom(croppedImageRawAtom);

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

  React.useEffect(() => {
    if (!croppedImageRaw) return;

    const applyFrame = async () => {
      try {
        let dataUrl = croppedImageRaw;

        if (frameOptions.shape !== 'none') {
          dataUrl = await applyFrameToImage(croppedImageRaw, frameOptions);
        }

        setCroppedImage(dataUrl);
      } catch (error) {
        console.error('프레임 적용 오류:', error);
      }
    };

    applyFrame();
  }, [frameOptions, croppedImageRaw, setCroppedImage]);

  const handleCrop = React.useCallback(async () => {
    if (!selectedImage || !imageElement) {
      showAlertMessage('자를 이미지를 선택하세요.', 'warning');
      return;
    }

    const { top, bottom, left, right } = cropOptions;
    const shouldCrop = top !== 0 || bottom !== 0 || left !== 0 || right !== 0;

    setIsProcessing(true);

    try {
      let dataUrl: string;

      if (shouldCrop) {
        dataUrl = await cropImage(imageElement, cropOptions);
      } else {
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.naturalWidth;
        canvas.height = imageElement.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(imageElement, 0, 0);
        }
        dataUrl = canvas.toDataURL('image/png');
      }

      setCroppedImageRaw(dataUrl);

      if (frameOptions.shape !== 'none') {
        dataUrl = await applyFrameToImage(dataUrl, frameOptions);
      }

      setCroppedImage(dataUrl);
      showAlertMessage(shouldCrop ? '자르기 완료' : '원본 적용 완료', 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('이미지 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    selectedImage,
    imageElement,
    cropOptions,
    frameOptions,
    setCroppedImage,
    setCroppedImageRaw,
    setIsProcessing,
    showAlertMessage,
  ]);

  return (
    <aside
      className={cn(
        'relative flex h-full w-full flex-col border-l border-slate-200/80 bg-white'
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
            <button
              onClick={() => setIsFrameModalOpen(true)}
              className={cn(
                'w-full flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700',
                'transition-all duration-200',
                'hover:border-slate-900 hover:bg-slate-50 hover:shadow-sm',
                'active:scale-95'
              )}
            >
              <span>프레임 선택</span>
              <svg
                className="w-4 h-4 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {false && frameOptions.shape !== 'none' && (
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
            Crop
          </h4>
          <div
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-4 space-y-3'
            )}
          >
            <div className={cn('grid grid-cols-2 gap-2')}>
              <div className={cn('space-y-1')}>
                <label className={cn('text-[10px] font-medium text-slate-500')}>
                  상단
                </label>
                <input
                  type="text"
                  value={cropOptions.top === 0 ? '' : cropOptions.top}
                  onChange={(e) =>
                    setCropOptions({
                      ...cropOptions,
                      top: Number(e.target.value) || 0,
                    })
                  }
                  className={cn(
                    'w-full px-2 py-1.5 rounded-lg border border-slate-200',
                    'text-xs text-slate-900',
                    'focus:outline-none focus:border-slate-900'
                  )}
                  placeholder="0"
                />
              </div>

              <div className={cn('space-y-1')}>
                <label className={cn('text-[10px] font-medium text-slate-500')}>
                  하단
                </label>
                <input
                  type="text"
                  value={cropOptions.bottom === 0 ? '' : cropOptions.bottom}
                  onChange={(e) =>
                    setCropOptions({
                      ...cropOptions,
                      bottom: Number(e.target.value) || 0,
                    })
                  }
                  className={cn(
                    'w-full px-2 py-1.5 rounded-lg border border-slate-200',
                    'text-xs text-slate-900',
                    'focus:outline-none focus:border-slate-900'
                  )}
                  placeholder="0"
                />
              </div>

              <div className={cn('space-y-1')}>
                <label className={cn('text-[10px] font-medium text-slate-500')}>
                  좌측
                </label>
                <input
                  type="text"
                  value={cropOptions.left === 0 ? '' : cropOptions.left}
                  onChange={(e) =>
                    setCropOptions({
                      ...cropOptions,
                      left: Number(e.target.value) || 0,
                    })
                  }
                  className={cn(
                    'w-full px-2 py-1.5 rounded-lg border border-slate-200',
                    'text-xs text-slate-900',
                    'focus:outline-none focus:border-slate-900'
                  )}
                  placeholder="0"
                />
              </div>

              <div className={cn('space-y-1')}>
                <label className={cn('text-[10px] font-medium text-slate-500')}>
                  우측
                </label>
                <input
                  type="text"
                  value={cropOptions.right === 0 ? '' : cropOptions.right}
                  onChange={(e) =>
                    setCropOptions({
                      ...cropOptions,
                      right: Number(e.target.value) || 0,
                    })
                  }
                  className={cn(
                    'w-full px-2 py-1.5 rounded-lg border border-slate-200',
                    'text-xs text-slate-900',
                    'focus:outline-none focus:border-slate-900'
                  )}
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={handleCrop}
              disabled={!selectedImage || isProcessing}
              className={cn(
                'inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200',
                !selectedImage || isProcessing
                  ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                  : 'bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0 active:scale-95'
              )}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              자르기
            </button>
          </div>
        </section>

        <section className={cn('space-y-3')}>
          <h4
            className={cn(
              'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
            )}
          >
            Transform
          </h4>
          <div
            className={cn(
              'rounded-2xl border border-slate-200 bg-white p-4'
            )}
          >
            <PresetTransformButtons onApplyPreset={applyPresetTransform} />
          </div>
        </section>

        {/* <section className={cn('space-y-3')}>
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
        </section> */}

        {/* <section className={cn('space-y-3')}>
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
        </section> */}
      </div>

      <FrameSelectorModal
        isOpen={isFrameModalOpen}
        onClose={() => setIsFrameModalOpen(false)}
        selectedShape={frameOptions.shape}
        onShapeChange={(shape) => handleFrameOptionChange({ shape })}
      />
    </aside>
  );
};
