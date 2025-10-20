import JSZip from 'jszip';

export interface DownloadOptions {
  dataURL: string;
  originalFileName: string;
  transformType:
    | 'transform'
    | 'rotation'
    | 'batch_transform'
    | 'batch_rotation';
  timestamp?: boolean;
}

const FILE_SUFFIX: Record<DownloadOptions['transformType'], string> = {
  transform: '_transformed',
  rotation: '_rotated',
  batch_transform: '_batch_transformed',
  batch_rotation: '_batch_rotated',
};

const convertPngToJpeg = async (pngDataUrl: string, quality = 0.92): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = pngDataUrl;
  });
};

const extractDataUrlMeta = (dataURL: string) => {
  const [header = '', payload = ''] = dataURL.split(',');
  const match = header.match(/^data:(image\/[a-zA-Z0-9+\.\-]+);base64$/i);
  const mimeType = match?.[1] ?? 'image/png';
  const rawExtension = mimeType.split('/')[1]?.toLowerCase() ?? 'png';
  const extension = rawExtension === 'jpeg' ? 'jpg' : rawExtension;

  return {
    mimeType,
    extension,
    base64Data: payload,
  };
};

export const downloadWithFolder = async ({
  dataURL,
  originalFileName,
  transformType,
  timestamp = true,
}: DownloadOptions) => {
  const baseName = originalFileName.split('.')[0];

  const now = new Date();
  const timeStr = timestamp
    ? `_${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
        .getHours()
        .toString()
        .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`
    : '';

  const folderName = `${baseName}_${transformType}${timeStr}`;

  let processedDataUrl = dataURL;
  if (dataURL.startsWith('data:image/png')) {
    processedDataUrl = await convertPngToJpeg(dataURL, 0.92);
  }

  const { mimeType, extension, base64Data } = extractDataUrlMeta(processedDataUrl);
  const suffix = FILE_SUFFIX[transformType] ?? '_processed';
  const fileName = `${baseName}${suffix}.${extension}`;

  try {
    const zip = new JSZip();

    const imageBlob = base64ToBlob(base64Data, mimeType);

    zip.file(`${folderName}/${fileName}`, imageBlob);

    const readmeContent = `이미지 변환 결과
    
원본 파일: ${originalFileName}
변환 타입: ${transformType}
생성 시간: ${now.toLocaleString('ko-KR')}
`;
    zip.file(`${folderName}/README.txt`, readmeContent);

    const content = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('폴더 다운로드 실패:', error);

    fallbackDownload(dataURL, fileName);
  }
};

const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const fallbackDownload = (dataURL: string, fileName: string) => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadMultipleWithFolder = async (
  downloads: Omit<DownloadOptions, 'transformType'>[],
  transformType: DownloadOptions['transformType']
) => {
  if (downloads.length === 0) return;

  const now = new Date();
  const timeStr = `${now.getFullYear()}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now
    .getHours()
    .toString()
    .padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  const folderName = `${timeStr}`;

  try {
    const zip = new JSZip();

    for (const download of downloads) {
      const baseName = download.originalFileName.split('.')[0];

      let processedDataUrl = download.dataURL;
      if (download.dataURL.startsWith('data:image/png')) {
        processedDataUrl = await convertPngToJpeg(download.dataURL, 0.92);
      }

      const { mimeType, extension, base64Data } = extractDataUrlMeta(processedDataUrl);
      const fileName = `${baseName}.${extension}`;

      const imageBlob = base64ToBlob(base64Data, mimeType);

      zip.file(`${folderName}/${fileName}`, imageBlob);
    }

    const batchInfo = `배치 이미지 변환 결과

처리된 파일 수: ${downloads.length}
변환 타입: ${transformType}
생성 시간: ${now.toLocaleString('ko-KR')}

처리된 파일 목록:
${downloads.map((d) => `- ${d.originalFileName}`).join('\n')}
`;

    zip.file(`${folderName}/BATCH_INFO.txt`, batchInfo);

    const content = await zip.generateAsync({ type: 'blob' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(content);
    link.download = `${folderName}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('배치 폴더 다운로드 실패:', error);

    downloads.forEach((download, index) => {
      setTimeout(() => {
        const baseName = download.originalFileName.split('.')[0];
        const { extension } = extractDataUrlMeta(download.dataURL);
        fallbackDownload(
          download.dataURL,
          `${baseName}_${transformType}_${index + 1}.${extension}`
        );
      }, index * 100);
    });
  }
};
