export interface ImageFile {
  file: File;
  id: string;
  name: string;
  preview: string;
  size: number;
}

export type Point = [number, number];

export interface TransformBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StageSize {
  width: number;
  height: number;
}

export type TabMode = 'transform' | 'split';
export type TransformMode = 'free' | 'perspective' | 'distort' | 'skew';
export type RotationMode = 'single' | 'multiple' | 'full';
export type BackgroundColor = 'transparent' | 'white' | 'black';
export type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

export type FrameShape = 'none' | 'rectangle' | 'circle' | 'rounded' | 'polaroid';

export interface FrameOptions {
  shape: FrameShape;
  padding: number;
  borderWidth: number;
  borderColor: string;
  borderOpacity: number;
  cornerRadius: number;
  shadowEnabled: boolean;
  shadowBlur: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
}

export type SplitDirection = 'horizontal' | 'vertical';

export interface SplitOptions {
  direction: SplitDirection;
  count: number;
}