import { atom } from 'jotai';
import type {
  ImageFile,
  AlertSeverity,
  StageSize,
  TransformMode,
  TransformBounds,
  Point,
} from '../types';

// 이미지 관련 상태
export const imageFilesAtom = atom<ImageFile[]>([]);
export const selectedImageAtom = atom<ImageFile | null>(null);
export const isImageLoadedAtom = atom(false);
export const isProcessingAtom = atom(false);
export const imageElementAtom = atom<HTMLImageElement | null>(null);

// UI 상태
export const activeTabAtom = atom(0);
export const showAlertAtom = atom('');
export const alertSeverityAtom = atom<AlertSeverity>('info');

// 캔버스 상태
export const canvasScaleAtom = atom(1.0);
export const stageSizeAtom = atom<StageSize>({
  width: 800,
  height: 600,
});

// 변형 상태
export const rotationAtom = atom(0);
export const flipHorizontalAtom = atom(false);
export const flipVerticalAtom = atom(false);
export const transformModeAtom = atom<TransformMode>('free');
export const transformBoundsAtom = atom<TransformBounds>({
  x: 150,
  y: 150,
  width: 300,
  height: 200,
});
export const cornerPointsAtom = atom<Point[]>([
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
]);

// 파생 상태 (computed atoms)
export const hasImagesAtom = atom((get) => get(imageFilesAtom).length > 0);
export const currentImageIndexAtom = atom((get) => {
  const images = get(imageFilesAtom);
  const selected = get(selectedImageAtom);
  return selected ? images.findIndex(img => img.id === selected.id) : -1;
});

// 액션 atoms (functions)
export const clearAllImagesAtom = atom(null, (get, set) => {
  const currentFiles = get(imageFilesAtom);
  currentFiles.forEach((file) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
  });
  set(imageFilesAtom, []);
  set(selectedImageAtom, null);
  set(isImageLoadedAtom, false);
  set(imageElementAtom, null);
});

export const addImageFilesAtom = atom(null, (get, set, newFiles: ImageFile[]) => {
  const currentFiles = get(imageFilesAtom);
  set(imageFilesAtom, [...currentFiles, ...newFiles]);
  
  // 첫 번째 이미지가 없으면 새로 추가된 첫 번째 이미지를 선택
  const selected = get(selectedImageAtom);
  if (!selected && newFiles.length > 0) {
    set(selectedImageAtom, newFiles[0]);
    set(isImageLoadedAtom, false);
    set(imageElementAtom, null);
  }
});

export const selectImageAtom = atom(null, (_, set, imageFile: ImageFile | null) => {
  set(selectedImageAtom, imageFile);
  set(isImageLoadedAtom, false);
  // 변형 상태 초기화
  set(rotationAtom, 0);
  set(flipHorizontalAtom, false);
  set(flipVerticalAtom, false);
  set(imageElementAtom, null);
});

export const showAlertMessageAtom = atom(null, (_, set, message: string, severity: AlertSeverity = 'info') => {
  set(showAlertAtom, message);
  set(alertSeverityAtom, severity);
  
  // 3초 후 자동으로 알림 숨기기
  setTimeout(() => {
    set(showAlertAtom, '');
  }, 3000);
});
