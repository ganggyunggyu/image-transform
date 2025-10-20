import React from 'react';
import { ImageProcessor } from '@/widgets/image-processor';
import { cn } from '@/shared/lib';

export const ImageProcessorPage: React.FC = () => {
  return (
    <div className={cn('flex flex-col gap-6 lg:gap-8')}>
      <ImageProcessor />
    </div>
  );
};
