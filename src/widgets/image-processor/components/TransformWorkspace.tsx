import React from 'react';
import { Stage, Layer, Rect, Line, Image as KonvaImage } from 'react-konva';
import type { Stage as KonvaStage } from 'konva/lib/Stage';
import { useAtom, useAtomValue } from 'jotai';
import type { StageSize } from '@/shared/types';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  selectedImageAtom,
  imageElementAtom,
  isImageLoadedAtom,
  stageSizeAtom,
  canvasScaleAtom,
  transformBoundsAtom,
  croppedImageAtom,
} from '@/shared/stores/atoms';
import { PerspectiveTransformImage } from './PerspectiveTransformImage';
import { ImageUploader } from '@/features/image-upload';

export const TransformWorkspace: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const isImageLoaded = useAtomValue(isImageLoadedAtom);
  const [stageSize, setStageSize] = useAtom(stageSizeAtom);
  const canvasScale = useAtomValue(canvasScaleAtom);
  const [transformBounds, setTransformBounds] = useAtom(transformBoundsAtom);
  const croppedImage = useAtomValue(croppedImageAtom);
  const [croppedElement, setCroppedElement] =
    React.useState<HTMLImageElement | null>(null);

  const { getTransformedPoints } = useTransform();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<KonvaStage | null>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      const { width, height } = entry.contentRect;
      // Mobile optimized padding
      const padding = isMobile ? 12 : 24;
      const minWidth = isMobile ? 280 : 320;
      const minHeight = isMobile ? 200 : 240;

      const nextSize: StageSize = {
        width: Math.max(Math.floor(width) - padding, minWidth),
        height: Math.max(Math.floor(height) - padding, minHeight),
      };
      setStageSize(nextSize);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [setStageSize, isMobile]);

  React.useEffect(() => {
    if (!croppedImage) {
      setCroppedElement(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      setCroppedElement(img);

      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      const centerX = stageSize.width / 2;
      const centerY = stageSize.height / 2;

      const maxW = stageSize.width * 0.9;
      const maxH = stageSize.height * 0.9;

      const scaleX = maxW / imgWidth;
      const scaleY = maxH / imgHeight;
      const scale = Math.min(scaleX, scaleY);

      const w = imgWidth * scale;
      const h = imgHeight * scale;

      setTransformBounds({
        x: centerX - w / 2,
        y: centerY - h / 2,
        width: w,
        height: h,
      });
    };
    img.onerror = () => {
      console.error('크롭된 이미지 로드 실패');
      setCroppedElement(null);
    };
    img.src = croppedImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [croppedImage, stageSize, setTransformBounds]);

  if (!selectedImage) {
    return (
      <div
        className={cn(
          'flex-1 flex items-center justify-center bg-black/10 text-white text-center px-6 py-12'
        )}
      >
        <div className={cn('w-full max-w-md space-y-6')}>
          <div className={cn('space-y-2')}>
            <p className={cn('text-lg font-semibold ')}>
              이미지를 업로드하세요
            </p>
            <p className={cn('text-sm leading-relaxed')}>
              드래그 앤 드롭하거나 클릭하여 이미지를 선택할 수 있어요.
            </p>
          </div>
          <ImageUploader />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full h-full relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800'
      )}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={canvasScale}
        scaleY={canvasScale}
        draggable={!isMobile}
        preventDefault={isMobile}
        listening={true}
        imageSmoothingEnabled={true}
      >
        <Layer>
          <Rect
            x={0}
            y={0}
            width={stageSize.width}
            height={stageSize.height}
            fill="#1e293b"
            stroke="#334155"
            strokeWidth={1}
            cornerRadius={12 / Math.max(canvasScale, 1)}
          />

          {croppedElement ? (
            <KonvaImage
              image={croppedElement}
              x={transformBounds.x}
              y={transformBounds.y}
              width={transformBounds.width}
              height={transformBounds.height}
              opacity={1}
              listening={false}
            />
          ) : (
            <>
              {imageElement && (
                <KonvaImage
                  image={imageElement}
                  x={transformBounds.x}
                  y={transformBounds.y}
                  width={transformBounds.width}
                  height={transformBounds.height}
                  opacity={isImageLoaded ? 0.7 : 0.5}
                  listening={false}
                />
              )}

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
                    stroke="rgba(15, 23, 42, 0.4)"
                    strokeWidth={1}
                    closed
                    fill="rgba(15, 23, 42, 0.02)"
                  />
                );
              })()}

              {imageElement && isImageLoaded && <PerspectiveTransformImage />}
            </>
          )}
        </Layer>
      </Stage>
    </div>
  );
};
