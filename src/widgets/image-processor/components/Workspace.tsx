import React, { useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  Tabs,
  Tab,
  Button,
  Chip,
  LinearProgress,
  Typography,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Settings as SettingsIcon,
  AllInclusive as AllInclusiveIcon,
} from '@mui/icons-material';
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
import { warpImagePerspective } from '@/shared/utils';
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

  return <div className={cn('pt-4 h-full flex flex-col gap-4')}>{children}</div>;
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
    (source: HTMLImageElement): string => {
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

      return canvas.toDataURL('image/png', 0.9);
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
      const dataUrl = createRotatedDataUrl(imageElement);

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

        const dataUrl = createRotatedDataUrl(img);

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

export const Workspace: React.FC = () => {
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

  const handleZoomIn = () => {
    setCanvasScale((scale) => Math.min(scale * 1.2, 3));
  };

  const handleZoomOut = () => {
    setCanvasScale((scale) => Math.max(scale / 1.2, 0.2));
  };

  const handleResetTransform = () => {
    if (imageElement) {
      resetTransform(imageElement);
    }
  };

  return (
    <section className={cn('flex-1 min-w-0 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 shadow-sm overflow-hidden')}>
      <div className={cn('bg-white border-b border-slate-200')}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              minHeight: 52,
              color: '#64748b',
              '&.Mui-selected': { color: '#3b82f6', fontWeight: 700 },
            },
            '& .MuiTabs-indicator': {
              height: 3,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            },
          }}
        >
          <Tab label="자유 변형" />
          <Tab label="회전 변형" />
        </Tabs>
      </div>

      <div className={cn('flex-1 flex flex-col p-4 gap-4 overflow-hidden')}>
        <TabPanel value={activeTab} index={0}>
          <div className={cn('flex flex-wrap items-center gap-2')}>
            <Button
              onClick={handleResetTransform}
              variant="outlined"
              size="small"
              startIcon={<RefreshIcon />}
              className={cn('rounded-xl')}
            >
              초기화
            </Button>
            <Button
              onClick={handleZoomIn}
              variant="outlined"
              size="small"
              startIcon={<ZoomInIcon />}
              className={cn('rounded-xl')}
            >
              확대
            </Button>
              <Button
              onClick={handleZoomOut}
              variant="outlined"
              size="small"
              startIcon={<ZoomOutIcon />}
              className={cn('rounded-xl')}
            >
              축소
            </Button>
            <Chip
              label={`${Math.round(canvasScale * 100)}%`}
              size="small"
              className={cn('bg-blue-50 text-blue-700 font-semibold')}
            />
          </div>

          <TransformWorkspace />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div className={cn('flex-1 min-h-[320px] flex items-center justify-center bg-gradient-to-br from-white to-slate-50 border border-dashed border-slate-200 rounded-2xl')}>
            <Typography variant="body1" className={cn('text-slate-600 font-medium text-center max-w-md')}>
              오른쪽 설정 패널에서 회전 각도와 반전 옵션을 조정하고 아래 버튼으로 결과를 다운로드하세요.
            </Typography>
          </div>
        </TabPanel>

        <div className={cn('flex flex-col gap-3 mt-auto')}>
          <div className={cn('flex flex-wrap gap-3')}>
            <Button
              onClick={handleApply}
              disabled={!selectedImage || isProcessing}
              variant="contained"
              size="large"
              startIcon={<SettingsIcon />}
              className={cn('rounded-xl min-w-[160px]')}
              sx={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}
            >
              {activeTab === 0 ? '변형 적용' : '회전 적용'}
            </Button>
            <Button
              onClick={handleBatch}
              disabled={!hasImages || isProcessing}
              variant="outlined"
              size="large"
              startIcon={<AllInclusiveIcon />}
              className={cn('rounded-xl min-w-[160px]')}
            >
              일괄 처리
            </Button>
          </div>

          {isProcessing && (
            <div className={cn('space-y-2')}>
              <LinearProgress
                sx={{
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  },
                }}
              />
              <Typography variant="body2" className={cn('text-center text-slate-600')}>
                처리 중...
              </Typography>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
