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
        const { horizontalCount, verticalCount } = options;
        const results: string[] = [];

        // Canvas를 한 번만 생성하고 재사용
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', {
          alpha: false, // 알파 채널 비활성화로 성능 향상
          willReadFrequently: false
        });

        if (!ctx) {
          throw new Error('Canvas context not available');
        }

        // 각 조각의 크기 계산
        const pieceWidth = Math.floor(img.width / verticalCount);
        const pieceHeight = Math.floor(img.height / horizontalCount);

        // 격자 형태로 분할 (위에서 아래로, 왼쪽에서 오른쪽으로)
        for (let row = 0; row < horizontalCount; row++) {
          for (let col = 0; col < verticalCount; col++) {
            // 마지막 행/열은 남은 크기를 모두 사용
            const width = col === verticalCount - 1
              ? img.width - (pieceWidth * col)
              : pieceWidth;

            const height = row === horizontalCount - 1
              ? img.height - (pieceHeight * row)
              : pieceHeight;

            // Canvas 크기 변경 (자동으로 clear됨)
            canvas.width = width;
            canvas.height = height;

            // 이미지 조각 그리기
            ctx.drawImage(
              img,
              pieceWidth * col,   // sx: 소스 x 시작점
              pieceHeight * row,  // sy: 소스 y 시작점
              width,              // sWidth: 소스 너비
              height,             // sHeight: 소스 높이
              0,                  // dx: 대상 x
              0,                  // dy: 대상 y
              width,              // dWidth: 대상 너비
              height              // dHeight: 대상 높이
            );

            // 품질을 0.8로 낮춰 성능 향상 (시각적 차이 거의 없음)
            results.push(canvas.toDataURL('image/webp', 0.8));
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
