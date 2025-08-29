import React, { useState, useEffect } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { warpImagePerspective } from '../../../shared/utils';
import type { Point } from '../../../shared/types';

interface PerspectiveTransformImageProps {
  image: HTMLImageElement;
  getTransformedPoints: () => { x: number; y: number }[];
  transformBounds: { x: number; y: number; width: number; height: number };
  stageSize: { width: number; height: number };
}

export const PerspectiveTransformImage: React.FC<PerspectiveTransformImageProps> = ({
  image,
  getTransformedPoints,
  transformBounds,
  stageSize,
}) => {
  const [transformedImageSrc, setTransformedImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const applyPerspectiveTransform = async () => {
      try {
        const points = getTransformedPoints();
        const dstStagePoints: Point[] = [
          [points[0].x, points[0].y], // 좌상
          [points[1].x, points[1].y], // 우상
          [points[2].x, points[2].y], // 우하
          [points[3].x, points[3].y], // 좌하
        ];

        const dataUrl = await warpImagePerspective({
          imgEl: image,
          srcSize: { w: image.naturalWidth, h: image.naturalHeight },
          dstStagePoints,
          stageTL: [0, 0],
          stageScale: 1,
          stageSize: {
            x: 0,
            y: 0,
            width: stageSize.width,
            height: stageSize.height,
          },
        });

        setTransformedImageSrc(dataUrl);
      } catch (error) {
        console.error('Perspective transform failed:', error);
      }
    };

    if (image) {
      applyPerspectiveTransform();
    }
  }, [image, getTransformedPoints, transformBounds, stageSize]);

  if (!transformedImageSrc) {
    return (
      <KonvaImage
        image={image}
        x={transformBounds.x}
        y={transformBounds.y}
        width={transformBounds.width}
        height={transformBounds.height}
        opacity={0.9}
      />
    );
  }

  // 변형된 이미지를 파란 영역 내부에 클리핑하기 위해 Group과 clip 사용
  const points = getTransformedPoints();
  
  return (
    <KonvaImage
      image={(() => {
        const img = new window.Image();
        img.src = transformedImageSrc;
        return img;
      })()}
      x={0}
      y={0}
      width={stageSize.width}
      height={stageSize.height}
      opacity={1.0}
      clipFunc={(ctx: any) => {
        // 4점으로 이루어진 변형 영역으로 클리핑
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.closePath();
      }}
    />
  );
};