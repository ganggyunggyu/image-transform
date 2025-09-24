import React from 'react';
import { cn } from '@/shared/lib';
import { ImageUploader, ImageList } from '@/features/image-upload';
import { useAtomValue, useSetAtom } from 'jotai';
import { imageFilesAtom, selectedImageAtom, clearAllImagesAtom, showAlertMessageAtom } from '@/shared/stores/atoms';

export const FileSidebar: React.FC = () => {
  const imageFiles = useAtomValue(imageFilesAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const clearAllImages = useSetAtom(clearAllImagesAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);

  return (
    <aside className={cn(
      'w-full h-full flex flex-col',
      'bg-white border-r border-slate-200/80'
    )}>
      <div className={cn(
        'px-6 py-5',
        'border-b border-slate-200/80'
      )}>
        <div className={cn('flex items-center justify-between')}>
          <div className={cn('flex items-center gap-3')}>
            <div className={cn(
              'w-9 h-9 rounded-xl border border-slate-200',
              'bg-slate-50 text-slate-600',
              'flex items-center justify-center text-xs font-semibold uppercase tracking-[0.2em]'
            )}>
              File
            </div>
            <div>
              <h3 className={cn('font-semibold text-slate-900')}>
                이미지 파일
              </h3>
              <p className={cn('text-xs text-slate-400')}>
                {imageFiles.length}개 파일
              </p>
            </div>
          </div>

          {selectedImage && (
            <span className={cn(
              'px-2.5 py-1 rounded-full',
              'bg-slate-100 text-slate-600',
              'text-xs font-medium'
            )}>
              활성
            </span>
          )}
        </div>
      </div>

      <div className={cn('px-6 py-5 border-b border-slate-200/60')}>
        <ImageUploader />
      </div>

      <div className={cn(
        'flex-1 overflow-y-auto',
        'px-6 py-5',
        'bg-white'
      )}>
        {imageFiles.length === 0 ? (
          <div className={cn(
            'h-full flex flex-col items-center justify-center gap-3',
            'text-slate-400 text-center'
          )}>
            <div className={cn(
              'w-20 h-20 rounded-2xl border border-dashed border-slate-200',
              'flex items-center justify-center'
            )}>
              <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <p className={cn('text-sm font-medium text-slate-500')}>
              파일이 없습니다
            </p>
            <p className={cn('text-xs text-slate-400 leading-relaxed')}>
              위의 업로드 영역에 이미지를 드래그하거나 클릭하여 추가하세요
            </p>
          </div>
        ) : (
          <ImageList />
        )}
      </div>

      {imageFiles.length > 0 && (
        <div className={cn(
          'px-6 py-4',
          'border-t border-slate-200/80',
          'bg-slate-50/70'
        )}>
          <div className={cn('flex items-center justify-between text-xs font-medium text-slate-500')}>
            <span>
              총 {imageFiles.length}개
            </span>
            <button
              onClick={() => {
                clearAllImages();
                showAlertMessage('모든 파일을 비웠습니다.', 'info');
              }}
              className={cn('text-slate-600 transition-colors duration-200 hover:text-slate-900')}
            >
              모두 삭제
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
