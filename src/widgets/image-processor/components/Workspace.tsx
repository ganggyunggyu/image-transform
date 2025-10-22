import React, { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cn } from '@/shared/lib';
import {
  canvasScaleAtom,
  hasImagesAtom,
  isProcessingAtom,
  showAlertMessageAtom,
  imageFilesAtom,
  imageElementAtom,
  frameOptionsAtom,
  cropOptionsAtom,
} from '@/shared/stores/atoms';
import { downloadMultipleWithFolder } from '@/shared/utils/download';
import { applyFrameToImage, cropImage } from '@/shared/utils';
import { useTransform } from '@/features/free-transform';
import { TransformWorkspace } from './TransformWorkspace';

const useImageProcessorActions = () => {
  const imageFiles = useAtomValue(imageFilesAtom);
  const cropOptions = useAtomValue(cropOptionsAtom);
  const frameOptions = useAtomValue(frameOptionsAtom);
  const setIsProcessing = useSetAtom(isProcessingAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);

  const processBatch = useCallback(async () => {
    if (imageFiles.length === 0) {
      showAlertMessage('처리할 이미지가 없습니다.', 'warning');
      return;
    }

    const { top, bottom, left, right } = cropOptions;
    if (top === 0 && bottom === 0 && left === 0 && right === 0) {
      showAlertMessage('자를 영역을 입력하세요.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const results: { dataURL: string; originalFileName: string }[] = [];

      for (const imageFile of imageFiles) {
        const img = new Image();
        if (imageFile.file instanceof File) {
          img.src = URL.createObjectURL(imageFile.file);
        } else {
          img.src = imageFile.preview;
        }

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error('이미지를 불러오지 못했습니다.'));
        });

        let dataUrl = await cropImage(img, cropOptions);

        if (frameOptions.shape !== 'none') {
          dataUrl = await applyFrameToImage(dataUrl, frameOptions);
        }

        results.push({
          dataURL: dataUrl,
          originalFileName: imageFile.name,
        });

        if (imageFile.file instanceof File) {
          URL.revokeObjectURL(img.src);
        }
      }

      await downloadMultipleWithFolder(results, 'batch_crop');
      showAlertMessage(
        `${imageFiles.length}개의 이미지를 일괄 다운로드했습니다.`,
        'success'
      );
    } catch (error) {
      console.error(error);
      showAlertMessage('일괄 자르기 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    imageFiles,
    cropOptions,
    frameOptions,
    setIsProcessing,
    showAlertMessage,
  ]);

  return {
    processBatch,
  };
};

export const DesktopWorkspace: React.FC = () => {
  const [canvasScale, setCanvasScale] = useAtom(canvasScaleAtom);
  const isProcessing = useAtomValue(isProcessingAtom);
  const hasImages = useAtomValue(hasImagesAtom);
  const { resetTransform } = useTransform();
  const imageElement = useAtomValue(imageElementAtom);
  const { processBatch } = useImageProcessorActions();
  const handleZoomIn = () =>
    setCanvasScale((scale) => Math.min(scale * 1.2, 3));
  const handleZoomOut = () =>
    setCanvasScale((scale) => Math.max(scale / 1.2, 0.2));
  const handleResetTransform = () => {
    if (imageElement) {
      resetTransform(imageElement);
    }
  };

  return (
    <section className={cn('flex h-full flex-col gap-6 bg-white p-6')}>
      <header
        className={cn(
          'flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'
        )}
      >
        <div className={cn('space-y-3')}>
          <div
            className={cn(
              'inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500'
            )}
          >
            Studio Mode
          </div>
        </div>

        <div
          className={cn(
            'flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 shadow-sm'
          )}
        >
          <span className={cn('hidden sm:block')}>배율</span>
          <span
            className={cn(
              'rounded-full border border-slate-200 px-3 py-0.5 text-xs font-semibold text-slate-700'
            )}
          >
            {Math.round(canvasScale * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500',
              'transition-all duration-200',
              'hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
              'active:scale-90 active:translate-y-0'
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
                d="M20 12H4"
              />
            </svg>
          </button>
          <button
            onClick={handleResetTransform}
            className={cn(
              'hidden sm:inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600',
              'transition-all duration-200',
              'hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
              'active:scale-95 active:translate-y-0'
            )}
          >
            초기화
          </button>
          <button
            onClick={handleZoomIn}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500',
              'transition-all duration-200',
              'hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm',
              'active:scale-90 active:translate-y-0'
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className={cn('flex flex-1 flex-col gap-4')}>
        <div
          className={cn(
            'relative min-h-[480px] flex-1 rounded-3xl border border-slate-200 bg-slate-100 p-2 sm:p-4 lg:p-6'
          )}
        >
          <div
            className={cn(
              'h-full rounded-2xl border border-slate-300 bg-slate-800 shadow-inner'
            )}
          >
            <TransformWorkspace />
          </div>

          {isProcessing && (
            <div
              className={cn(
                'absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/70 backdrop-blur-sm'
              )}
            >
              <div className={cn('flex flex-col items-center gap-4')}>
                <div
                  className={cn(
                    'h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900'
                  )}
                />
                <p className={cn('text-sm font-semibold text-slate-600')}>
                  처리 중...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={cn('flex flex-wrap gap-3')}>
          <button
            onClick={processBatch}
            disabled={!hasImages || isProcessing}
            className={cn(
              'inline-flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all duration-200',
              !hasImages || isProcessing
                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                : 'bg-slate-900 text-white shadow-sm hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-md active:translate-y-0 active:scale-95'
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            일괄 다운로드
          </button>
        </div>
      </div>
    </section>
  );
};

export const Workspace: React.FC = () => {
  return <DesktopWorkspace />;
};
