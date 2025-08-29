import React, { useRef, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Stage, Layer, Image as KonvaImage, Line, Circle, Rect } from 'react-konva';
import useImage from 'use-image';
import {
  Button,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import {
  selectedImageAtom,
  canvasScaleAtom,
  stageSizeAtom,
  isImageLoadedAtom,
} from '../../../shared/stores/atoms';
import { useTransform } from '../../../features/free-transform';
import { PerspectiveTransformImage } from './PerspectiveTransformImage';

export const CanvasSection: React.FC = () => {
  const [selectedImage] = useAtom(selectedImageAtom);
  const [canvasScale, setCanvasScale] = useAtom(canvasScaleAtom);
  const [stageSize, setStageSize] = useAtom(stageSizeAtom);
  const [isImageLoaded, setIsImageLoaded] = useAtom(isImageLoadedAtom);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [image] = useImage(selectedImage?.preview || '');

  const {
    transformMode,
    transformBounds,
    getTransformedPoints,
    getEdgePoints,
    resetTransform,
    handleCornerDrag,
    handleEdgeDrag,
  } = useTransform(stageSize);

  // 컨테이너 크기에 따라 스테이지 크기 조정
  useEffect(() => {
    const updateStageSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setStageSize({
          width: Math.max(rect.width, 400),
          height: Math.max(rect.height, 300),
        });
      }
    };

    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, [setStageSize]);

  // 이미지 로드 완료 처리
  useEffect(() => {
    if (image && selectedImage && !isImageLoaded) {
      setIsImageLoaded(true);
      resetTransform(image);
    }
  }, [image, selectedImage, isImageLoaded, setIsImageLoaded, resetTransform]);

  if (!selectedImage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">이미지를 선택해주세요</p>
          <p className="text-sm">왼쪽에서 이미지를 업로드하고 선택하면 변형할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col bg-gray-50">
      {/* 캔버스 컨트롤 */}
      <div className="flex gap-2 p-2 bg-white border-b">
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

      {/* 캔버스 */}
      <div
        ref={containerRef}
        className="flex-1 border-2 border-gray-200 rounded-xl bg-white overflow-hidden m-2"
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
                    points[0].x, points[0].y, // 좌상 -> 우상
                    points[1].x, points[1].y,
                    points[2].x, points[2].y, // 우상 -> 우하  
                    points[3].x, points[3].y, // 우하 -> 좌하
                    points[0].x, points[0].y  // 좌하 -> 좌상 (닫기)
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

                {/* 모서리 컨트롤 점들 */}
                {getTransformedPoints().map((p, idx) => {
                  const isDraggable = transformMode === 'free' || 
                                    (transformMode === 'perspective' && (idx === 0 || idx === 2)) || 
                                    transformMode === 'distort' || 
                                    (transformMode === 'skew' && (idx === 0 || idx === 1 || idx === 2 || idx === 3));
                  const cornerColors = ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'];
                  
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
                        handleCornerDrag(idx, e.target.x(), e.target.y()); 
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
                {(() => {
                  const edgePoints = getEdgePoints();
                  const edgeColors = {
                    top: '#8b5cf6',
                    right: '#06b6d4',
                    bottom: '#f97316',
                    left: '#84cc16'
                  };
                  
                  return Object.entries(edgePoints).map(([edgeKey, [x, y]]) => {
                    const edge = edgeKey as 'top' | 'right' | 'bottom' | 'left';
                    const isEdgeDraggable = transformMode === 'free' || 
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
                  });
                })()}
              </>
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};