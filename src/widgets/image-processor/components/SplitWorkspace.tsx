import React from 'react';
import { useAtomValue } from 'jotai';
import { selectedImageAtom } from '@/shared/stores/atoms';
import { cn } from '@/shared/lib';

export const SplitWorkspace: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);

  if (!selectedImage) {
    return (
      <div className={cn('flex h-full items-center justify-center')}>
        <div className={cn('text-center')}>
          <p className={cn('text-sm text-slate-400')}>이미지를 선택하세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full items-center justify-center p-6')}>
      <div className={cn('relative max-w-full max-h-full')}>
        <img
          src={selectedImage.preview}
          alt={selectedImage.name}
          className={cn('max-w-full max-h-full object-contain rounded-lg shadow-lg')}
        />
        <div className={cn('mt-4 text-center')}>
          <p className={cn('text-xs text-slate-500')}>{selectedImage.name}</p>
        </div>
      </div>
    </div>
  );
};
