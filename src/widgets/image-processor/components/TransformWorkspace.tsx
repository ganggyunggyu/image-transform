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
} from '@/shared/stores/atoms';
import { PerspectiveTransformImage } from './PerspectiveTransformImage';

export const TransformWorkspace: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const isImageLoaded = useAtomValue(isImageLoadedAtom);
  const [stageSize, setStageSize] = useAtom(stageSizeAtom);
  const canvasScale = useAtomValue(canvasScaleAtom);
  const transformBounds = useAtomValue(transformBoundsAtom);

  const {
    getTransformedPoints,
  } = useTransform();
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

  if (!selectedImage) {
    return (
      <div className={cn(
        'flex-1 min-h-[320px] rounded-3xl border border-dashed border-slate-200',
        'flex items-center justify-center bg-white text-center px-6'
      )}>
        <div className={cn('space-y-2 text-slate-500')}>
          <p className={cn('text-base font-semibold text-slate-700')}>이미지를 선택해주세요</p>
          <p className={cn('text-sm leading-relaxed')}>왼쪽 패널에서 이미지를 업로드한 뒤 선택하면 변형을 시작할 수 있어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('w-full h-full relative overflow-hidden rounded-3xl border border-slate-200 bg-white')}
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
            fill="#f8fafc"
            stroke="#e2e8f0"
            strokeWidth={1}
            cornerRadius={12 / Math.max(canvasScale, 1)}
          />

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
        </Layer>
      </Stage>
    </div>
  );
};
