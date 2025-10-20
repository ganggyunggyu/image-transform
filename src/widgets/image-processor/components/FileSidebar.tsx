import React from 'react';
import { cn } from '@/shared/lib';
import { ImageUploader } from '@/features/image-upload';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  imageFilesAtom,
  clearAllImagesAtom,
  showAlertMessageAtom,
} from '@/shared/stores/atoms';

export const FileSidebar: React.FC = () => {
  const imageFiles = useAtomValue(imageFilesAtom);
  const clearAllImages = useSetAtom(clearAllImagesAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);
  const hasFiles = imageFiles.length > 0;

  return (
    <aside
      className={cn(
        'w-full h-full flex flex-col',
        'bg-white border-r border-slate-200/80'
      )}
    >
      <div className={cn('px-3 py-3 border-b border-slate-200/60')}>
        <ImageUploader />
      </div>

      {hasFiles && (
        <div
          className={cn(
            'px-3 py-2',
            'border-t border-slate-200/60',
            'bg-slate-50/50'
          )}
        >
          <button
            onClick={() => {
              clearAllImages();
              showAlertMessage('모든 파일을 비웠습니다.', 'info');
            }}
            className={cn(
              'w-full px-2 py-1.5 rounded-lg',
              'text-xs font-medium text-slate-600',
              'transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900'
            )}
          >
            모두 삭제
          </button>
        </div>
      )}
    </aside>
  );
};
