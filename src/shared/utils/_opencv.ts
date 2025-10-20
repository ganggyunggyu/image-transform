import type { Point, TransformBounds } from '@/shared/types';

type OpenCVSize = unknown;
type OpenCVScalar = unknown;

interface OpenCVMat {
  delete: () => void;
}

interface OpenCV {
  ready?: boolean;
  onRuntimeInitialized?: () => void;
  imread: (
    element: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement
  ) => OpenCVMat;
  matFromArray: (
    rows: number,
    cols: number,
    type: number,
    data: number[]
  ) => OpenCVMat;
  getPerspectiveTransform: (src: OpenCVMat, dst: OpenCVMat) => OpenCVMat;
  Mat: new () => OpenCVMat;
  Size: new (width: number, height: number) => OpenCVSize;
  Scalar: new (...values: number[]) => OpenCVScalar;
  warpPerspective: (
    src: OpenCVMat,
    dst: OpenCVMat,
    transform: OpenCVMat,
    dsize: OpenCVSize,
    interpolation: number,
    borderMode: number,
    borderValue: OpenCVScalar
  ) => void;
  imshow: (canvas: HTMLCanvasElement | string, mat: OpenCVMat) => void;
  INTER_LINEAR: number;
  BORDER_CONSTANT: number;
  CV_32FC2: number;
}

declare global {
  interface Window {
    cv?: OpenCV;
  }
}

let cvReadyPromise: Promise<void> | null = null;

export const loadOpenCV = (): Promise<void> => {
  if (window.cv?.ready) {
    return Promise.resolve();
  }

  if (cvReadyPromise) {
    return cvReadyPromise;
  }

  cvReadyPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.onload = () => {
      const cvInstance = window.cv;
      if (!cvInstance) {
        reject(new Error('OpenCV.js global instance is unavailable'));
        return;
      }

      if (cvInstance.ready) {
        resolve();
        return;
      }

      cvInstance.onRuntimeInitialized = () => {
        cvInstance.ready = true;
        resolve();
      };
    };
    script.onerror = () => reject(new Error('OpenCV.js load failed'));
    document.body.appendChild(script);
  });

  return cvReadyPromise;
};

interface WarpImagePerspectiveOptions {
  imgEl: HTMLImageElement;
  srcSize: { w: number; h: number };
  dstStagePoints: Point[];
  stageTL: Point;
  stageSize: TransformBounds;
}

export const warpImagePerspective = async (
  opts: WarpImagePerspectiveOptions
): Promise<string> => {
  await loadOpenCV();

  const cvInstance = window.cv;
  if (!cvInstance) {
    throw new Error('OpenCV failed to initialise');
  }

  const { imgEl, srcSize, dstStagePoints, stageTL, stageSize } = opts;

  const toImgPx = (point: Point): Point => {
    const [sx, sy] = point;
    const [originX, originY] = stageTL;

    const relativeX = (sx - originX) / stageSize.width;
    const relativeY = (sy - originY) / stageSize.height;

    return [relativeX * srcSize.w, relativeY * srcSize.h];
  };

  const dstImgPoints = dstStagePoints.map(toImgPx) as Point[];
  const srcMat = cvInstance.imread(imgEl);

  const srcTriangle = cvInstance.matFromArray(4, 1, cvInstance.CV_32FC2, [
    0,
    0,
    srcSize.w,
    0,
    srcSize.w,
    srcSize.h,
    0,
    srcSize.h,
  ]);

  // 원본 이미지와 동일한 크기 유지
  const outWidth = srcSize.w;
  const outHeight = srcSize.h;

  // 변형 포인트는 그대로 사용
  const adjustedDstPoints = dstImgPoints;

  const dstTriangle = cvInstance.matFromArray(4, 1, cvInstance.CV_32FC2, [
    adjustedDstPoints[0][0],
    adjustedDstPoints[0][1],
    adjustedDstPoints[1][0],
    adjustedDstPoints[1][1],
    adjustedDstPoints[2][0],
    adjustedDstPoints[2][1],
    adjustedDstPoints[3][0],
    adjustedDstPoints[3][1],
  ]);

  const perspectiveMatrix = cvInstance.getPerspectiveTransform(
    srcTriangle,
    dstTriangle
  );
  const dstMat = new cvInstance.Mat();

  cvInstance.warpPerspective(
    srcMat,
    dstMat,
    perspectiveMatrix,
    new cvInstance.Size(outWidth, outHeight),
    cvInstance.INTER_LINEAR,
    cvInstance.BORDER_CONSTANT,
    new cvInstance.Scalar(255, 255, 255, 255)
  );

  const canvas = document.createElement('canvas');
  canvas.width = outWidth;
  canvas.height = outHeight;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  cvInstance.imshow(canvas, dstMat);

  [srcMat, dstMat, srcTriangle, dstTriangle, perspectiveMatrix].forEach((mat) =>
    mat.delete()
  );

  const mimeType = 'image/jpeg';
  const quality = 0.92;

  return canvas.toDataURL(mimeType, quality);
};

export {};
