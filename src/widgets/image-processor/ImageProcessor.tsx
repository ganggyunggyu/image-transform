import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import useImage from 'use-image';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  selectedImageAtom,
  showAlertAtom,
  alertSeverityAtom,
  stageSizeAtom,
  imageElementAtom,
  tabModeAtom,
  clearAllImagesAtom,
} from '@/shared/stores/atoms';
import { Workspace, SettingsSidebar } from './components';

const DesktopImageProcessor: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const [showAlert, setShowAlert] = useAtom(showAlertAtom);
  const alertSeverity = useAtomValue(alertSeverityAtom);
  const stageSize = useAtomValue(stageSizeAtom);
  const [imageElement, setImageElement] = useAtom(imageElementAtom);
  const tabMode = useAtomValue(tabModeAtom);
  const clearAllImages = useSetAtom(clearAllImagesAtom);

  const [loadedImage] = useImage(selectedImage?.preview ?? '', 'anonymous');

  const { resetTransform } = useTransform();

  React.useEffect(() => {
    if (loadedImage) {
      setImageElement(loadedImage);
    }
  }, [loadedImage, setImageElement]);

  React.useEffect(() => {
    if (imageElement) {
      resetTransform(imageElement);
    }
  }, [imageElement, resetTransform, stageSize]);

  React.useEffect(() => {
    clearAllImages();
  }, [tabMode, clearAllImages]);

  return (
    <React.Fragment>
      {showAlert && (
        <div
          className={cn(
            'fixed top-6 left-1/2 -translate-x-1/2 z-50',
            'rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.45)]',
            'bg-white text-slate-900 min-w-[320px]',
            alertSeverity === 'success' && 'border-emerald-300',
            alertSeverity === 'error' && 'border-rose-300',
            alertSeverity === 'warning' && 'border-amber-300',
            alertSeverity === 'info' && 'border-blue-300'
          )}
        >
          <div className={cn('flex items-center justify-between gap-4')}>
            <span className={cn('text-sm font-semibold leading-snug')}>
              {showAlert}
            </span>
            <button
              onClick={() => setShowAlert('')}
              className={cn(
                'w-7 h-7 rounded-full border border-slate-200',
                'flex items-center justify-center text-slate-400 hover:text-slate-700'
              )}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div
        className={cn(
          'grid w-full overflow-hidden relative',
          'grid-cols-1 lg:grid-cols-[1fr_272px]',
          'min-h-[640px] rounded-3xl border border-slate-200 bg-white shadow-sm'
        )}
      >
        <div className={cn('flex flex-col bg-slate-50/60 overflow-hidden')}>
          <Workspace />
        </div>

        <aside
          className={cn(
            'h-full border-t lg:border-t-0 lg:border-l border-slate-200/80 bg-white flex'
          )}
        >
          <SettingsSidebar />
        </aside>
      </div>
    </React.Fragment>
  );
};

const ImageProcessor: React.FC = () => {
  return <DesktopImageProcessor />;
};

export default ImageProcessor;
