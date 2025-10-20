import type { FrameOptions } from '../types';

const clamp = (value: number, min: number, max: number) => {
  if (Number.isNaN(value)) {
    return min;
  }
  return Math.min(Math.max(value, min), max);
};

const toRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace('#', '').trim();
  const expanded = normalized.length === 3
    ? normalized
        .split('')
        .map((ch) => `${ch}${ch}`)
        .join('')
    : normalized;

  if (expanded.length !== 6) {
    return `rgba(255, 255, 255, ${clamp(alpha, 0, 1)})`;
  }

  const r = Number.parseInt(expanded.substring(0, 2), 16);
  const g = Number.parseInt(expanded.substring(2, 4), 16);
  const b = Number.parseInt(expanded.substring(4, 6), 16);

  if ([r, g, b].some((channel) => Number.isNaN(channel))) {
    return `rgba(255, 255, 255, ${clamp(alpha, 0, 1)})`;
  }

  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const getImageBounds = (img: HTMLImageElement): { x: number; y: number; width: number; height: number } => {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return { x: 0, y: 0, width: img.width, height: img.height };
  }

  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const { data, width, height } = imageData;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX > maxX || minY > maxY) {
    return { x: 0, y: 0, width: img.width, height: img.height };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const safeRadius = clamp(radius, 0, Math.min(width, height) / 2);

  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
};

const withShadow = (
  ctx: CanvasRenderingContext2D,
  options: Pick<FrameOptions, 'shadowEnabled' | 'shadowBlur' | 'shadowColor' | 'shadowOpacity' | 'shadowOffsetX' | 'shadowOffsetY'>,
  callback: () => void,
) => {
  ctx.save();

  if (options.shadowEnabled) {
    ctx.shadowColor = toRgba(options.shadowColor, options.shadowOpacity);
    ctx.shadowBlur = options.shadowBlur;
    ctx.shadowOffsetX = options.shadowOffsetX;
    ctx.shadowOffsetY = options.shadowOffsetY;
  }

  callback();
  ctx.restore();
};

export const applyFrameToImage = (
  dataUrl: string,
  frameOptions: FrameOptions
): Promise<string> => {
  if (frameOptions.shape === 'none') {
    return Promise.resolve(dataUrl);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const {
        padding,
        borderWidth,
        borderColor,
        borderOpacity,
        cornerRadius,
        shadowEnabled,
        shadowBlur,
        shadowColor,
        shadowOpacity,
        shadowOffsetX,
        shadowOffsetY,
        shape,
      } = frameOptions;

      const safePadding = Math.max(0, padding);
      const safeBorder = Math.max(0, borderWidth);
      const totalPadding = safePadding + safeBorder;
      const polaroidExtra = shape === 'polaroid' ? safePadding * 2.5 : 0;

      // 실제 이미지 컨텐츠 영역 찾기
      const bounds = getImageBounds(img);

      const canvasWidth = Math.ceil(bounds.width + totalPadding * 2);
      const canvasHeight = Math.ceil(bounds.height + totalPadding * 2 + polaroidExtra);

      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      const frameColor = toRgba(borderColor, borderOpacity);
      const shadowOptions = {
        shadowEnabled,
        shadowBlur,
        shadowColor,
        shadowOpacity,
        shadowOffsetX,
        shadowOffsetY,
      };

      // 이미지를 그릴 위치 (바운딩 박스를 고려)
      const imageX = totalPadding - bounds.x;
      const imageY = totalPadding - bounds.y;

      switch (shape) {
        case 'rectangle':
        case 'polaroid': {
          if (safeBorder > 0) {
            withShadow(ctx, shadowOptions, () => {
              ctx.strokeStyle = frameColor;
              ctx.lineWidth = safeBorder;
              ctx.strokeRect(safeBorder / 2, safeBorder / 2, canvasWidth - safeBorder, canvasHeight - safeBorder);
            });
          }

          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          break;
        }

        case 'rounded': {
          if (safeBorder > 0) {
            withShadow(ctx, shadowOptions, () => {
              drawRoundedRect(ctx, safeBorder / 2, safeBorder / 2, canvasWidth - safeBorder, canvasHeight - safeBorder, cornerRadius);
              ctx.strokeStyle = frameColor;
              ctx.lineWidth = safeBorder;
              ctx.stroke();
            });
          }

          ctx.save();
          drawRoundedRect(ctx, totalPadding, totalPadding, bounds.width, bounds.height, Math.max(0, cornerRadius - safeBorder));
          ctx.clip();
          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          ctx.restore();
          break;
        }

        case 'circle': {
          const centerX = canvasWidth / 2;
          const centerY = (canvasHeight - polaroidExtra) / 2;
          const radius = Math.min(bounds.width, bounds.height) / 2 + safePadding;

          if (safeBorder > 0) {
            withShadow(ctx, shadowOptions, () => {
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius + safeBorder / 2, 0, Math.PI * 2);
              ctx.closePath();
              ctx.strokeStyle = frameColor;
              ctx.lineWidth = safeBorder;
              ctx.stroke();
            });
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          const drawX = imageX;
          const drawY = imageY;
          ctx.drawImage(img, drawX, drawY, img.width, img.height);
          ctx.restore();
          break;
        }

        default: {
          if (safeBorder > 0) {
            withShadow(ctx, shadowOptions, () => {
              ctx.strokeStyle = frameColor;
              ctx.lineWidth = safeBorder;
              ctx.strokeRect(safeBorder / 2, safeBorder / 2, canvasWidth - safeBorder, canvasHeight - safeBorder);
            });
          }

          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          break;
        }
      }

      resolve(canvas.toDataURL('image/webp', 0.85));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};
