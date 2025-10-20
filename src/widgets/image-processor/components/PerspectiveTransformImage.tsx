import React, { useState, useEffect, useMemo } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useAtomValue } from 'jotai';
import { warpImagePerspective, applyFrameToImage } from '@/shared/utils';
import { useTransform } from '@/features/free-transform';
import {
  imageElementAtom,
  transformBoundsAtom,
  stageSizeAtom,
  frameOptionsAtom,
} from '@/shared/stores/atoms';
import type { Point } from '@/shared/types';

export const PerspectiveTransformImage: React.FC = () => {
  const image = useAtomValue(imageElementAtom);
  const transformBounds = useAtomValue(transformBoundsAtom);
  const stageSize = useAtomValue(stageSizeAtom);
  const frameOptions = useAtomValue(frameOptionsAtom);
  const { getTransformedPoints } = useTransform();

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

        if (!image) return;

        let dataUrl = await warpImagePerspective({
          imgEl: image,
          srcSize: { w: image.naturalWidth, h: image.naturalHeight },
          dstStagePoints,
          stageTL: [transformBounds.x, transformBounds.y],
          stageSize: transformBounds,
        });

        if (frameOptions.shape !== 'none') {
          dataUrl = await applyFrameToImage(dataUrl, frameOptions);
        }

        setTransformedImageSrc(dataUrl);
      } catch (error) {
        console.error('Perspective transform failed:', error);
      }
    };

    if (image) {
      applyPerspectiveTransform();
    }
  }, [image, getTransformedPoints, transformBounds, frameOptions]);

  const transformedImage = useMemo(() => {
    if (!transformedImageSrc) {
      return null;
    }

    const img = new window.Image();
    img.src = transformedImageSrc;
    return img;
  }, [transformedImageSrc]);

  if (!image) {
    return null;
  }

  if (!transformedImage) {
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

  const points = getTransformedPoints();
  
  return (
    <KonvaImage
      image={transformedImage}
      x={0}
      y={0}
      width={stageSize.width}
      height={stageSize.height}
      opacity={1.0}
      clipFunc={(ctx: CanvasRenderingContext2D) => {
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
