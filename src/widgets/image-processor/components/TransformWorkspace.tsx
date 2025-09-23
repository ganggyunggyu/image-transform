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
  transformModeAtom,
} from '@/shared/stores/atoms';
import { PerspectiveTransformImage } from './PerspectiveTransformImage';
import { TransformControlPoints } from './TransformControlPoints';

export const TransformWorkspace: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const isImageLoaded = useAtomValue(isImageLoadedAtom);
  const [stageSize, setStageSize] = useAtom(stageSizeAtom);
  const canvasScale = useAtomValue(canvasScaleAtom);
  const transformBounds = useAtomValue(transformBoundsAtom);
  const transformMode = useAtomValue(transformModeAtom);

  const {
    getTransformedPoints,
    getEdgePoints,
    setCornerPoint,
    handleEdgeDrag,
  } = useTransform();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<KonvaStage | null>(null);

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
      const nextSize: StageSize = {
        width: Math.max(Math.floor(width) - 24, 320),
        height: Math.max(Math.floor(height) - 24, 240),
      };
      setStageSize(nextSize);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [setStageSize]);

  if (!selectedImage) {
    return (
      <div className={cn('flex-1 min-h-[320px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-dashed border-slate-200')}>
        <div className={cn('text-center space-y-2')}>
          <p className={cn('text-lg font-semibold text-slate-700')}>이미지를 선택해주세요</p>
          <p className={cn('text-sm text-slate-500')}>왼쪽 패널에서 이미지를 업로드하고 선택하면 변형을 시작할 수 있어요.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('flex-1 border-2 border-slate-200 rounded-2xl bg-white overflow-hidden relative')}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={canvasScale}
        scaleY={canvasScale}
        draggable
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
                stroke="rgba(59, 130, 246, 0.9)"
                strokeWidth={2}
                dash={[8, 4]}
                closed
                fill="rgba(59, 130, 246, 0.08)"
              />
            );
          })()}

          {imageElement && isImageLoaded && <PerspectiveTransformImage />}

          <TransformControlPoints />
        </Layer>
      </Stage>
    </div>
  );
};
