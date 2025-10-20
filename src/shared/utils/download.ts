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

  let fileName: string;
  switch (transformType) {
    case 'transform':
      fileName = `${baseName}_transformed.jpg`;
      break;
    case 'rotation':
      fileName = `${baseName}_rotated.jpg`;
      break;
    case 'batch_transform':
      fileName = `${baseName}_batch_transformed.jpg`;
      break;
    case 'batch_rotation':
      fileName = `${baseName}_batch_rotated.jpg`;
      break;
    default:
      fileName = `${baseName}_processed.jpg`;
  }

  try {
    const zip = new JSZip();

    const base64Data = dataURL.split(',')[1];
    const imageBlob = base64ToBlob(base64Data, 'image/jpeg');

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
      const fileName = `${baseName}.jpg`;

      const base64Data = download.dataURL.split(',')[1];
      const imageBlob = base64ToBlob(base64Data, 'image/jpeg');

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
        fallbackDownload(
          download.dataURL,
          `${baseName}_${transformType}_${index + 1}.jpg`
        );
      }, index * 100);
    });
  }
};
