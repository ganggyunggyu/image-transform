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
    <div className={cn('flex flex-col gap-3')}>
      {imageFiles.map((img, index) => (
        <button
          type="button"
          key={img.id}
          onClick={() => selectImage(img)}
          className={cn(
            'group relative text-left',
            'w-full rounded-xl border',
            'px-4 py-3 flex items-center gap-3',
            'transition-colors duration-200',
            selectedImage?.id === img.id
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={cn(
            'relative w-12 h-12 rounded-lg overflow-hidden',
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
              'text-sm font-semibold truncate',
              selectedImage?.id === img.id ? 'text-white' : 'text-slate-900'
            )}>
              {img.name}
            </h4>
            <p className={cn(
              'text-xs',
              selectedImage?.id === img.id ? 'text-slate-200' : 'text-slate-400'
            )}>
              {formatFileSize(img.size)}
            </p>
          </div>

          <div className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center',
            selectedImage?.id === img.id
              ? 'bg-white text-slate-900'
              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600'
          )}>
            {selectedImage?.id === img.id ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l3 3 7-7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 20 20" stroke="currentColor">
                <circle cx="10" cy="10" r="7" strokeWidth={1.5} />
              </svg>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};
