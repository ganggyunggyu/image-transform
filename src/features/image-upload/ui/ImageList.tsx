import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { formatFileSize } from '@/shared/utils';
import { cn } from '@/shared/lib';
import {
  imageFilesAtom,
  selectedImageAtom,
  selectImageAtom,
} from '@/shared/stores/atoms';

export const ImageList: React.FC = () => {
  const imageFiles = useAtomValue(imageFilesAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const selectImage = useSetAtom(selectImageAtom);

  return (
    <div className={cn('flex flex-col gap-2')}>
      {imageFiles.map((img, index) => (
        <button
          type="button"
          key={img.id}
          onClick={() => selectImage(img)}
          className={cn(
            'group relative text-left',
            'w-full rounded-lg border',
            'px-2 py-2 flex items-center gap-2',
            'transition-colors duration-200',
            selectedImage?.id === img.id
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn(
            'relative w-10 h-10 rounded overflow-hidden',
            'border border-slate-200 bg-slate-100'
          )}>
            <img
              src={img.preview}
              alt={img.name}
              className={cn('w-full h-full object-cover')}
            />
          </div>

          <div className={cn('flex-1 min-w-0')}>
            <h4 className={cn(
              'text-xs font-medium truncate',
              selectedImage?.id === img.id ? 'text-white' : 'text-slate-700'
            )}>
              {img.name}
            </h4>
            <p
              className={cn(
                'text-[11px]',
                selectedImage?.id === img.id ? 'text-slate-200' : 'text-slate-400'
              )}
            >
              {formatFileSize(img.size)}
            </p>
          </div>

          {selectedImage?.id === img.id && (
            <div className={cn('w-4 h-4 rounded-full flex items-center justify-center bg-white text-slate-900')}>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l3 3 7-7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
