import React from 'react';
import { Circle, Rect } from 'react-konva';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAtomValue } from 'jotai';
import type { Point } from '@/shared/types';
import { useTransform } from '@/features/free-transform';
import { transformModeAtom } from '@/shared/stores/atoms';

export const TransformControlPoints: React.FC = () => {
  const transformMode = useAtomValue(transformModeAtom);
  const {
    getTransformedPoints,
    getEdgePoints,
    setCornerPoint,
    handleEdgeDrag,
  } = useTransform();
  const cornerColors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];
  const edgeColors = {
    top: '#8b5cf6',
    right: '#06b6d4',
    bottom: '#f97316',
    left: '#84cc16',
  };

  return (
    <>
      {/* 모서리 컨트롤 점들 */}
      {getTransformedPoints().map((p, idx) => {
        const isDraggable =
          transformMode === 'free' ||
          (transformMode === 'perspective' && (idx === 0 || idx === 2)) ||
          transformMode === 'distort' ||
          (transformMode === 'skew' && (idx === 0 || idx === 1 || idx === 2 || idx === 3));

        return (
          <Circle
            key={idx}
            x={p.x}
            y={p.y}
            radius={12}
            fill={isDraggable ? cornerColors[idx] : '#9ca3af'}
            stroke="white"
            strokeWidth={4}
            draggable={isDraggable}
            opacity={isDraggable ? 1 : 0.6}
            shadowColor="black"
            shadowBlur={8}
            shadowOpacity={0.3}
            shadowOffsetX={2}
            shadowOffsetY={2}
            listening={true}
            hitStrokeWidth={20}
            onDragMove={(e) => {
              setCornerPoint(idx, e.target.x(), e.target.y());
            }}
            onMouseEnter={(event: KonvaEventObject<MouseEvent>) => {
              const shape = event.target as Konva.Circle;
              shape.radius(14);
              shape.strokeWidth(5);
            }}
            onMouseLeave={(event: KonvaEventObject<MouseEvent>) => {
              const shape = event.target as Konva.Circle;
              shape.radius(12);
              shape.strokeWidth(4);
            }}
          />
        );
      })}

      {/* 가장자리 컨트롤 점들 */}
      {Object.entries(getEdgePoints()).map(([edgeKey, edgePoint]) => {
        const edge = edgeKey as 'top' | 'right' | 'bottom' | 'left';
        const [x, y] = edgePoint;
        const isEdgeDraggable =
          transformMode === 'free' ||
          transformMode === 'perspective' ||
          transformMode === 'distort' ||
          transformMode === 'skew';

        return (
          <Rect
            key={`edge-${edge}`}
            x={x - 12}
            y={y - 12}
            width={24}
            height={24}
            fill={isEdgeDraggable ? edgeColors[edge] : '#9ca3af'}
            stroke="white"
            strokeWidth={4}
            cornerRadius={3}
            draggable={isEdgeDraggable}
            opacity={isEdgeDraggable ? 0.95 : 0.5}
            shadowColor="rgba(0,0,0,0.4)"
            shadowBlur={isEdgeDraggable ? 6 : 0}
            shadowOffset={{ x: 2, y: 2 }}
            listening={true}
            hitStrokeWidth={20}
            onDragMove={(e) => {
              if (isEdgeDraggable) {
                handleEdgeDrag(edge, e.target.x() + 12, e.target.y() + 12);
              }
            }}
            onMouseEnter={(event: KonvaEventObject<MouseEvent>) => {
              if (isEdgeDraggable) {
                event.target.scaleX(1.2);
                event.target.scaleY(1.2);
              }
            }}
            onMouseLeave={(event: KonvaEventObject<MouseEvent>) => {
              if (isEdgeDraggable) {
                event.target.scaleX(1);
                event.target.scaleY(1);
              }
            }}
          />
        );
      })}
    </>
  );
};
