import React from 'react';
import { useAtomValue } from 'jotai';
import { selectedImageAtom, splitOptionsAtom } from '@/shared/stores/atoms';
import { cn } from '@/shared/lib';

export const SplitWorkspace: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const splitOptions = useAtomValue(splitOptionsAtom);
  const [imageDimensions, setImageDimensions] = React.useState({ width: 0, height: 0 });
  const imageRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (imageRef.current) {
      const updateDimensions = () => {
        if (imageRef.current) {
          setImageDimensions({
            width: imageRef.current.clientWidth,
            height: imageRef.current.clientHeight,
          });
        }
      };

      updateDimensions();
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, [selectedImage]);

  if (!selectedImage) {
    return (
      <div className={cn('flex h-full items-center justify-center')}>
        <div className={cn('text-center')}>
          <p className={cn('text-sm text-slate-400')}>이미지를 선택하세요</p>
        </div>
      </div>
    );
  }

  const { horizontalCount, verticalCount } = splitOptions;

  // 격자선 계산
  const verticalLines = [];
  const horizontalLines = [];

  // 세로선 (좌우 분할)
  for (let i = 1; i < verticalCount; i++) {
    const xPercent = (i / verticalCount) * 100;
    verticalLines.push(xPercent);
  }

  // 가로선 (상하 분할)
  for (let i = 1; i < horizontalCount; i++) {
    const yPercent = (i / horizontalCount) * 100;
    horizontalLines.push(yPercent);
  }

  return (
    <div className={cn('flex h-full items-center justify-center p-6')}>
      <div className={cn('relative max-w-full max-h-full')}>
        <div className={cn('relative inline-block')}>
          <img
            ref={imageRef}
            src={selectedImage.preview}
            alt={selectedImage.name}
            className={cn('max-w-full max-h-full object-contain rounded-lg shadow-lg')}
            onLoad={() => {
              if (imageRef.current) {
                setImageDimensions({
                  width: imageRef.current.clientWidth,
                  height: imageRef.current.clientHeight,
                });
              }
            }}
          />

          {/* 분할선 오버레이 */}
          {imageDimensions.width > 0 && imageDimensions.height > 0 && (
            <div
              className={cn('absolute inset-0 pointer-events-none')}
              style={{
                width: imageDimensions.width,
                height: imageDimensions.height,
              }}
            >
              {/* 세로선 */}
              {verticalLines.map((xPercent, index) => (
                <div
                  key={`v-${index}`}
                  className={cn('absolute top-0 bottom-0 w-[2px]')}
                  style={{
                    left: `${xPercent}%`,
                    background: 'linear-gradient(to bottom, rgba(59, 130, 246, 0.8) 50%, transparent 50%)',
                    backgroundSize: '100% 16px',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
                  }}
                />
              ))}

              {/* 가로선 */}
              {horizontalLines.map((yPercent, index) => (
                <div
                  key={`h-${index}`}
                  className={cn('absolute left-0 right-0 h-[2px]')}
                  style={{
                    top: `${yPercent}%`,
                    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.8) 50%, transparent 50%)',
                    backgroundSize: '16px 100%',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)',
                  }}
                />
              ))}

              {/* 조각 개수 표시 */}
              {horizontalCount > 1 || verticalCount > 1 ? (
                <div
                  className={cn(
                    'absolute top-2 right-2',
                    'px-3 py-1.5 rounded-lg',
                    'bg-blue-500 text-white text-xs font-semibold',
                    'shadow-lg'
                  )}
                >
                  {horizontalCount * verticalCount}개 조각
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className={cn('mt-4 text-center')}>
          <p className={cn('text-xs text-slate-500')}>{selectedImage.name}</p>
        </div>
      </div>
    </div>
  );
};
