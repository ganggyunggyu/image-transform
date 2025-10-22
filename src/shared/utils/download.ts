import JSZip from 'jszip';

export interface DownloadOptions {
  dataURL: string;
  originalFileName: string;
  transformType:
    | 'transform'
    | 'rotation'
    | 'batch_transform'
    | 'batch_rotation'
    | 'crop'
    | 'batch_crop';
  timestamp?: boolean;
}

const FILE_SUFFIX: Record<DownloadOptions['transformType'], string> = {
  transform: '_transformed',
  rotation: '_rotated',
  batch_transform: '_batch_transformed',
  batch_rotation: '_batch_rotated',
  crop: '_cropped',
  batch_crop: '_cropped',
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

  const { mimeType, extension, base64Data } = extractDataUrlMeta(dataURL);
  const suffix = FILE_SUFFIX[transformType] ?? '_processed';
  const fileName = `${baseName}${suffix}.${extension}`;

  try {
    const zip = new JSZip();

    const imageBlob = base64ToBlob(base64Data, mimeType);

    zip.file(`${folderName}/${fileName}`, imageBlob);

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

      const { mimeType, extension, base64Data } = extractDataUrlMeta(download.dataURL);
      const fileName = `${baseName}.${extension}`;

      const imageBlob = base64ToBlob(base64Data, mimeType);

      zip.file(`${folderName}/${fileName}`, imageBlob);
    }

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
