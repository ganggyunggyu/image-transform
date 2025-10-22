import JSZip from 'jszip';
import type { ImageFile } from '../types';

interface SplitResult {
  imageFile: ImageFile;
  splitImages: string[];
}

export const downloadSplitImagesAsZip = async (
  results: SplitResult[]
): Promise<void> => {
  const zip = new JSZip();

  if (results.length === 1) {
    // 단일 이미지: 폴더 없이 평평하게 저장
    const { imageFile, splitImages } = results[0];
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');

    for (let i = 0; i < splitImages.length; i++) {
      const base64Data = splitImages[i].split(',')[1];
      const fileNumber = i + 1;
      const paddedNumber = String(fileNumber).padStart(String(splitImages.length).length, '0');
      zip.file(`${baseName}_${paddedNumber}.webp`, base64Data, { base64: true });
    }
  } else {
    // 여러 이미지: 각 이미지마다 폴더 생성
    for (const { imageFile, splitImages } of results) {
      const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
      const folder = zip.folder(baseName);

      if (folder) {
        for (let i = 0; i < splitImages.length; i++) {
          const base64Data = splitImages[i].split(',')[1];
          const fileNumber = i + 1;
          const paddedNumber = String(fileNumber).padStart(String(splitImages.length).length, '0');
          folder.file(`${baseName}_${paddedNumber}.webp`, base64Data, { base64: true });
        }
      }
    }
  }

  // ZIP 파일 생성 및 다운로드
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = results.length === 1
    ? `${results[0].imageFile.name.replace(/\.[^/.]+$/, '')}_split.zip`
    : 'split_images.zip';
  link.click();
  URL.revokeObjectURL(url);
};
