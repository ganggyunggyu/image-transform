import React from 'react';
import { cn } from '@/shared/lib';
import { ImageUploader, ImageList } from '@/features/image-upload';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageFilesAtom, clearAllImagesAtom, showAlertMessageAtom } from '@/shared/stores/atoms';

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

      <div className={cn('flex-1 overflow-y-auto px-3 py-3 bg-white')}>
        {hasFiles ? (
          <ImageList />
        ) : (
          <div
            className={cn(
              'h-full flex flex-col items-center justify-center gap-2',
              'text-slate-400 text-center'
            )}
          >
            <svg
              className="w-8 h-8 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <p className={cn('text-xs text-slate-400')}>파일 없음</p>
          </div>
        )}
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
