import React from 'react';
import { Alert } from '@mui/material';
import useImage from 'use-image';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  selectedImageAtom,
  showAlertAtom,
  alertSeverityAtom,
  isImageLoadedAtom,
  stageSizeAtom,
  imageElementAtom,
} from '@/shared/stores/atoms';
import {
  FileSidebar,
  Workspace,
  SettingsSidebar,
} from './components';

const ImageProcessor: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const showAlert = useAtomValue(showAlertAtom);
  const alertSeverity = useAtomValue(alertSeverityAtom);
  const isImageLoaded = useAtomValue(isImageLoadedAtom);
  const stageSize = useAtomValue(stageSizeAtom);
  const [imageElement, setImageElement] = useAtom(imageElementAtom);

  const [loadedImage] = useImage(selectedImage?.preview ?? '', 'anonymous');

  // loadedImage를 imageElementAtom에 동기화
  React.useEffect(() => {
    if (loadedImage) {
      setImageElement(loadedImage);
    }
  }, [loadedImage, setImageElement]);

  const { resetTransform } = useTransform();



  React.useEffect(() => {
    if (imageElement && !isImageLoaded) {
      resetTransform(imageElement);
    }
  }, [imageElement, isImageLoaded, resetTransform]);

  React.useEffect(() => {
    if (imageElement && isImageLoaded) {
      resetTransform(imageElement);
    }
  }, [imageElement, isImageLoaded, resetTransform, stageSize]);

  return (
    <React.Fragment>
      {showAlert && (
        <Alert
          severity={alertSeverity}
          onClose={() => setShowAlert('')}
          className={cn('fixed left-1/2 top-6 z-50 -translate-x-1/2 w-[min(640px,90%)] shadow-lg')}
        >
          {showAlert}
        </Alert>
      )}

      <div className={cn('flex gap-4 p-4 bg-slate-100 min-h-[calc(100vh-64px)]')}>
        <FileSidebar />

        <Workspace />

        <SettingsSidebar />
      </div>
    </React.Fragment>
  );
};

export default ImageProcessor;
