import type { Point, TransformBounds } from '../types';

let cvReadyPromise: Promise<void> | null = null;

export const loadOpenCV = () => {
  if ((window as any).cv && (window as any).cv['ready'])
    return Promise.resolve();
  if (cvReadyPromise) return cvReadyPromise;

  cvReadyPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://docs.opencv.org/4.x/opencv.js';
    s.async = true;
    s.onload = () => {
      (window as any).cv = (window as any).cv || {};
      (window as any).cv['onRuntimeInitialized'] = () => resolve();
    };
    s.onerror = () => reject(new Error('OpenCV.js load failed'));
    document.body.appendChild(s);
  });

  return cvReadyPromise;
};

export const warpImagePerspective = async (opts: {
  imgEl: HTMLImageElement;
  srcSize: { w: number; h: number };
  dstStagePoints: Point[];
  stageTL: Point;
  stageScale: number;
  stageSize: TransformBounds;
}): Promise<string> => {
  await loadOpenCV();
  const cv = (window as any).cv as any;

  const { imgEl, srcSize, dstStagePoints, stageTL, stageSize } = opts;

  // Stage -> image-pixel 좌표 변환 (원본 해상도 기준)
  const toImgPx = (p: Point): Point => {
    const [sx, sy] = p;
    const [ox, oy] = stageTL;
    
    const stageWidth = stageSize.width;
    const stageHeight = stageSize.height;
    
    const relativeX = (sx - ox) / stageWidth;
    const relativeY = (sy - oy) / stageHeight;
    
    return [
      relativeX * srcSize.w,
      relativeY * srcSize.h
    ];
  };

  const dstImgPts = dstStagePoints.map(toImgPx) as Point[];
  const src = cv.imread(imgEl);

  const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    0, 0,
    srcSize.w, 0,
    srcSize.w, srcSize.h,
    0, srcSize.h,
  ]);

  // 출력 캔버스 크기 - 원본 크기 기준으로 충분히 크게 설정
  const xs = dstImgPts.map((p) => p[0]);
  const ys = dstImgPts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  const padding = Math.max(srcSize.w, srcSize.h) * 0.2;
  const outW = Math.max(srcSize.w, Math.ceil(maxX - minX + padding * 2));
  const outH = Math.max(srcSize.h, Math.ceil(maxY - minY + padding * 2));
  
  const adjustedDstPts = dstImgPts.map(([x, y]) => [
    x - minX + padding,
    y - minY + padding
  ]);
  
  const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
    adjustedDstPts[0][0], adjustedDstPts[0][1],
    adjustedDstPts[1][0], adjustedDstPts[1][1], 
    adjustedDstPts[2][0], adjustedDstPts[2][1],
    adjustedDstPts[3][0], adjustedDstPts[3][1],
  ]);

  const M = cv.getPerspectiveTransform(srcTri, dstTri);
  const dst = new cv.Mat();
  
  cv.warpPerspective(
    src,
    dst,
    M,
    new cv.Size(outW, outH),
    cv.INTER_LINEAR,
    cv.BORDER_CONSTANT,
    new cv.Scalar(0, 0, 0, 0)
  );

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  cv.imshow(canvas, dst);

  // 메모리 정리
  [src, dst, srcTri, dstTri, M].forEach(mat => mat.delete());

  return canvas.toDataURL('image/png');
};