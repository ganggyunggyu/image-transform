import { useCallback } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import type { Point } from '@/shared/types';
import {
  transformModeAtom,
  transformBoundsAtom,
  cornerPointsAtom,
  stageSizeAtom,
} from '@/shared/stores/atoms';
import { warpImagePerspective } from '@/shared/utils/_opencv';

export const useTransform = () => {
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const [transformBounds, setTransformBounds] = useAtom(transformBoundsAtom);
  const [cornerPoints, setCornerPoints] = useAtom(cornerPointsAtom);
  const stageSize = useAtomValue(stageSizeAtom);

  const resetTransform = useCallback((image?: HTMLImageElement) => {
    if (image && image.width && image.height) {
      const imgWidth = image.naturalWidth || image.width;
      const imgHeight = image.naturalHeight || image.height;

      const centerX = stageSize.width / 2;
      const centerY = stageSize.height / 2;

      const maxW = stageSize.width * 0.8;
      const maxH = stageSize.height * 0.8;

      const scaleX = maxW / imgWidth;
      const scaleY = maxH / imgHeight;
      const scale = Math.min(scaleX, scaleY, 1);

      const w = imgWidth * scale;
      const h = imgHeight * scale;

      const newBounds = {
        x: centerX - w / 2,
        y: centerY - h / 2,
        width: w,
        height: h,
      };

      setTransformBounds(newBounds);

      setCornerPoints([
        [newBounds.x, newBounds.y],
        [newBounds.x + newBounds.width, newBounds.y],
        [newBounds.x + newBounds.width, newBounds.y + newBounds.height],
        [newBounds.x, newBounds.y + newBounds.height],
      ]);
    }
  }, [stageSize, setTransformBounds, setCornerPoints]);

  const getTransformedPoints = useCallback(() => {
    return cornerPoints.map(([x, y]) => ({ x, y }));
  }, [cornerPoints]);

  // 변의 중점들 계산 (상/하/좌/우)
  const getEdgePoints = useCallback(() => {
    const [topLeft, topRight, bottomRight, bottomLeft] = cornerPoints;
    
    return {
      top: [(topLeft[0] + topRight[0]) / 2, (topLeft[1] + topRight[1]) / 2],      // 상단
      right: [(topRight[0] + bottomRight[0]) / 2, (topRight[1] + bottomRight[1]) / 2], // 우측
      bottom: [(bottomRight[0] + bottomLeft[0]) / 2, (bottomRight[1] + bottomLeft[1]) / 2], // 하단
      left: [(bottomLeft[0] + topLeft[0]) / 2, (bottomLeft[1] + topLeft[1]) / 2],   // 좌측
    };
  }, [cornerPoints]);

  // 개별 모서리 조정 함수들
  const setCornerPoint = useCallback((index: number, x: number, y: number) => {
    const clampX = Math.max(0, Math.min(stageSize.width, x));
    const clampY = Math.max(0, Math.min(stageSize.height, y));
    
    setCornerPoints((prev) => {
      const nextPoints = [...prev];
      nextPoints[index] = [clampX, clampY];
      return nextPoints;
    });
  }, [setCornerPoints, stageSize]);

  // 포토샵 스타일 변형 모드별 조정
  const adjustCorner = useCallback((index: number, deltaX: number, deltaY: number) => {
    const [currentX, currentY] = cornerPoints[index];
    
    switch (transformMode) {
      case 'free': {
        // 자유 변형: 선택한 모서리만 이동
        setCornerPoint(index, currentX + deltaX, currentY + deltaY);
        break;
      }

      case 'perspective': {
        // 원근 변형: 대각선 모서리 반대 방향으로 이동
        setCornerPoint(index, currentX + deltaX, currentY + deltaY);
        const oppositeIndex = (index + 2) % 4;
        const [oppX, oppY] = cornerPoints[oppositeIndex];
        setCornerPoint(oppositeIndex, oppX - deltaX * 0.3, oppY - deltaY * 0.3);
        break;
      }

      case 'distort': {
        // 비틀기: 인접한 모서리들도 영향받음
        setCornerPoint(index, currentX + deltaX, currentY + deltaY);
        const nextIndex = (index + 1) % 4;
        const prevIndex = (index + 3) % 4;
        const [nextX, nextY] = cornerPoints[nextIndex];
        const [prevX, prevY] = cornerPoints[prevIndex];
        setCornerPoint(nextIndex, nextX + deltaX * 0.2, nextY + deltaY * 0.2);
        setCornerPoint(prevIndex, prevX + deltaX * 0.2, prevY + deltaY * 0.2);
        break;
      }

      case 'skew': {
        // 기울이기: 평행선 유지하며 기울임
        if (index === 0 || index === 1) {
          setCornerPoint(0, cornerPoints[0][0] + deltaX, cornerPoints[0][1]);
          setCornerPoint(1, cornerPoints[1][0] + deltaX, cornerPoints[1][1]);
        } else {
          setCornerPoint(2, cornerPoints[2][0] + deltaX, cornerPoints[2][1]);
          setCornerPoint(3, cornerPoints[3][0] + deltaX, cornerPoints[3][1]);
        }
        break;
      }
    }
  }, [transformMode, cornerPoints, setCornerPoint]);

  // 방향별 조정 함수들
  const adjustHorizontal = useCallback((direction: 'left' | 'right', amount: number = 1) => {
    const delta = direction === 'right' ? amount : -amount;
    
    setCornerPoints(prev => prev.map(([x, y]) => [
      Math.max(0, Math.min(stageSize.width, x + delta)), y
    ]));
  }, [stageSize]);

  const adjustVertical = useCallback((direction: 'up' | 'down', amount: number = 1) => {
    const delta = direction === 'down' ? amount : -amount;
    
    setCornerPoints(prev => prev.map(([x, y]) => [
      x, Math.max(0, Math.min(stageSize.height, y + delta))
    ]));
  }, [stageSize]);

  // 모서리별 미세 조정
  const adjustCornerPrecise = useCallback((
    corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft',
    axis: 'x' | 'y', 
    delta: number
  ) => {
    const cornerMap = { topLeft: 0, topRight: 1, bottomRight: 2, bottomLeft: 3 };
    const index = cornerMap[corner];
    const [currentX, currentY] = cornerPoints[index];
    
    if (axis === 'x') {
      setCornerPoint(index, currentX + delta, currentY);
    } else {
      setCornerPoint(index, currentX, currentY + delta);
    }
  }, [cornerPoints, setCornerPoint]);

  // 변(edge) 드래그 처리
  const handleEdgeDrag = useCallback((
    edge: 'top' | 'right' | 'bottom' | 'left',
    newX: number,
    newY: number
  ) => {
    const clampX = Math.max(0, Math.min(stageSize.width, newX));
    const clampY = Math.max(0, Math.min(stageSize.height, newY));

    switch (transformMode) {
      case 'free': {
        // 자유 변형: 해당 변의 양쪽 모서리 이동
        if (edge === 'top') {
          // 상단: topLeft와 topRight의 Y좌표 변경
          setCornerPoint(0, cornerPoints[0][0], clampY);
          setCornerPoint(1, cornerPoints[1][0], clampY);
        } else if (edge === 'right') {
          // 우측: topRight와 bottomRight의 X좌표 변경
          setCornerPoint(1, clampX, cornerPoints[1][1]);
          setCornerPoint(2, clampX, cornerPoints[2][1]);
        } else if (edge === 'bottom') {
          // 하단: bottomRight와 bottomLeft의 Y좌표 변경
          setCornerPoint(2, cornerPoints[2][0], clampY);
          setCornerPoint(3, cornerPoints[3][0], clampY);
        } else if (edge === 'left') {
          // 좌측: bottomLeft와 topLeft의 X좌표 변경
          setCornerPoint(3, clampX, cornerPoints[3][1]);
          setCornerPoint(0, clampX, cornerPoints[0][1]);
        }
        break;
      }

      case 'perspective': {
        // 원근 변형: 한 변을 움직이면 반대편도 반대로 이동
        if (edge === 'top') {
          const deltaY = clampY - (cornerPoints[0][1] + cornerPoints[1][1]) / 2;
          setCornerPoint(0, cornerPoints[0][0], cornerPoints[0][1] + deltaY);
          setCornerPoint(1, cornerPoints[1][0], cornerPoints[1][1] + deltaY);
          // 하단은 반대로
          setCornerPoint(2, cornerPoints[2][0], cornerPoints[2][1] - deltaY * 0.3);
          setCornerPoint(3, cornerPoints[3][0], cornerPoints[3][1] - deltaY * 0.3);
        } else if (edge === 'bottom') {
          const deltaY = clampY - (cornerPoints[2][1] + cornerPoints[3][1]) / 2;
          setCornerPoint(2, cornerPoints[2][0], cornerPoints[2][1] + deltaY);
          setCornerPoint(3, cornerPoints[3][0], cornerPoints[3][1] + deltaY);
          // 상단은 반대로
          setCornerPoint(0, cornerPoints[0][0], cornerPoints[0][1] - deltaY * 0.3);
          setCornerPoint(1, cornerPoints[1][0], cornerPoints[1][1] - deltaY * 0.3);
        } else if (edge === 'left') {
          const deltaX = clampX - (cornerPoints[0][0] + cornerPoints[3][0]) / 2;
          setCornerPoint(0, cornerPoints[0][0] + deltaX, cornerPoints[0][1]);
          setCornerPoint(3, cornerPoints[3][0] + deltaX, cornerPoints[3][1]);
          // 우측은 반대로
          setCornerPoint(1, cornerPoints[1][0] - deltaX * 0.3, cornerPoints[1][1]);
          setCornerPoint(2, cornerPoints[2][0] - deltaX * 0.3, cornerPoints[2][1]);
        } else if (edge === 'right') {
          const deltaX = clampX - (cornerPoints[1][0] + cornerPoints[2][0]) / 2;
          setCornerPoint(1, cornerPoints[1][0] + deltaX, cornerPoints[1][1]);
          setCornerPoint(2, cornerPoints[2][0] + deltaX, cornerPoints[2][1]);
          // 좌측은 반대로
          setCornerPoint(0, cornerPoints[0][0] - deltaX * 0.3, cornerPoints[0][1]);
          setCornerPoint(3, cornerPoints[3][0] - deltaX * 0.3, cornerPoints[3][1]);
        }
        break;
      }

      case 'distort': {
        // 비틀기: 해당 변과 인접한 변들도 영향받음
        if (edge === 'top') {
          const deltaY = clampY - (cornerPoints[0][1] + cornerPoints[1][1]) / 2;
          setCornerPoint(0, cornerPoints[0][0], cornerPoints[0][1] + deltaY);
          setCornerPoint(1, cornerPoints[1][0], cornerPoints[1][1] + deltaY);
          // 좌우 변도 살짝 영향받음
          setCornerPoint(2, cornerPoints[2][0], cornerPoints[2][1] + deltaY * 0.2);
          setCornerPoint(3, cornerPoints[3][0], cornerPoints[3][1] + deltaY * 0.2);
        } else if (edge === 'right') {
          const deltaX = clampX - (cornerPoints[1][0] + cornerPoints[2][0]) / 2;
          setCornerPoint(1, cornerPoints[1][0] + deltaX, cornerPoints[1][1]);
          setCornerPoint(2, cornerPoints[2][0] + deltaX, cornerPoints[2][1]);
          // 상하 변도 살짝 영향받음
          setCornerPoint(0, cornerPoints[0][0] + deltaX * 0.2, cornerPoints[0][1]);
          setCornerPoint(3, cornerPoints[3][0] + deltaX * 0.2, cornerPoints[3][1]);
        } else if (edge === 'bottom') {
          const deltaY = clampY - (cornerPoints[2][1] + cornerPoints[3][1]) / 2;
          setCornerPoint(2, cornerPoints[2][0], cornerPoints[2][1] + deltaY);
          setCornerPoint(3, cornerPoints[3][0], cornerPoints[3][1] + deltaY);
          // 좌우 변도 살짝 영향받음
          setCornerPoint(0, cornerPoints[0][0], cornerPoints[0][1] + deltaY * 0.2);
          setCornerPoint(1, cornerPoints[1][0], cornerPoints[1][1] + deltaY * 0.2);
        } else if (edge === 'left') {
          const deltaX = clampX - (cornerPoints[0][0] + cornerPoints[3][0]) / 2;
          setCornerPoint(0, cornerPoints[0][0] + deltaX, cornerPoints[0][1]);
          setCornerPoint(3, cornerPoints[3][0] + deltaX, cornerPoints[3][1]);
          // 상하 변도 살짝 영향받음
          setCornerPoint(1, cornerPoints[1][0] + deltaX * 0.2, cornerPoints[1][1]);
          setCornerPoint(2, cornerPoints[2][0] + deltaX * 0.2, cornerPoints[2][1]);
        }
        break;
      }

      case 'skew': {
        // 기울이기: 평행선 유지하며 기울임
        if (edge === 'top' || edge === 'bottom') {
          const deltaX = clampX - (edge === 'top' 
            ? (cornerPoints[0][0] + cornerPoints[1][0]) / 2 
            : (cornerPoints[2][0] + cornerPoints[3][0]) / 2);
          
          if (edge === 'top') {
            setCornerPoint(0, cornerPoints[0][0] + deltaX, cornerPoints[0][1]);
            setCornerPoint(1, cornerPoints[1][0] + deltaX, cornerPoints[1][1]);
          } else {
            setCornerPoint(2, cornerPoints[2][0] + deltaX, cornerPoints[2][1]);
            setCornerPoint(3, cornerPoints[3][0] + deltaX, cornerPoints[3][1]);
          }
        }
        // 좌우 변은 skew 모드에서 수직으로만 이동
        else if (edge === 'left' || edge === 'right') {
          const deltaY = clampY - (edge === 'left' 
            ? (cornerPoints[0][1] + cornerPoints[3][1]) / 2 
            : (cornerPoints[1][1] + cornerPoints[2][1]) / 2);
          
          if (edge === 'left') {
            setCornerPoint(0, cornerPoints[0][0], cornerPoints[0][1] + deltaY);
            setCornerPoint(3, cornerPoints[3][0], cornerPoints[3][1] + deltaY);
          } else {
            setCornerPoint(1, cornerPoints[1][0], cornerPoints[1][1] + deltaY);
            setCornerPoint(2, cornerPoints[2][0], cornerPoints[2][1] + deltaY);
          }
        }
        break;
      }
    }
  }, [transformMode, cornerPoints, setCornerPoint, stageSize]);

  // 전체 리셋
  const resetAllAdjustments = useCallback(() => {
    const { x, y, width, height } = transformBounds;
    setCornerPoints([
      [x, y],
      [x + width, y],
      [x + width, y + height],
      [x, y + height],
    ]);
  }, [transformBounds]);

  // 원터치 프리셋 변형들 - 점진적 누적 적용
  const applyPresetTransform = useCallback((presetType: string) => {
    const intensity = 8; // 변형 강도를 줄여서 점진적으로 적용
    const currentPoints = cornerPoints;

    switch (presetType) {
      case 'perspective-left': {
        // 좌측 원근 효과 - 기존 점들에서 조금씩 안쪽으로
        setCornerPoints([
          [currentPoints[0][0] + intensity * 0.7, currentPoints[0][1] + intensity * 0.3], // 좌상: 오른쪽+아래로
          [currentPoints[1][0], currentPoints[1][1]],                                        // 우상: 그대로
          [currentPoints[2][0], currentPoints[2][1]],                                        // 우하: 그대로
          [currentPoints[3][0] + intensity * 0.7, currentPoints[3][1] - intensity * 0.3],   // 좌하: 오른쪽+위로
        ]);
        break;
      }

      case 'perspective-right': {
        // 우측 원근 효과 - 기존 점들에서 조금씩 안쪽으로
        setCornerPoints([
          [currentPoints[0][0], currentPoints[0][1]],                                        // 좌상: 그대로
          [currentPoints[1][0] - intensity * 0.7, currentPoints[1][1] + intensity * 0.3],   // 우상: 왼쪽+아래로
          [currentPoints[2][0] - intensity * 0.7, currentPoints[2][1] - intensity * 0.3],   // 우하: 왼쪽+위로
          [currentPoints[3][0], currentPoints[3][1]],                                        // 좌하: 그대로
        ]);
        break;
      }

      case 'perspective-top': {
        // 상단 원근 효과 - 기존 점들에서 조금씩 안쪽으로
        setCornerPoints([
          [currentPoints[0][0] + intensity * 0.3, currentPoints[0][1] + intensity * 0.7],   // 좌상: 오른쪽+아래로
          [currentPoints[1][0] - intensity * 0.3, currentPoints[1][1] + intensity * 0.7],   // 우상: 왼쪽+아래로
          [currentPoints[2][0], currentPoints[2][1]],                                        // 우하: 그대로
          [currentPoints[3][0], currentPoints[3][1]],                                        // 좌하: 그대로
        ]);
        break;
      }

      case 'perspective-bottom': {
        // 하단 원근 효과 - 기존 점들에서 조금씩 안쪽으로
        setCornerPoints([
          [currentPoints[0][0], currentPoints[0][1]],                                        // 좌상: 그대로
          [currentPoints[1][0], currentPoints[1][1]],                                        // 우상: 그대로
          [currentPoints[2][0] - intensity * 0.3, currentPoints[2][1] - intensity * 0.7],   // 우하: 왼쪽+위로
          [currentPoints[3][0] + intensity * 0.3, currentPoints[3][1] - intensity * 0.7],   // 좌하: 오른쪽+위로
        ]);
        break;
      }

      case 'skew-left': {
        // 좌측 기울이기 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0], currentPoints[0][1] + intensity * 0.5],  // 좌상: 아래로
          [currentPoints[1][0], currentPoints[1][1]],                     // 우상: 그대로
          [currentPoints[2][0], currentPoints[2][1]],                     // 우하: 그대로
          [currentPoints[3][0], currentPoints[3][1] - intensity * 0.5],  // 좌하: 위로
        ]);
        break;
      }

      case 'skew-right': {
        // 우측 기울이기 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0], currentPoints[0][1]],                     // 좌상: 그대로
          [currentPoints[1][0], currentPoints[1][1] + intensity * 0.5],  // 우상: 아래로
          [currentPoints[2][0], currentPoints[2][1] - intensity * 0.5],  // 우하: 위로
          [currentPoints[3][0], currentPoints[3][1]],                     // 좌하: 그대로
        ]);
        break;
      }

      case 'wave-horizontal': {
        // 수평 웨이브 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0], currentPoints[0][1] - intensity * 0.4],  // 좌상: 위로
          [currentPoints[1][0], currentPoints[1][1] + intensity * 0.4],  // 우상: 아래로
          [currentPoints[2][0], currentPoints[2][1] + intensity * 0.4],  // 우하: 아래로
          [currentPoints[3][0], currentPoints[3][1] - intensity * 0.4],  // 좌하: 위로
        ]);
        break;
      }

      case 'wave-vertical': {
        // 수직 웨이브 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0] - intensity * 0.4, currentPoints[0][1]],  // 좌상: 좌로
          [currentPoints[1][0] + intensity * 0.4, currentPoints[1][1]],  // 우상: 우로
          [currentPoints[2][0] - intensity * 0.4, currentPoints[2][1]],  // 우하: 좌로
          [currentPoints[3][0] + intensity * 0.4, currentPoints[3][1]],  // 좌하: 우로
        ]);
        break;
      }

      case 'tilt-left': {
        // 좌측 기울기 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0] - intensity * 0.5, currentPoints[0][1]],  // 좌상: 좌로
          [currentPoints[1][0] - intensity * 0.5, currentPoints[1][1]],  // 우상: 좌로
          [currentPoints[2][0] + intensity * 0.5, currentPoints[2][1]],  // 우하: 우로
          [currentPoints[3][0] + intensity * 0.5, currentPoints[3][1]],  // 좌하: 우로
        ]);
        break;
      }

      case 'tilt-right': {
        // 우측 기울기 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0] + intensity * 0.5, currentPoints[0][1]],  // 좌상: 우로
          [currentPoints[1][0] + intensity * 0.5, currentPoints[1][1]],  // 우상: 우로
          [currentPoints[2][0] - intensity * 0.5, currentPoints[2][1]],  // 우하: 좌로
          [currentPoints[3][0] - intensity * 0.5, currentPoints[3][1]],  // 좌하: 좌로
        ]);
        break;
      }

      case 'expand': {
        // 확장 효과 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0] - intensity * 0.6, currentPoints[0][1] - intensity * 0.6],  // 좌상: 확장
          [currentPoints[1][0] + intensity * 0.6, currentPoints[1][1] - intensity * 0.6],  // 우상: 확장
          [currentPoints[2][0] + intensity * 0.6, currentPoints[2][1] + intensity * 0.6],  // 우하: 확장
          [currentPoints[3][0] - intensity * 0.6, currentPoints[3][1] + intensity * 0.6],  // 좌하: 확장
        ]);
        break;
      }

      case 'contract': {
        // 축소 효과 - 누적 적용
        setCornerPoints([
          [currentPoints[0][0] + intensity * 0.6, currentPoints[0][1] + intensity * 0.6],  // 좌상: 축소
          [currentPoints[1][0] - intensity * 0.6, currentPoints[1][1] + intensity * 0.6],  // 우상: 축소
          [currentPoints[2][0] - intensity * 0.6, currentPoints[2][1] - intensity * 0.6],  // 우하: 축소
          [currentPoints[3][0] + intensity * 0.6, currentPoints[3][1] - intensity * 0.6],  // 좌하: 축소
        ]);
        break;
      }

      default:
        resetAllAdjustments();
        break;
    }
  }, [cornerPoints, resetAllAdjustments]);

  // 포토샵 스타일 정확한 원근 변환 수행
  const generatePerspectiveImage = useCallback(async (
    imageElement: HTMLImageElement, 
    stageSize: { width: number; height: number }
  ): Promise<string | null> => {
    try {
      const points = getTransformedPoints();
      
      // OpenCV.js를 사용한 4점 원근 변환
      const dstStagePoints: Point[] = [
        [points[0].x, points[0].y], // 좌상
        [points[1].x, points[1].y], // 우상  
        [points[2].x, points[2].y], // 우하
        [points[3].x, points[3].y], // 좌하
      ];
      
      const transformedDataUrl = await warpImagePerspective({
        imgEl: imageElement,
        srcSize: { w: imageElement.naturalWidth, h: imageElement.naturalHeight },
        dstStagePoints,
        stageTL: [0, 0],
        stageSize: { x: 0, y: 0, width: stageSize.width, height: stageSize.height }
      });
      
      return transformedDataUrl;
    } catch (error) {
      console.error('Perspective transform failed:', error);
      return null;
    }
  }, [getTransformedPoints]);

  return {
    // State
    transformMode,
    transformBounds,
    cornerPoints,
    
    // Actions
    setTransformMode,
    resetTransform,
    getTransformedPoints,
    getEdgePoints,
    adjustCorner,
    adjustHorizontal,
    adjustVertical,
    adjustCornerPrecise,
    handleEdgeDrag,
    resetAllAdjustments,
    setCornerPoint,
    applyPresetTransform,
    generatePerspectiveImage,
  };
};
