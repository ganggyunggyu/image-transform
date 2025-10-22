import { atom } from 'jotai';
import type {
  ImageFile,
  AlertSeverity,
  StageSize,
  TransformMode,
  TransformBounds,
  Point,
  FrameOptions,
  TabMode,
  SplitOptions,
  CropOptions,
} from '../types';

// 이미지 관련 상태
export const imageFilesAtom = atom<ImageFile[]>([]);
export const selectedImageAtom = atom<ImageFile | null>(null);
export const isProcessingAtom = atom(false);
export const imageElementAtom = atom<HTMLImageElement | null>(null);

// UI 상태
export const tabModeAtom = atom<TabMode>('transform');
export const showAlertAtom = atom('');
export const alertSeverityAtom = atom<AlertSeverity>('info');

// 캔버스 상태
export const canvasScaleAtom = atom(0.75);
export const stageSizeAtom = atom<StageSize>({
  width: 800,
  height: 600,
});

// 변형 상태
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

export const frameOptionsAtom = atom<FrameOptions>({
  shape: 'none',
  padding: 0,
  borderWidth: 30,
  borderColor: '#ffffff',
  borderOpacity: 1,
  cornerRadius: 24,
  shadowEnabled: false,
  shadowBlur: 24,
  shadowColor: '#0f172a',
  shadowOpacity: 0.18,
  shadowOffsetX: 0,
  shadowOffsetY: 18,
});

export const splitOptionsAtom = atom<SplitOptions>({
  direction: 'vertical',
  count: 6,
});

export const cropOptionsAtom = atom<CropOptions>({
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
});

export const croppedImageAtom = atom<string | null>(null);

// 파생 상태 (computed atoms)
export const hasImagesAtom = atom((get) => get(imageFilesAtom).length > 0);
export const currentImageIndexAtom = atom((get) => {
  const images = get(imageFilesAtom);
  const selected = get(selectedImageAtom);
  return selected ? images.findIndex((img) => img.id === selected.id) : -1;
});
export const isImageLoadedAtom = atom((get) => !!get(imageElementAtom));

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
  set(imageElementAtom, null);
});

export const addImageFilesAtom = atom(
  null,
  (get, set, newFiles: ImageFile[]) => {
    const currentFiles = get(imageFilesAtom);
    set(imageFilesAtom, [...currentFiles, ...newFiles]);

    // 첫 번째 이미지가 없으면 새로 추가된 첫 번째 이미지를 선택
    const selected = get(selectedImageAtom);
    if (!selected && newFiles.length > 0) {
      set(selectedImageAtom, newFiles[0]);
      set(imageElementAtom, null);
    }
  }
);

export const selectImageAtom = atom(
  null,
  (_, set, imageFile: ImageFile | null) => {
    set(selectedImageAtom, imageFile);
    set(imageElementAtom, null);
  }
);

export const showAlertMessageAtom = atom(
  null,
  (_, set, message: string, severity: AlertSeverity = 'info') => {
    set(showAlertAtom, message);
    set(alertSeverityAtom, severity);

    // 3초 후 자동으로 알림 숨기기
    setTimeout(() => {
      set(showAlertAtom, '');
    }, 3000);
  }
);
