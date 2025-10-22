import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { splitOptionsAtom, selectedImageAtom, imageFilesAtom, showAlertMessageAtom } from '@/shared/stores/atoms';
import { cn } from '@/shared/lib';
import { splitImage } from '@/shared/utils/split';
import { downloadSplitImagesAsZip } from '@/shared/utils/zipDownload';

export const SplitSettingsSidebar: React.FC = () => {
  const [splitOptions, setSplitOptions] = useAtom(splitOptionsAtom);
  const selectedImage = useAtomValue(selectedImageAtom);
  const imageFiles = useAtomValue(imageFilesAtom);
  const showAlert = useSetAtom(showAlertMessageAtom);

  const handleHorizontalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setSplitOptions({ ...splitOptions, horizontalCount: value });
    }
  };

  const handleVerticalCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 20) {
      setSplitOptions({ ...splitOptions, verticalCount: value });
    }
  };

  const handleSplitImage = async () => {
    if (!selectedImage) {
      showAlert('이미지를 선택해주세요', 'warning');
      return;
    }

    try {
      const splitImages = await splitImage(selectedImage, splitOptions);
      await downloadSplitImagesAsZip([{ imageFile: selectedImage, splitImages }]);
      showAlert(`${splitImages.length}개의 이미지로 분할되었습니다`, 'success');
    } catch (error) {
      console.error('Split error:', error);
      showAlert('이미지 분할 중 오류가 발생했습니다', 'error');
    }
  };

  const handleSplitAll = async () => {
    if (imageFiles.length === 0) {
      showAlert('이미지를 업로드해주세요', 'warning');
      return;
    }

    try {
      const results = [];
      for (const imageFile of imageFiles) {
        const splitImages = await splitImage(imageFile, splitOptions);
        results.push({ imageFile, splitImages });
      }

      const totalCount = results.reduce((sum, r) => sum + r.splitImages.length, 0);
      await downloadSplitImagesAsZip(results);
      showAlert(`총 ${totalCount}개의 이미지로 분할되었습니다`, 'success');
    } catch (error) {
      console.error('Split all error:', error);
      showAlert('일괄 분할 중 오류가 발생했습니다', 'error');
    }
  };

  return (
    <aside className={cn('flex h-full w-full flex-col gap-6 px-6 py-5')}>
      {/* 좌우 분할 개수 */}
      <div className={cn('flex flex-col gap-3')}>
        <label className={cn('text-xs font-medium text-slate-700')}>좌우 분할 개수</label>
        <input
          type="text"
          value={splitOptions.verticalCount}
          onChange={handleVerticalCountChange}
          className={cn(
            'w-full rounded-lg border border-slate-200 px-3 py-2',
            'text-sm text-slate-900',
            'focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100',
            'transition-all'
          )}
          placeholder="1-20"
        />
        <p className={cn('text-xs text-slate-500')}>1~20개까지 설정 가능</p>
      </div>

      {/* 상하 분할 개수 */}
      <div className={cn('flex flex-col gap-3')}>
        <label className={cn('text-xs font-medium text-slate-700')}>상하 분할 개수</label>
        <input
          type="text"
          value={splitOptions.horizontalCount}
          onChange={handleHorizontalCountChange}
          className={cn(
            'w-full rounded-lg border border-slate-200 px-3 py-2',
            'text-sm text-slate-900',
            'focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100',
            'transition-all'
          )}
          placeholder="1-20"
        />
        <p className={cn('text-xs text-slate-500')}>1~20개까지 설정 가능</p>
      </div>

      {/* 실행 버튼 */}
      <div className={cn('mt-auto flex flex-col gap-2')}>
        <button
          onClick={handleSplitImage}
          disabled={!selectedImage}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-sm font-medium',
            'bg-slate-900 text-white shadow-sm',
            'transition-all duration-200',
            'hover:bg-slate-800 hover:shadow-md active:scale-95',
            'disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed'
          )}
        >
          선택한 이미지 분할
        </button>
        <button
          onClick={handleSplitAll}
          disabled={imageFiles.length === 0}
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-sm font-medium',
            'bg-white text-slate-900 border border-slate-200',
            'transition-all duration-200',
            'hover:bg-slate-50 hover:shadow-sm active:scale-95 active:bg-slate-100',
            'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed'
          )}
        >
          전체 이미지 분할
        </button>
      </div>
    </aside>
  );
};
