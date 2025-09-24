import React from 'react';
import { Circle, Rect } from 'react-konva';
import Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { useAtomValue } from 'jotai';
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
  const cornerColors = ['#0f172a', '#0f172a', '#0f172a', '#0f172a'];
  const edgeColors = {
    top: '#334155',
    right: '#334155',
    bottom: '#334155',
    left: '#334155',
  } as const;

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

  // Optimized sizes for mobile
  const cornerRadius = isMobile ? 16 : 12;
  const cornerHoverRadius = isMobile ? 18 : 14;
  const strokeWidth = isMobile ? 3 : 4;
  const hoverStrokeWidth = isMobile ? 4 : 5;
  const hitStrokeWidth = isMobile ? 30 : 20;
  const edgeSize = isMobile ? 28 : 24;

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
            radius={cornerRadius}
            fill={isDraggable ? cornerColors[idx] : '#9ca3af'}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
            draggable={isDraggable}
            opacity={isDraggable ? 1 : 0.6}
            shadowColor="rgba(15,23,42,0.25)"
            shadowBlur={6}
            shadowOpacity={0.2}
            shadowOffsetX={1}
            shadowOffsetY={1}
            listening={true}
            hitStrokeWidth={hitStrokeWidth}
            onDragMove={(e) => {
              setCornerPoint(idx, e.target.x(), e.target.y());
            }}
            onMouseEnter={(event: KonvaEventObject<MouseEvent>) => {
              if (!isMobile) {
                const shape = event.target as Konva.Circle;
                shape.radius(cornerHoverRadius);
                shape.strokeWidth(hoverStrokeWidth);
              }
            }}
            onMouseLeave={(event: KonvaEventObject<MouseEvent>) => {
              if (!isMobile) {
                const shape = event.target as Konva.Circle;
                shape.radius(cornerRadius);
                shape.strokeWidth(strokeWidth);
              }
            }}
            onTouchStart={(event: KonvaEventObject<TouchEvent>) => {
              if (isMobile) {
                const shape = event.target as Konva.Circle;
                shape.radius(cornerHoverRadius);
                shape.strokeWidth(hoverStrokeWidth);
              }
            }}
            onTouchEnd={(event: KonvaEventObject<TouchEvent>) => {
              if (isMobile) {
                const shape = event.target as Konva.Circle;
                shape.radius(cornerRadius);
                shape.strokeWidth(strokeWidth);
              }
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
            x={x - edgeSize / 2}
            y={y - edgeSize / 2}
            width={edgeSize}
            height={edgeSize}
            fill={isEdgeDraggable ? edgeColors[edge] : '#9ca3af'}
            stroke="rgba(255,255,255,0.9)"
            strokeWidth={strokeWidth}
            cornerRadius={3}
            draggable={isEdgeDraggable}
            opacity={isEdgeDraggable ? 0.95 : 0.5}
            shadowColor="rgba(0,0,0,0.4)"
            shadowBlur={isEdgeDraggable ? 6 : 0}
            shadowOffset={{ x: 2, y: 2 }}
            listening={true}
            hitStrokeWidth={hitStrokeWidth}
            onDragMove={(e) => {
              if (isEdgeDraggable) {
                handleEdgeDrag(edge, e.target.x() + edgeSize / 2, e.target.y() + edgeSize / 2);
              }
            }}
            onMouseEnter={(event: KonvaEventObject<MouseEvent>) => {
              if (isEdgeDraggable && !isMobile) {
                event.target.scaleX(1.2);
                event.target.scaleY(1.2);
              }
            }}
            onMouseLeave={(event: KonvaEventObject<MouseEvent>) => {
              if (isEdgeDraggable && !isMobile) {
                event.target.scaleX(1);
                event.target.scaleY(1);
              }
            }}
            onTouchStart={(event: KonvaEventObject<TouchEvent>) => {
              if (isEdgeDraggable && isMobile) {
                event.target.scaleX(1.2);
                event.target.scaleY(1.2);
              }
            }}
            onTouchEnd={(event: KonvaEventObject<TouchEvent>) => {
              if (isEdgeDraggable && isMobile) {
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
