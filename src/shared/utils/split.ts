import type { ImageFile, SplitOptions } from '../types';

export const splitImage = async (
  imageFile: ImageFile,
  options: SplitOptions
): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const { direction, count } = options;
        const results: string[] = [];

        if (direction === 'vertical') {
          // 좌우 분할 (오른쪽부터 왼쪽으로)
          const pieceWidth = Math.floor(img.width / count);

          for (let i = count - 1; i >= 0; i--) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Canvas context not available');
            }

            // 첫 조각(원래 마지막)은 남은 너비를 모두 사용
            const width = i === count - 1 ? img.width - (pieceWidth * i) : pieceWidth;

            canvas.width = width;
            canvas.height = img.height;

            // 이미지 조각 그리기
            ctx.drawImage(
              img,
              pieceWidth * i, // sx: 소스 x 시작점
              0, // sy: 소스 y 시작점
              width, // sWidth: 소스 너비
              img.height, // sHeight: 소스 높이
              0, // dx: 대상 x
              0, // dy: 대상 y
              width, // dWidth: 대상 너비
              img.height // dHeight: 대상 높이
            );

            results.push(canvas.toDataURL('image/webp', 0.85));
          }
        } else {
          // 상하 분할 (아래부터 위로)
          const pieceHeight = Math.floor(img.height / count);

          for (let i = count - 1; i >= 0; i--) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Canvas context not available');
            }

            // 첫 조각(원래 마지막)은 남은 높이를 모두 사용
            const height = i === count - 1 ? img.height - (pieceHeight * i) : pieceHeight;

            canvas.width = img.width;
            canvas.height = height;

            // 이미지 조각 그리기
            ctx.drawImage(
              img,
              0, // sx: 소스 x 시작점
              pieceHeight * i, // sy: 소스 y 시작점
              img.width, // sWidth: 소스 너비
              height, // sHeight: 소스 높이
              0, // dx: 대상 x
              0, // dy: 대상 y
              img.width, // dWidth: 대상 너비
              height // dHeight: 대상 높이
            );

            results.push(canvas.toDataURL('image/webp', 0.85));
          }
        }

        resolve(results);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = imageFile.preview;
  });
};
