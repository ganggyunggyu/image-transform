import React, { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva';
import useImage from 'use-image';
import {
  Box,
  Typography,
  Button,
  Alert,
  IconButton,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Settings as SettingsIcon,
  AllInclusive as AllInclusiveIcon,
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from '@mui/icons-material';

import type {
  ImageFile,
  AlertSeverity,
  StageSize,
  Point,
} from '../../shared/types';
import { warpImagePerspective } from '../../shared/utils';
import {
  downloadWithFolder,
  downloadMultipleWithFolder,
} from '../../shared/utils/download';
import { ImageUploader, ImageList } from '../../features/image-upload';
import { useTransform } from '../../features/free-transform';
import { PerspectiveTransformImage } from './components/PerspectiveTransformImage';
import { PresetTransformButtons } from './components/PresetTransformButtons';
import { TransformModeSelector } from './components/TransformModeSelector';
import { CornerAdjustmentControls } from './components/CornerAdjustmentControls';
import { TransformControlPoints } from './components/TransformControlPoints';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={value === index ? 'pt-4' : ''}
      {...other}
    >
      {value === index && (
        <Box className="animate-in fade-in duration-300">{children}</Box>
      )}
    </div>
  );
}

const ImageProcessor: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState<string>('');
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>('info');
  const [activeTab, setActiveTab] = useState(0);
  const [canvasScale, setCanvasScale] = useState(1.0);

  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [image] = useImage(selectedImage?.preview || '');
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [stageSize, setStageSize] = useState<StageSize>({
    width: 800,
    height: 600,
  });

  const {
    transformMode,
    transformBounds,
    cornerPoints,
    setTransformMode,
    resetTransform,
    getTransformedPoints,
    getEdgePoints,
    adjustHorizontal,
    adjustVertical,
    adjustCornerPrecise,
    handleEdgeDrag,
    resetAllAdjustments,
    setCornerPoint,
    applyPresetTransform,
  } = useTransform(stageSize);

  const { isDragActive } = useDropzone({
    onDrop: useCallback(
      (acceptedFiles: File[]) => {
        const newFiles: ImageFile[] = acceptedFiles
          .filter((file) => file.type.startsWith('image/'))
          .map((file) => ({
            file,
            id: Math.random().toString(36).substring(7),
            name: file.name,
            preview: URL.createObjectURL(file),
            size: file.size,
          }));

        setImageFiles((prev) => [...prev, ...newFiles]);
        if (newFiles.length > 0 && !selectedImage) {
          setSelectedImage(newFiles[0]);
          setIsImageLoaded(false);
        }
        showAlertMessage(
          `${newFiles.length}개의 이미지가 추가되었습니다.`,
          'success'
        );
      },
      [selectedImage]
    ),
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.gif', '.tiff'] },
  });

  const showAlertMessage = useCallback(
    (message: string, severity: AlertSeverity) => {
      setShowAlert(message);
      setAlertSeverity(severity);
      setTimeout(() => setShowAlert(''), 5000);
    },
    []
  );

  const clearFiles = useCallback(() => {
    imageFiles.forEach((img) => URL.revokeObjectURL(img.preview));
    setImageFiles([]);
    setSelectedImage(null);
    showAlertMessage('모든 파일이 제거되었습니다.', 'info');
  }, [imageFiles, showAlertMessage]);

  const handleImageSelect = useCallback((img: ImageFile) => {
    setSelectedImage(img);
    setIsImageLoaded(false);
  }, []);

  const updateStageSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStageSize({
        width: rect.width - 4,
        height: rect.height - 4,
      });
    }
  }, []);

  React.useEffect(() => {
    if (image && image.width && image.height) {
      setIsImageLoaded(true);
      resetTransform(image);
    }
  }, [image, resetTransform]);

  React.useEffect(() => {
    updateStageSize();
    const handleResize = () => updateStageSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateStageSize]);

  React.useEffect(() => {
    const timer = setTimeout(() => updateStageSize(), 100);
    return () => clearTimeout(timer);
  }, [updateStageSize]);

  React.useEffect(() => {
    if (image && isImageLoaded && stageSize.width > 0) {
      resetTransform(image);
    }
  }, [stageSize, image, isImageLoaded, resetTransform]);

  const processTransform = async () => {
    if (!selectedImage || !image) {
      showAlertMessage('변형할 이미지를 선택하세요', 'warning');
      return;
    }
    setIsProcessing(true);

    try {
      const pts = getTransformedPoints();
      const TL: Point = [pts[0].x, pts[0].y];
      const TR: Point = [pts[1].x, pts[1].y];
      const BR: Point = [pts[2].x, pts[2].y];
      const BL: Point = [pts[3].x, pts[3].y];

      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;

      const dataURL = await warpImagePerspective({
        imgEl: image,
        srcSize: { w: iw, h: ih },
        dstStagePoints: [TL, TR, BR, BL],
        stageTL: [transformBounds.x, transformBounds.y],
        stageScale: canvasScale,
        stageSize: transformBounds,
      });

      await downloadWithFolder({
        dataURL,
        originalFileName: selectedImage.name,
        transformType: 'transform',
        timestamp: true,
      });

      showAlertMessage('이미지를 폴더로 다운로드했습니다.', 'success');
    } catch (e) {
      console.error(e);
      showAlertMessage('오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const processBatch = async () => {
    if (imageFiles.length === 0) {
      showAlertMessage('처리할 이미지가 없습니다', 'warning');
      return;
    }
    setIsProcessing(true);

    try {
      const batchResults = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const img = new Image();
        img.src =
          imageFile.file instanceof File
            ? URL.createObjectURL(imageFile.file)
            : imageFile.preview;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const pts = getTransformedPoints();
        const TL: Point = [pts[0].x, pts[0].y];
        const TR: Point = [pts[1].x, pts[1].y];
        const BR: Point = [pts[2].x, pts[2].y];
        const BL: Point = [pts[3].x, pts[3].y];

        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;

        const dataURL = await warpImagePerspective({
          imgEl: img,
          srcSize: { w: iw, h: ih },
          dstStagePoints: [TL, TR, BR, BL],
          stageTL: [transformBounds.x, transformBounds.y],
          stageScale: canvasScale,
          stageSize: transformBounds,
        });

        batchResults.push({
          dataURL,
          originalFileName: imageFile.name,
        });

        if (imageFile.file instanceof File) {
          URL.revokeObjectURL(img.src);
        }
      }

      await downloadMultipleWithFolder(batchResults, 'batch_transform');

      showAlertMessage(
        `${imageFiles.length}개의 이미지를 폴더로 일괄 다운로드했습니다.`,
        'success'
      );
    } catch (e) {
      console.error(e);
      showAlertMessage('일괄 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCornerDrag = (idx: number, newX: number, newY: number) => {
    setCornerPoint(idx, newX, newY);
  };

  const processRotation = async () => {
    if (!selectedImage || !image) {
      showAlertMessage('변형할 이미지를 선택하세요', 'warning');
      return;
    }
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;

      const rad = (rotation * Math.PI) / 180;
      const rotatedWidth =
        Math.abs(iw * Math.cos(rad)) + Math.abs(ih * Math.sin(rad));
      const rotatedHeight =
        Math.abs(iw * Math.sin(rad)) + Math.abs(ih * Math.cos(rad));

      canvas.width = rotatedWidth;
      canvas.height = rotatedHeight;

      ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
      ctx.rotate(rad);
      ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

      ctx.drawImage(image, -iw / 2, -ih / 2, iw, ih);

      const dataURL = canvas.toDataURL('image/png', 0.6);

      await downloadWithFolder({
        dataURL,
        originalFileName: selectedImage.name,
        transformType: 'rotation',
        timestamp: true,
      });

      showAlertMessage('회전된 이미지를 폴더로 다운로드했습니다.', 'success');
    } catch (e) {
      console.error(e);
      showAlertMessage('회전 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const processBatchRotation = async () => {
    if (imageFiles.length === 0) {
      showAlertMessage('처리할 이미지가 없습니다', 'warning');
      return;
    }
    setIsProcessing(true);

    try {
      const batchResults = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        const img = new Image();
        img.src =
          imageFile.file instanceof File
            ? URL.createObjectURL(imageFile.file)
            : imageFile.preview;

        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const iw = img.naturalWidth || img.width;
        const ih = img.naturalHeight || img.height;

        const rad = (rotation * Math.PI) / 180;
        const rotatedWidth =
          Math.abs(iw * Math.cos(rad)) + Math.abs(ih * Math.sin(rad));
        const rotatedHeight =
          Math.abs(iw * Math.sin(rad)) + Math.abs(ih * Math.cos(rad));

        canvas.width = rotatedWidth;
        canvas.height = rotatedHeight;

        ctx.translate(rotatedWidth / 2, rotatedHeight / 2);
        ctx.rotate(rad);
        ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

        ctx.drawImage(img, -iw / 2, -ih / 2, iw, ih);

        const dataURL = canvas.toDataURL('image/png', 0.6);

        batchResults.push({
          dataURL,
          originalFileName: imageFile.name,
        });

        if (imageFile.file instanceof File) {
          URL.revokeObjectURL(img.src);
        }
      }

      await downloadMultipleWithFolder(batchResults, 'batch_rotation');

      showAlertMessage(
        `${imageFiles.length}개의 이미지를 폴더로 일괄 회전 다운로드했습니다.`,
        'success'
      );
    } catch (e) {
      console.error(e);
      showAlertMessage('일괄 회전 처리 중 오류가 발생했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Alert */}
      {showAlert && (
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert('')}
          className="fixed top-4 left-4 right-4 z-50"
        >
          {showAlert}
        </Alert>
      )}

      {/* 왼쪽 사이드바 - 파일 관리 */}
      <div className="w-80 min-w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 bg-blue-50 border-b">
          <Typography variant="h6" className="font-bold text-gray-800">
            파일 관리
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            이미지를 업로드하고 관리하세요
          </Typography>
        </div>
        <div className="flex-1 p-6">
          <ImageUploader
            imageFiles={imageFiles}
            onFilesAdd={(newFiles) => {
              setImageFiles((prev) => [...prev, ...newFiles]);
              if (newFiles.length > 0 && !selectedImage) {
                setSelectedImage(newFiles[0]);
                setIsImageLoaded(false);
              }
              showAlertMessage(
                `${newFiles.length}개의 이미지가 추가되었습니다.`,
                'success'
              );
            }}
            onClearFiles={clearFiles}
            isDragActive={isDragActive}
          />
          <ImageList
            imageFiles={imageFiles}
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
          />
        </div>
      </div>

      {/* 중앙 작업공간 */}
      <div className="flex-1 min-w-0 flex flex-col bg-gray-50">
        <div className="bg-white border-b">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                minHeight: 50,
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

        <div className="flex-1 p-2 flex flex-col">
          <TabPanel value={activeTab} index={0}>
            <div className="flex gap-2 mb-2 flex-wrap">
              <Button
                onClick={() => resetTransform(image)}
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
              >
                초기화
              </Button>
              <Button
                onClick={() => setCanvasScale((s) => Math.min(s * 1.2, 3))}
                variant="outlined"
                size="small"
                startIcon={<ZoomInIcon />}
              >
                확대
              </Button>
              <Button
                onClick={() => setCanvasScale((s) => Math.max(s / 1.2, 0.2))}
                variant="outlined"
                size="small"
                startIcon={<ZoomOutIcon />}
              >
                축소
              </Button>
              <Chip
                label={`${Math.round(canvasScale * 100)}%`}
                size="small"
                className="bg-blue-50 text-blue-700"
              />
            </div>

            <div
              ref={containerRef}
              className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden"
              style={{ width: 'calc(100vw - 680px)', height: '70vh' }}
            >
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
                scaleX={canvasScale}
                scaleY={canvasScale}
                draggable
              >
                <Layer>
                  {image && isImageLoaded && (
                    <>
                      {/* 변형된 경계선 (배경) */}
                      {(() => {
                        const points = getTransformedPoints();
                        const linePoints = [
                          points[0].x,
                          points[0].y,
                          points[1].x,
                          points[1].y,
                          points[2].x,
                          points[2].y,
                          points[3].x,
                          points[3].y,
                          points[0].x,
                          points[0].y,
                        ];

                        return (
                          <Line
                            points={linePoints}
                            stroke="rgba(59, 130, 246, 0.8)"
                            strokeWidth={2}
                            dash={[8, 4]}
                            closed
                            fill="rgba(59, 130, 246, 0.1)"
                          />
                        );
                      })()}

                      {/* 포토샵 스타일 원근 변환 (위에 겹치기) */}
                      <PerspectiveTransformImage
                        image={image}
                        getTransformedPoints={getTransformedPoints}
                        transformBounds={transformBounds}
                        stageSize={stageSize}
                      />

                      {/* 변형 컸트롤 점들 */}
                      <TransformControlPoints
                        getTransformedPoints={getTransformedPoints}
                        getEdgePoints={getEdgePoints}
                        transformMode={transformMode}
                        onCornerDrag={handleCornerDrag}
                        onEdgeDrag={handleEdgeDrag}
                      />

                      <Line
                        points={getTransformedPoints().flatMap((p) => [
                          p.x,
                          p.y,
                        ])}
                        stroke="#3b82f6"
                        strokeWidth={3}
                        closed
                      />
                    </>
                  )}
                </Layer>
              </Stage>
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <div className="flex gap-2 mb-2">
              <Button
                onClick={() => {
                  setRotation(0);
                  setFlipHorizontal(false);
                  setFlipVertical(false);
                }}
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
              >
                초기화
              </Button>
              <Button
                onClick={() => setCanvasScale((s) => Math.min(s * 1.2, 3))}
                variant="outlined"
                size="small"
                startIcon={<ZoomInIcon />}
              >
                확대
              </Button>
              <Button
                onClick={() => setCanvasScale((s) => Math.max(s / 1.2, 0.2))}
                variant="outlined"
                size="small"
                startIcon={<ZoomOutIcon />}
              >
                축소
              </Button>
              <Chip
                label={`${Math.round(canvasScale * 100)}%`}
                size="small"
                className="bg-blue-50 text-blue-700"
              />
            </div>

            <div
              ref={containerRef}
              className="border-2 border-gray-200 rounded-xl bg-white overflow-hidden"
              style={{ width: 'calc(100vw - 680px)', height: '70vh' }}
            >
              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
                scaleX={canvasScale}
                scaleY={canvasScale}
                draggable
              >
                <Layer>
                  {image && isImageLoaded && (
                    <KonvaImage
                      image={image}
                      x={stageSize.width / 2}
                      y={stageSize.height / 2}
                      offsetX={(image.naturalWidth || image.width) / 2}
                      offsetY={(image.naturalHeight || image.height) / 2}
                      width={image.naturalWidth || image.width}
                      height={image.naturalHeight || image.height}
                      rotation={rotation}
                      scaleX={flipHorizontal ? -1 : 1}
                      scaleY={flipVertical ? -1 : 1}
                      opacity={0.95}
                    />
                  )}
                </Layer>
              </Stage>
            </div>
          </TabPanel>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={activeTab === 0 ? processTransform : processRotation}
              disabled={!selectedImage || isProcessing}
              variant="contained"
              size="large"
              startIcon={activeTab === 0 ? <SettingsIcon /> : <RefreshIcon />}
              sx={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}
            >
              {activeTab === 0 ? '변형 적용' : '회전 적용'}
            </Button>
            <Button
              onClick={activeTab === 0 ? processBatch : processBatchRotation}
              disabled={imageFiles.length === 0 || isProcessing}
              variant="outlined"
              size="large"
              startIcon={<AllInclusiveIcon />}
            >
              일괄 처리
            </Button>
          </div>

          {isProcessing && (
            <div className="mt-4">
              <LinearProgress
                sx={{
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  },
                }}
              />
              <Typography
                variant="body2"
                className="text-center text-gray-600 mt-2"
              >
                처리 중...
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* 오른쪽 사이드바 - 설정 */}
      <div className="w-80 min-w-80 bg-white border-l border-gray-200 overflow-y-auto max-h-screen">
        <div className="p-4">
          <Typography variant="h6" className="font-bold text-gray-800 mb-4">
            {activeTab === 0 ? '자유 변형 설정' : '회전 설정'}
          </Typography>

          {activeTab === 0 ? (
            <div className="space-y-4">
              {/* 원터치 변형 프리셋 */}
              <div>
                <PresetTransformButtons onApplyPreset={applyPresetTransform} />
              </div>

              {/* 변형 모드 선택 */}
              <TransformModeSelector
                transformMode={transformMode}
                onModeChange={setTransformMode}
              />

              {/* 전체 이동 조정 */}
              <div className="space-y-3">
                <Typography
                  variant="subtitle2"
                  className="font-semibold text-gray-700"
                >
                  전체 이동
                </Typography>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Typography
                        variant="caption"
                        className="text-gray-600 text-xs"
                      >
                        상하 이동
                      </Typography>
                      <div className="flex gap-1">
                        <IconButton
                          size="small"
                          onClick={() => adjustVertical('up', 1)}
                          sx={{ width: 20, height: 20, color: '#3b82f6' }}
                        >
                          <ArrowUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => adjustVertical('down', 1)}
                          sx={{ width: 20, height: 20, color: '#3b82f6' }}
                        >
                          <ArrowDownIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Typography
                        variant="caption"
                        className="text-gray-600 text-xs"
                      >
                        좌우 이동
                      </Typography>
                      <div className="flex gap-1">
                        <IconButton
                          size="small"
                          onClick={() => adjustHorizontal('right', 1)}
                          sx={{ width: 20, height: 20, color: '#ef4444' }}
                        >
                          <ArrowUpIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => adjustHorizontal('left', 1)}
                          sx={{ width: 20, height: 20, color: '#ef4444' }}
                        >
                          <ArrowDownIcon fontSize="small" />
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 개별 모서리 조정 */}
              <CornerAdjustmentControls
                cornerPoints={cornerPoints}
                transformMode={transformMode}
                onAdjustCorner={adjustCornerPrecise}
              />

              <Button
                onClick={resetAllAdjustments}
                variant="outlined"
                fullWidth
                size="small"
              >
                초기화
              </Button>

              <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                <strong>사용법:</strong>
                <br />• <span className="text-blue-600">●</span>{' '}
                <span className="text-green-600">●</span>{' '}
                <span className="text-red-600">●</span>{' '}
                <span className="text-yellow-600">●</span> 모서리를 드래그하여
                변형
                <br />• <span className="text-purple-600">■</span>{' '}
                <span className="text-cyan-600">■</span>{' '}
                <span className="text-orange-600">■</span>{' '}
                <span className="text-lime-600">■</span> 변의 중점을 드래그하여
                변형
                <br />
                • 화살표 버튼으로 1픽셀 단위 조정
                <br />• {transformMode === 'free' && '모든 점에서 독립적 변형'}
                {transformMode === 'perspective' && '원근법 변형 (반대편 연동)'}
                {transformMode === 'distort' && '비틀기 변형 (인접 영향)'}
                {transformMode === 'skew' && '기울이기 변형 (평행선 유지)'}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 회전 각도 */}
              <div>
                <Typography
                  variant="subtitle2"
                  className="font-semibold mb-2 text-gray-700"
                >
                  회전 각도: {rotation}°
                </Typography>
                <Slider
                  value={rotation}
                  onChange={(_, value) => setRotation(value as number)}
                  min={-180}
                  max={180}
                  step={1}
                  valueLabelDisplay="auto"
                  sx={{ color: '#3b82f6' }}
                />
                <div className="flex gap-1 mt-2">
                  {[0, 90, 180, -90].map((angle) => (
                    <Button
                      key={angle}
                      onClick={() => setRotation(angle)}
                      variant={rotation === angle ? 'contained' : 'outlined'}
                      size="small"
                      sx={{
                        minWidth: '40px',
                        ...(rotation === angle && {
                          background:
                            'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                        }),
                      }}
                    >
                      {angle}°
                    </Button>
                  ))}
                </div>
              </div>

              {/* 반전 설정 */}
              <div>
                <Typography
                  variant="subtitle2"
                  className="font-semibold mb-2 text-gray-700"
                >
                  반전 설정
                </Typography>
                <div className="space-y-2">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={flipHorizontal}
                        onChange={(e) => setFlipHorizontal(e.target.checked)}
                        size="small"
                      />
                    }
                    label="좌우 반전"
                    className="block"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={flipVertical}
                        onChange={(e) => setFlipVertical(e.target.checked)}
                        size="small"
                      />
                    }
                    label="상하 반전"
                    className="block"
                  />
                </div>
              </div>

              <Button
                onClick={() => {
                  setRotation(0);
                  setFlipHorizontal(false);
                  setFlipVertical(false);
                }}
                variant="outlined"
                fullWidth
                size="small"
                startIcon={<RefreshIcon />}
              >
                초기화
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageProcessor;
