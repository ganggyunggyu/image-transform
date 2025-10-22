import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { useAtomValue } from 'jotai';
import { warpImagePerspective, applyFrameToImage } from '@/shared/utils';
import { useTransform } from '@/features/free-transform';
import {
  imageElementAtom,
  transformBoundsAtom,
  stageSizeAtom,
  frameOptionsAtom,
  croppedImageRawAtom,
} from '@/shared/stores/atoms';
import type { Point } from '@/shared/types';

export const PerspectiveTransformImage: React.FC = () => {
  const originalImage = useAtomValue(imageElementAtom);
  const croppedImageRaw = useAtomValue(croppedImageRawAtom);
  const transformBounds = useAtomValue(transformBoundsAtom);
  const stageSize = useAtomValue(stageSizeAtom);
  const frameOptions = useAtomValue(frameOptionsAtom);
  const { getTransformedPoints } = useTransform();

  const [croppedElement, setCroppedElement] = useState<HTMLImageElement | null>(null);
  const [transformedImageSrc, setTransformedImageSrc] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!croppedImageRaw) {
      setCroppedElement(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => setCroppedElement(img);
    img.onerror = () => setCroppedElement(null);
    img.src = croppedImageRaw;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [croppedImageRaw]);

  const image = croppedElement || originalImage;

  const applyPerspectiveTransform = useCallback(async () => {
    try {
      const points = getTransformedPoints();
      const dstStagePoints: Point[] = [
        [points[0].x, points[0].y],
        [points[1].x, points[1].y],
        [points[2].x, points[2].y],
        [points[3].x, points[3].y],
      ];

      if (!image) return;

      const maxPreviewSize = 800;
      const scale = Math.min(1, maxPreviewSize / Math.max(image.naturalWidth, image.naturalHeight));
      const previewWidth = Math.floor(image.naturalWidth * scale);
      const previewHeight = Math.floor(image.naturalHeight * scale);

      let resizedImage = image;
      if (scale < 1) {
        const canvas = document.createElement('canvas');
        canvas.width = previewWidth;
        canvas.height = previewHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'medium';
          ctx.drawImage(image, 0, 0, previewWidth, previewHeight);
          const tempImg = new window.Image();
          await new Promise<void>((resolve) => {
            tempImg.onload = () => resolve();
            tempImg.src = canvas.toDataURL('image/webp', 0.5);
          });
          resizedImage = tempImg;
        }
      }

      let dataUrl = await warpImagePerspective({
        imgEl: resizedImage,
        srcSize: { w: resizedImage.naturalWidth, h: resizedImage.naturalHeight },
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
  }, [image, getTransformedPoints, transformBounds, frameOptions]);

  useEffect(() => {
    if (!image) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      applyPerspectiveTransform();
    }, 150);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [image, applyPerspectiveTransform]);

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
