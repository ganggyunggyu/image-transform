import React, { useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cn } from '@/shared/lib';
import {
  hasImagesAtom,
  isProcessingAtom,
  showAlertMessageAtom,
  imageFilesAtom,
  frameOptionsAtom,
  cropOptionsAtom,
} from '@/shared/stores/atoms';
import { downloadMultipleWithFolder } from '@/shared/utils/download';
import { applyFrameToImage, cropImage } from '@/shared/utils';
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

    setIsProcessing(true);

    try {
      const results: { dataURL: string; originalFileName: string }[] = [];
      const { top, bottom, left, right } = cropOptions;
      const shouldCrop = top !== 0 || bottom !== 0 || left !== 0 || right !== 0;

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

        let dataUrl: string;

        if (shouldCrop) {
          dataUrl = await cropImage(img, cropOptions);
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            dataUrl = canvas.toDataURL('image/webp', 0.95);
          } else {
            throw new Error('Canvas context를 생성할 수 없습니다.');
          }
        }

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

      await downloadMultipleWithFolder(results, shouldCrop ? 'batch_crop' : 'batch_transform');
      showAlertMessage(
        `${imageFiles.length}개의 이미지를 일괄 다운로드했습니다.`,
        'success'
      );
    } catch (error) {
      console.error(error);
      showAlertMessage('일괄 처리 중 오류가 발생했습니다.', 'error');
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
  const isProcessing = useAtomValue(isProcessingAtom);
  const hasImages = useAtomValue(hasImagesAtom);
  const { processBatch } = useImageProcessorActions();

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
      </header>

      <div className={cn('flex flex-1 flex-col gap-4')}>
        <div
          className={cn(
            'relative min-h-[480px] flex-1 rounded-3xl border border-slate-200 bg-slate-100 p-2 sm:p-4 lg:p-6'
          )}
        >
          <div
            className={cn(
              'h-full rounded-2xl border border-slate-300 bg-slate-800 shadow-inner relative z-0'
            )}
          >
            <TransformWorkspace />
          </div>

          {isProcessing && (
            <div
              className={cn(
                'absolute inset-0 z-50 flex items-center justify-center rounded-3xl bg-white/80 backdrop-blur-sm'
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
