import React from 'react';
import { Typography } from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import { cn } from '@/shared/lib';
import { ImageUploader, ImageList } from '@/features/image-upload';

export const FileSidebar: React.FC = () => {
  return (
    <aside className={cn('w-80 min-w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm')}>
      <div className={cn('p-6 bg-blue-50 border-b flex items-center gap-2')}>
        <ImageIcon className={cn('text-blue-600')} />
        <Typography variant="h6" className={cn('font-bold text-gray-800')}>
          파일 관리
        </Typography>
      </div>
      <div className={cn('flex-1 p-6 overflow-y-auto flex flex-col gap-6')}>
        <ImageUploader />
        <ImageList />
      </div>
    </aside>
  );
};
