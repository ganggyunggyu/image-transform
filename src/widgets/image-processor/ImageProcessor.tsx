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
  imageFilesAtom,
  hasImagesAtom,
  activeTabAtom,
  isProcessingAtom,
  showAlertMessageAtom,
} from '@/shared/stores/atoms';
import {
  FileSidebar,
  Workspace,
  SettingsSidebar,
} from './components';
import { downloadWithFolder } from '@/shared/utils/download';
import { warpImagePerspective } from '@/shared/utils';

const MobileImageProcessor: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const [showAlert, setShowAlert] = useAtom(showAlertAtom);
  const alertSeverity = useAtomValue(alertSeverityAtom);
  const hasImages = useAtomValue(hasImagesAtom);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const imageFiles = useAtomValue(imageFilesAtom);
  const imageElement = useAtomValue(imageElementAtom);
  const isProcessing = useAtomValue(isProcessingAtom);
  const showAlertMessage = useSetAtom(showAlertMessageAtom);

  const [showFileSidebar, setShowFileSidebar] = React.useState(false);
  const [showSettingsSidebar, setShowSettingsSidebar] = React.useState(false);

  const { getTransformedPoints } = useTransform();

  const handleDownload = async () => {
    if (!selectedImage || !imageElement) {
      showAlertMessage('이미지를 먼저 선택하세요', 'warning');
      return;
    }

    try {
      if (activeTab === 0) {
        // Transform mode
        const transformedPoints = getTransformedPoints().map(({ x, y }) => [x, y] as [number, number]);
        const dataUrl = await warpImagePerspective({
          imgEl: imageElement,
          srcSize: {
            w: imageElement.naturalWidth || imageElement.width,
            h: imageElement.naturalHeight || imageElement.height
          },
          dstStagePoints: transformedPoints,
          stageTL: [0, 0],
          stageSize: { x: 0, y: 0, width: 800, height: 600 },
          originalFile: selectedImage.file,
        });

        await downloadWithFolder({
          dataURL: dataUrl,
          originalFileName: selectedImage.name,
          transformType: 'transform',
          timestamp: true,
        });
      } else {
        // Rotation mode - implement rotation download
        showAlertMessage('회전 모드 다운로드는 준비 중입니다', 'info');
      }

      showAlertMessage('이미지를 다운로드했습니다', 'success');
    } catch (error) {
      console.error(error);
      showAlertMessage('다운로드 중 오류가 발생했습니다', 'error');
    }
  };

  return (
    <React.Fragment>
      {/* Alert Notification */}
      {showAlert && (
        <div className={cn(
          'fixed top-16 left-1/2 -translate-x-1/2 z-50',
          'w-[90%] max-w-sm',
          'rounded-2xl border px-4 py-3 shadow-[0_18px_48px_-24px_rgba(15,23,42,0.4)]',
          'bg-white text-slate-900',
          alertSeverity === 'success' && 'border-emerald-300',
          alertSeverity === 'error' && 'border-rose-300',
          alertSeverity === 'warning' && 'border-amber-300',
          alertSeverity === 'info' && 'border-blue-300'
        )}>
          <div className={cn('flex items-center justify-between gap-4')}>
            <span className={cn('text-sm font-semibold leading-snug')}>{showAlert}</span>
            <button
              onClick={() => setShowAlert('')}
              className={cn(
                'w-7 h-7 rounded-full border border-slate-200',
                'flex items-center justify-center text-slate-400 hover:text-slate-700'
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        'flex min-h-[560px] flex-col overflow-hidden',
        'rounded-3xl border border-slate-200 bg-white shadow-sm'
      )}> 
        {/* Mobile Tab Bar */}
        <div className={cn(
          'flex border-b border-slate-200/80 bg-white'
        )}>
          <button
            onClick={() => setActiveTab(0)}
            className={cn(
              'flex-1 py-3 text-center text-sm font-semibold transition-all duration-200',
              activeTab === 0
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-400 hover:-translate-y-0.5 hover:text-slate-600'
            )}
          >
            자유 변형
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={cn(
              'flex-1 py-3 text-center text-sm font-semibold transition-all duration-200',
              activeTab === 1
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-400 hover:-translate-y-0.5 hover:text-slate-600'
            )}
          >
            회전 변형
          </button>
        </div>

        {/* Mobile Workspace */}
        <div className={cn('flex-1 overflow-hidden')}>
          <Workspace />
        </div>

        {/* Mobile Bottom Navigation */}
          <div className={cn(
            'border-t border-slate-200/80 bg-slate-50/60',
            'px-4 py-3'
          )}>
          <div className={cn('grid grid-cols-3 gap-2 text-xs font-semibold text-slate-500')}>
            {/* Files Button */}
            <button
              onClick={() => setShowFileSidebar(true)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border border-transparent px-4 py-2.5 transition-all duration-200',
                'text-slate-500 hover:-translate-y-0.5 hover:text-slate-900 hover:border-slate-200'
              )}
            >
              <div className={cn('relative')}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {imageFiles.length > 0 && (
                  <span className={cn(
                    'absolute -top-1 -right-1',
                    'w-4 h-4 rounded-full',
                    'bg-blue-600 text-white',
                    'text-[10px] font-bold',
                    'flex items-center justify-center'
                  )}>
                    {imageFiles.length}
                  </span>
                )}
              </div>
              <span className={cn('text-xs')}>파일</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!hasImages || isProcessing}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border px-4 py-2.5 transition-all duration-200',
                hasImages && !isProcessing
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
              )}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className={cn('text-xs font-medium')}>
                {isProcessing ? '처리중...' : '다운로드'}
              </span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setShowSettingsSidebar(true)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border border-transparent px-4 py-2.5 transition-all duration-200',
                'text-slate-500 hover:-translate-y-0.5 hover:text-slate-900 hover:border-slate-200'
              )}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className={cn('text-xs')}>설정</span>
            </button>
          </div>
        </div>

        {/* Mobile File Sidebar Sheet */}
        {showFileSidebar && (
          <div
            className={cn(
              'fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]',
              'animate-fade-in'
            )}
            onClick={() => setShowFileSidebar(false)}
          >
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0',
                'max-h-[85vh] bg-white border-t border-slate-200',
                'rounded-t-3xl shadow-[0_-20px_40px_-24px_rgba(15,23,42,0.4)]',
                'animate-slide-up'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <div className={cn('p-2')}>
                <div className={cn('mx-auto h-1 w-12 rounded-full bg-slate-200')} />
              </div>

              {/* Header */}
              <div className={cn('flex items-center justify-between px-6 pb-4')}>
                <h3 className={cn('text-lg font-semibold text-slate-900')}>
                  이미지 파일
                </h3>
                <button
                  onClick={() => setShowFileSidebar(false)}
                  className={cn(
                    'w-8 h-8 rounded-full border border-slate-200',
                    'flex items-center justify-center text-slate-400 hover:text-slate-700'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={cn('max-h-[60vh] overflow-y-auto')}>
                <FileSidebar />
              </div>
            </div>
          </div>
        )}

        {/* Mobile Settings Sidebar Sheet */}
        {showSettingsSidebar && (
          <div
            className={cn(
              'fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-[2px]',
              'animate-fade-in'
            )}
            onClick={() => setShowSettingsSidebar(false)}
          >
            <div
              className={cn(
                'absolute bottom-0 left-0 right-0',
                'max-h-[85vh] bg-white border-t border-slate-200',
                'rounded-t-3xl shadow-[0_-20px_40px_-24px_rgba(15,23,42,0.4)]',
                'animate-slide-up'
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <div className={cn('p-2')}>
                <div className={cn('mx-auto h-1 w-12 rounded-full bg-slate-200')} />
              </div>

              {/* Header */}
              <div className={cn('flex items-center justify-between px-6 pb-4')}>
                <h3 className={cn('text-lg font-semibold text-slate-900')}>
                  변형 설정
                </h3>
                <button
                  onClick={() => setShowSettingsSidebar(false)}
                  className={cn(
                    'w-8 h-8 rounded-full border border-slate-200',
                    'flex items-center justify-center text-slate-400 hover:text-slate-700'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className={cn('max-h-[60vh] overflow-y-auto')}>
                <SettingsSidebar />
              </div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const DesktopImageProcessor: React.FC = () => {
  const selectedImage = useAtomValue(selectedImageAtom);
  const [showAlert, setShowAlert] = useAtom(showAlertAtom);
  const alertSeverity = useAtomValue(alertSeverityAtom);
  const stageSize = useAtomValue(stageSizeAtom);
  const [imageElement, setImageElement] = useAtom(imageElementAtom);

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

  return (
    <React.Fragment>
      {/* Toss-style Alert */}
      {showAlert && (
        <div className={cn(
          'fixed top-6 left-1/2 -translate-x-1/2 z-50',
          'rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.45)]',
          'bg-white text-slate-900 min-w-[320px]',
          alertSeverity === 'success' && 'border-emerald-300',
          alertSeverity === 'error' && 'border-rose-300',
          alertSeverity === 'warning' && 'border-amber-300',
          alertSeverity === 'info' && 'border-blue-300'
        )}>
          <div className={cn('flex items-center justify-between gap-4')}>
            <span className={cn('text-sm font-semibold leading-snug')}>{showAlert}</span>
            <button
              onClick={() => setShowAlert('')}
              className={cn(
                'w-7 h-7 rounded-full border border-slate-200',
                'flex items-center justify-center text-slate-400 hover:text-slate-700'
              )}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className={cn(
        'grid grid-cols-[248px_1fr_272px] w-full overflow-hidden',
        'min-h-[640px] rounded-3xl border border-slate-200 bg-white shadow-sm'
      )}>
        <aside className={cn('hidden h-full border-r border-slate-200/80 bg-white lg:flex')}>
          <FileSidebar />
        </aside>

        <div className={cn('flex flex-col bg-slate-50/60 overflow-hidden')}>
          <Workspace />
        </div>

        <aside className={cn('hidden h-full border-l border-slate-200/80 bg-white lg:flex')}>
          <SettingsSidebar />
        </aside>
      </div>
    </React.Fragment>
  );
};

const ImageProcessor: React.FC = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileImageProcessor /> : <DesktopImageProcessor />;
};

export default ImageProcessor;
