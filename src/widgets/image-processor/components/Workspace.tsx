import React, { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cn } from '@/shared/lib';
import {
  activeTabAtom,
  canvasScaleAtom,
  selectedImageAtom,
  hasImagesAtom,
  isProcessingAtom,
  showAlertMessageAtom,
  rotationAtom,
  flipHorizontalAtom,
  flipVerticalAtom,
  imageFilesAtom,
  imageElementAtom,
  transformBoundsAtom,
} from '@/shared/stores/atoms';
import { downloadMultipleWithFolder, downloadWithFolder } from '@/shared/utils/download';
import { warpImagePerspective, getImageMimeType, getImageQuality } from '@/shared/utils';
import { useTransform } from '@/features/free-transform';
import { TransformWorkspace } from './TransformWorkspace';

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  if (value !== index) {
    return null;
  }

  return <div className={cn('h-full flex flex-col')}>{children}</div>;
};

const useImageProcessorActions = () => {
  const { getTransformedPoints } = useTransform();
  const imageFiles = useAtomValue(imageFilesAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const transformBounds = useAtomValue(transformBoundsAtom);
  const rotation = useAtomValue(rotationAtom);
  const flipHorizontal = useAtomValue(flipHorizontalAtom);
  const flipVertical = useAtomValue(flipVerticalAtom);
  const setIsProcessing = useSetAtom(isProcessingAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);

  const getStagePoints = useCallback(() => {
    return getTransformedPoints().map(({ x, y }) => [x, y] as [number, number]);
  }, [getTransformedPoints]);

  const createRotatedDataUrl = useCallback(
    (source: HTMLImageElement, originalFile?: File): string => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('2D 컨텍스트를 사용할 수 없습니다.');
      }

      const width = source.naturalWidth || source.width;
      const height = source.naturalHeight || source.height;
      const radian = (rotation * Math.PI) / 180;

      const rotatedWidth = Math.abs(width * Math.cos(radian)) + Math.abs(height * Math.sin(radian));
      const rotatedHeight = Math.abs(width * Math.sin(radian)) + Math.abs(height * Math.cos(radian));

      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;

      context.translate(rotatedWidth / 2, rotatedHeight / 2);
      context.rotate(radian);
      context.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);
      context.drawImage(source, -width / 2, -height / 2, width, height);

      const mimeType = originalFile ? getImageMimeType(originalFile) : 'image/png';
      const quality = getImageQuality(mimeType);

      return canvas.toDataURL(mimeType, quality);
    },
    [flipHorizontal, flipVertical, rotation],
  );

  const processTransform = useCallback(async () => {
    if (!selectedImage || !imageElement) {
      showAlertMessage('변형할 이미지를 선택하세요.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const stagePoints = getStagePoints();
      const width = imageElement.naturalWidth || imageElement.width;
      const height = imageElement.naturalHeight || imageElement.height;

      const dataUrl = await warpImagePerspective({
        imgEl: imageElement,
        srcSize: { w: width, h: height },
        dstStagePoints: stagePoints,
        stageTL: [transformBounds.x, transformBounds.y],
        stageSize: transformBounds,
        originalFile: selectedImage.file,
      });

      await downloadWithFolder({
        dataURL: dataUrl,
        originalFileName: selectedImage.name,
        transformType: 'transform',
        timestamp: true,
      });

      showAlertMessage('이미지를 폴더로 다운로드했습니다.', 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('이미지 변형 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    getStagePoints,
    imageElement,
    selectedImage,
    setIsProcessing,
    showAlertMessage,
    transformBounds,
  ]);

  const processBatch = useCallback(async () => {
    if (imageFiles.length === 0) {
      showAlertMessage('처리할 이미지가 없습니다.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const stagePoints = getStagePoints();
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
          img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
        });

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const dataUrl = await warpImagePerspective({
          imgEl: img,
          srcSize: { w: width, h: height },
          dstStagePoints: stagePoints,
          stageTL: [transformBounds.x, transformBounds.y],
          stageSize: transformBounds,
          originalFile: imageFile.file,
        });

        results.push({
          dataURL: dataUrl,
          originalFileName: imageFile.name,
        });

        if (imageFile.file instanceof File) {
          URL.revokeObjectURL(img.src);
        }
      }

      await downloadMultipleWithFolder(results, 'batch_transform');
      showAlertMessage(`${imageFiles.length}개의 이미지를 일괄 다운로드했습니다.`, 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('일괄 변형 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    getStagePoints,
    imageFiles,
    setIsProcessing,
    showAlertMessage,
    transformBounds,
  ]);

  const processRotation = useCallback(async () => {
    if (!selectedImage || !imageElement) {
      showAlertMessage('회전할 이미지를 선택하세요.', 'warning');
      return;
    }

    setIsProcessing(true);

    try {
      const dataUrl = createRotatedDataUrl(imageElement, selectedImage.file);

      await downloadWithFolder({
        dataURL: dataUrl,
        originalFileName: selectedImage.name,
        transformType: 'rotation',
        timestamp: true,
      });

      showAlertMessage('회전된 이미지를 다운로드했습니다.', 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('회전 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    createRotatedDataUrl,
    imageElement,
    selectedImage,
    setIsProcessing,
    showAlertMessage,
  ]);

  const processBatchRotation = useCallback(async () => {
    if (imageFiles.length === 0) {
      showAlertMessage('처리할 이미지가 없습니다.', 'warning');
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
          img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
        });

        const dataUrl = createRotatedDataUrl(img, imageFile.file);

        results.push({
          dataURL: dataUrl,
          originalFileName: imageFile.name,
        });

        if (imageFile.file instanceof File) {
          URL.revokeObjectURL(img.src);
        }
      }

      await downloadMultipleWithFolder(results, 'batch_rotation');
      showAlertMessage(`${imageFiles.length}개의 이미지를 일괄 회전 처리했습니다.`, 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('일괄 회전 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, [
    createRotatedDataUrl,
    imageFiles,
    setIsProcessing,
    showAlertMessage,
  ]);

  return {
    processTransform,
    processBatch,
    processRotation,
    processBatchRotation,
  };
};

export const DesktopWorkspace: React.FC = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [canvasScale, setCanvasScale] = useAtom(canvasScaleAtom);
  const isProcessing = useAtomValue(isProcessingAtom);
  const hasImages = useAtomValue(hasImagesAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const { resetTransform } = useTransform();
  const imageElement = useAtomValue(imageElementAtom);
  const { processTransform, processBatch, processRotation, processBatchRotation } =
    useImageProcessorActions();

  const handleApply = activeTab === 0 ? processTransform : processRotation;
  const handleBatch = activeTab === 0 ? processBatch : processBatchRotation;
  const handleZoomIn = () => setCanvasScale((scale) => Math.min(scale * 1.2, 3));
  const handleZoomOut = () => setCanvasScale((scale) => Math.max(scale / 1.2, 0.2));
  const handleResetTransform = () => {
    if (imageElement) {
      resetTransform(imageElement);
    }
  };

  const activeMode = activeTab === 0 ? '자유 변형' : '회전 변형';
  const modeDescription =
    activeTab === 0
      ? '모서리와 변을 정밀하게 조정해 원근을 맞춰보세요.'
      : '각도와 반전 설정을 조절한 뒤 결과를 곧바로 확인하고 저장하세요.';
  const selectedLabel = selectedImage ? `현재 파일 • ${selectedImage.name}` : '왼쪽 파일 패널에서 이미지를 선택하세요.';

  const tabs = [
    { label: '자유 변형', value: 0 },
    { label: '회전 변형', value: 1 },
  ];

  return (
    <section className={cn('flex h-full flex-col gap-6 bg-white p-6')}> 
      <header className={cn('flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between')}>
        <div className={cn('space-y-3')}>
          <div className={cn('inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-500')}>
            Studio Mode
          </div>
          <div className={cn('space-y-2')}>
            <h2 className={cn('text-2xl font-semibold text-slate-900 sm:text-3xl')}>{activeMode}</h2>
            <p className={cn('text-sm text-slate-500')}>{modeDescription}</p>
            <p className={cn('text-xs font-medium uppercase tracking-[0.25em] text-slate-400')}>{selectedLabel}</p>
          </div>
        </div>

        <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end')}> 
          <div className={cn('inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1')}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.value)}
                  className={cn(
                    'rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200',
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:-translate-y-0.5 hover:text-slate-700'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className={cn('flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 shadow-sm')}> 
            <span className={cn('hidden sm:block')}>배율</span>
            <span className={cn('rounded-full border border-slate-200 px-3 py-0.5 text-xs font-semibold text-slate-700')}>
              {Math.round(canvasScale * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className={cn('flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleResetTransform}
              className={cn('hidden sm:inline-flex h-8 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900')}
            >
              초기화
            </button>
            <button
              onClick={handleZoomIn}
              className={cn('flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900')}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={cn('flex flex-1 flex-col gap-4')}> 
        <div className={cn('relative min-h-[480px] flex-1 rounded-3xl border border-slate-200 bg-slate-50/70 p-2 sm:p-4 lg:p-6')}> 
          <TabPanel value={activeTab} index={0}>
            <div className={cn('h-full rounded-2xl border border-slate-200 bg-white shadow-inner')}>
              <TransformWorkspace />
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div className={cn(
              'flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-white text-center px-6'
            )}>
              <div className={cn('flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-600')}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className={cn('space-y-1')}>
                <h3 className={cn('text-base font-semibold text-slate-900')}>회전 변형 모드</h3>
                <p className={cn('text-sm text-slate-500 leading-relaxed')}>
                  오른쪽 패널에서 회전 각도와 반전 옵션을 조정한 뒤 결과를 다운로드하세요.
                </p>
              </div>
            </div>
          </TabPanel>

          {isProcessing && (
            <div className={cn(
              'absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/70 backdrop-blur-sm'
            )}>
              <div className={cn('flex flex-col items-center gap-4')}> 
                <div className={cn('h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900')} />
                <p className={cn('text-sm font-semibold text-slate-600')}>처리 중...</p>
              </div>
            </div>
          )}
        </div>

        <div className={cn('flex flex-wrap gap-3')}> 
          <button
            onClick={handleApply}
            disabled={!selectedImage || isProcessing}
            className={cn(
              'inline-flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-2xl px-8 py-3.5 text-sm font-semibold transition-all duration-200',
              !selectedImage || isProcessing
                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                : 'bg-slate-900 text-white hover:-translate-y-0.5 hover:bg-slate-800'
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {activeTab === 0 ? '변형 적용' : '회전 적용'}
          </button>

          <button
            onClick={handleBatch}
            disabled={!hasImages || isProcessing}
            className={cn(
              'inline-flex flex-1 min-w-[200px] items-center justify-center gap-2 rounded-2xl border px-8 py-3.5 text-sm font-semibold transition-all duration-200',
              !hasImages || isProcessing
                ? 'cursor-not-allowed border-slate-200 text-slate-400'
                : 'border-slate-300 text-slate-600 hover:-translate-y-0.5 hover:border-slate-900 hover:text-slate-900'
            )}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            일괄 처리
          </button>
        </div>
      </div>
    </section>
  );
};

export const MobileWorkspace: React.FC = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const [canvasScale, setCanvasScale] = useAtom(canvasScaleAtom);
  const isProcessing = useAtomValue(isProcessingAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const { resetTransform } = useTransform();
  const imageElement = useAtomValue(imageElementAtom);
  const [touchStartDistance, setTouchStartDistance] = React.useState<number | null>(null);
  const [initialScale, setInitialScale] = React.useState<number>(1);

  const handleTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setTouchStartDistance(distance);
      setInitialScale(canvasScale);
    }
  }, [canvasScale]);

  const handleTouchMove = React.useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDistance !== null) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const scale = (distance / touchStartDistance) * initialScale;
      setCanvasScale(Math.min(Math.max(scale, 0.2), 3));
    }
  }, [touchStartDistance, initialScale, setCanvasScale]);

  const handleTouchEnd = React.useCallback(() => {
    setTouchStartDistance(null);
  }, []);

  const handleZoomIn = () => setCanvasScale((scale) => Math.min(scale * 1.2, 3));
  const handleZoomOut = () => setCanvasScale((scale) => Math.max(scale / 1.2, 0.2));
  const handleResetTransform = () => {
    if (imageElement) {
      resetTransform(imageElement);
      setCanvasScale(1);
    }
  };

  return (
    <section
      className={cn('flex-1 flex flex-col bg-white')}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={cn('relative flex-1 p-3')}> 
        {!selectedImage ? (
          <div className={cn(
            'flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white'
          )}>
            <div className={cn('text-center space-y-3 px-6 text-slate-500')}>
              <div className={cn('mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 text-slate-600')}> 
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className={cn('text-sm font-semibold text-slate-700')}>이미지를 선택하세요</p>
              <p className={cn('text-xs leading-relaxed text-slate-500')}>하단 파일 버튼에서 이미지를 불러온 뒤 변형을 시작할 수 있어요.</p>
            </div>
          </div>
        ) : activeTab === 0 ? (
          <div className={cn('h-full rounded-3xl border border-slate-200 bg-white shadow-sm')}>
            <TransformWorkspace />
          </div>
        ) : (
          <div className={cn(
            'flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white text-center px-6 text-slate-500'
          )}>
            <div className={cn('space-y-3')}> 
              <div className={cn('mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 text-slate-600')}> 
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <p className={cn('text-sm font-semibold text-slate-700')}>회전 변형 모드</p>
              <p className={cn('text-xs leading-relaxed text-slate-500')}>설정 패널에서 회전 각도를 조정한 뒤 다운로드 버튼을 눌러주세요.</p>
              {selectedImage && (
                <p className={cn('rounded-full border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600')}>
                  현재 이미지 · {selectedImage.name}
                </p>
              )}
            </div>
          </div>
        )}

        {selectedImage && activeTab === 0 && (
          <div className={cn('absolute bottom-4 right-4 flex flex-col gap-2')}> 
            <button
              onClick={handleZoomIn}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:text-slate-900'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleResetTransform}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-800'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        )}

        {selectedImage && (
          <div className={cn(
            'absolute top-4 left-4 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600'
          )}>
            {Math.round(canvasScale * 100)}%
          </div>
        )}
      </div>

      {isProcessing && (
        <div className={cn(
          'absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm'
        )}>
          <div className={cn('flex flex-col items-center gap-3 text-slate-600')}>
            <div className={cn('h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900')} />
            <p className={cn('text-sm font-semibold')}>처리 중...</p>
          </div>
        </div>
      )}
    </section>
  );
};

export const Workspace: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileWorkspace /> : <DesktopWorkspace />;
};
