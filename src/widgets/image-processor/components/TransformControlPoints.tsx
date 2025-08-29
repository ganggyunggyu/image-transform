import React from 'react';
import { Circle, Rect } from 'react-konva';
import type { TransformMode } from '../../../shared/types';

interface TransformControlPointsProps {
  getTransformedPoints: () => { x: number; y: number }[];
  getEdgePoints: () => { top: number[]; right: number[]; bottom: number[]; left: number[] };
  transformMode: TransformMode;
  onCornerDrag: (idx: number, newX: number, newY: number) => void;
  onEdgeDrag: (edge: 'top' | 'right' | 'bottom' | 'left', newX: number, newY: number) => void;
}

export const TransformControlPoints: React.FC<TransformControlPointsProps> = ({
  getTransformedPoints,
  getEdgePoints,
  transformMode,
  onCornerDrag,
  onEdgeDrag,
}) => {
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
              onCornerDrag(idx, e.target.x(), e.target.y());
            }}
            onMouseEnter={(e) => {
              const shape = e.target as any;
              shape.radius(14);
              shape.strokeWidth(5);
            }}
            onMouseLeave={(e) => {
              const shape = e.target as any;
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
                onEdgeDrag(edge, e.target.x() + 12, e.target.y() + 12);
              }
            }}
            onMouseEnter={(e) => {
              if (isEdgeDraggable) {
                e.target.scaleX(1.2);
                e.target.scaleY(1.2);
              }
            }}
            onMouseLeave={(e) => {
              if (isEdgeDraggable) {
                e.target.scaleX(1);
                e.target.scaleY(1);
              }
            }}
          />
        );
      })}
    </>
  );
};