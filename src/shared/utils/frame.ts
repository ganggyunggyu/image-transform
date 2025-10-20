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

      const canvasWidth = Math.ceil(img.width + totalPadding * 2);
      const canvasHeight = Math.ceil(img.height + totalPadding * 2 + polaroidExtra);

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

      const imageX = totalPadding;
      const imageY = totalPadding;

      switch (shape) {
        case 'rectangle':
        case 'polaroid': {
          withShadow(ctx, shadowOptions, () => {
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          });

          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          break;
        }

        case 'rounded': {
          withShadow(ctx, shadowOptions, () => {
            drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, cornerRadius);
            ctx.fillStyle = frameColor;
            ctx.fill();
          });

          ctx.save();
          drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, cornerRadius);
          ctx.clip();
          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          ctx.restore();
          break;
        }

        case 'circle': {
          const centerX = canvasWidth / 2;
          const centerY = (canvasHeight - polaroidExtra) / 2;
          const radius = Math.min(img.width, img.height) / 2 + totalPadding;

          withShadow(ctx, shadowOptions, () => {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fillStyle = 'white';
            ctx.fill();
          });

          if (safeBorder > 0) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.strokeStyle = frameColor;
            ctx.lineWidth = safeBorder;
            ctx.stroke();
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius - safeBorder / 2, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          const drawX = centerX - img.width / 2;
          const drawY = centerY - img.height / 2;
          ctx.drawImage(img, drawX, drawY, img.width, img.height);
          ctx.restore();
          break;
        }

        default: {
          withShadow(ctx, shadowOptions, () => {
            ctx.fillStyle = frameColor;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          });

          ctx.drawImage(img, imageX, imageY, img.width, img.height);
          break;
        }
      }

      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
};
