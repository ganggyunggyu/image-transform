import type { CropOptions } from '../types';

export const cropImage = async (
  imageElement: HTMLImageElement,
  cropOptions: CropOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const { top, bottom, left, right } = cropOptions;

      const sourceWidth = imageElement.naturalWidth || imageElement.width;
      const sourceHeight = imageElement.naturalHeight || imageElement.height;

      // 크롭 후 최종 크기 계산
      const croppedWidth = sourceWidth - left - right;
      const croppedHeight = sourceHeight - top - bottom;

      // 유효성 검사
      if (croppedWidth <= 0 || croppedHeight <= 0) {
        reject(new Error('크롭 영역이 너무 큽니다. 이미지가 남지 않습니다.'));
        return;
      }

      // Canvas 생성
      const canvas = document.createElement('canvas');
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context를 생성할 수 없습니다.'));
        return;
      }

      // 크롭된 영역만 그리기
      ctx.drawImage(
        imageElement,
        left, // 소스 X
        top, // 소스 Y
        croppedWidth, // 소스 너비
        croppedHeight, // 소스 높이
        0, // 대상 X
        0, // 대상 Y
        croppedWidth, // 대상 너비
        croppedHeight // 대상 높이
      );

      // WebP로 변환
      resolve(canvas.toDataURL('image/webp', 0.95));
    } catch (error) {
      reject(error);
    }
  });
};
