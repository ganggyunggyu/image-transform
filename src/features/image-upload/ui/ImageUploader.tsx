import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useAtomValue, useSetAtom } from 'jotai';
import type { ImageFile } from '@/shared/types';
import { cn } from '@/shared/lib';
import {
  imageFilesAtom,
  addImageFilesAtom,
  clearAllImagesAtom,
  showAlertMessageAtom,
} from '@/shared/stores/atoms';

export const ImageUploader: React.FC = () => {
  const imageFiles = useAtomValue(imageFilesAtom);
  const addImageFiles = useSetAtom(addImageFilesAtom);
  const clearAllImages = useSetAtom(clearAllImagesAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: ImageFile[] = acceptedFiles
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({
        file,
        id: Math.random().toString(36).substring(7),
        name: file.name,
        preview: URL.createObjectURL(file),
        size: file.size,
      }));

    if (newFiles.length > 0) {
      addImageFiles(newFiles);
      showAlertMessage(`${newFiles.length}개의 이미지가 추가되었습니다.`, 'success');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.gif', '.tiff'] },
  });

  return (
    <div className={cn('space-y-3')}>
      <div
        {...getRootProps()}
        className={cn(
          'relative overflow-hidden',
          'rounded-2xl border border-dashed',
          'px-5 py-6 cursor-pointer',
          'transition-colors duration-200',
          isDragActive
            ? 'border-blue-500 bg-blue-50/40'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        )}
      >
        <input {...getInputProps()} />

        <div className={cn(
          'flex flex-col items-center gap-3',
          'text-center'
        )}>
          <div className={cn(
            'w-12 h-12 rounded-full border border-slate-300',
            'flex items-center justify-center text-slate-500'
          )}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className={cn('space-y-1')}>
            <p className={cn('text-sm font-semibold text-slate-900')}>
              {isDragActive ? '파일을 여기에 놓으세요' : '이미지 업로드'}
            </p>
            <p className={cn('text-xs text-slate-500')}>
              드래그 앤 드롭 또는 클릭으로 파일을 선택하세요
            </p>
          </div>
          <div className={cn('flex flex-wrap gap-2 justify-center text-[11px] text-slate-400')}>
            {['JPG', 'PNG', 'GIF', 'BMP', 'TIFF'].map((type) => (
              <span key={type} className={cn('rounded-full border border-slate-200 px-3 py-1')}>
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {imageFiles.length > 0 && (
        <button
          onClick={() => {
            clearAllImages();
            showAlertMessage('모든 파일이 제거되었습니다.', 'info');
          }}
          className={cn(
            'w-full rounded-xl border border-slate-300',
            'px-4 py-2.5 text-sm font-semibold text-slate-600',
            'hover:border-slate-400 hover:text-slate-900 transition-colors flex items-center justify-center gap-2'
          )}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M6 7h12m-9 4v6m6-6v6M9 7l1-2h4l1 2" />
          </svg>
          전체 삭제
        </button>
      )}
    </div>
  );
};
