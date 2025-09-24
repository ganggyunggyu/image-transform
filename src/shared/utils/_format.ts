export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getImageMimeType = (file: File | string): string => {
  if (typeof file === 'string') {
    // 파일명에서 확장자 추출
    const ext = file.toLowerCase().split('.').pop();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      case 'bmp':
        return 'image/bmp';
      default:
        return 'image/png'; // 기본값
    }
  }
  return file.type || 'image/png';
};

export const getImageQuality = (mimeType: string): number => {
  // JPEG만 품질 설정 가능, 나머지는 무시됨
  return mimeType === 'image/jpeg' ? 0.9 : 1.0;
};