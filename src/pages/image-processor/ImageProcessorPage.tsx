import React from 'react';
import { ImageProcessor } from '@/widgets/image-processor';
import { cn } from '@/shared/lib';

export const ImageProcessorPage: React.FC = () => {
  return (
    <div className={cn('flex flex-col gap-6 lg:gap-8')}>
      <div className={cn('flex flex-col gap-2 text-slate-500')}>
        <span
          className={cn(
            'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
          )}
        >
          Studio
        </span>
        <h1 className={cn('text-2xl sm:text-3xl font-semibold text-slate-900')}>
          이미지 변형 스튜디오
        </h1>
        <p
          className={cn(
            'text-sm sm:text-base leading-relaxed text-slate-500 max-w-3xl'
          )}
        >
          변형, 회전, 반전을 하나의 화면에서 정리하세요. 좌우 패널에서는 파일
          관리와 세부 조정을 동시에 진행할 수 있습니다.
        </p>
      </div>

      <ImageProcessor />
    </div>
  );
};
