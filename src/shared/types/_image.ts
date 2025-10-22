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

export type FrameShape =
  | 'none'
  | 'rectangle'
  | 'circle'
  | 'rounded'
  | 'polaroid'
  | 'line-thin-white' | 'line-medium-white' | 'line-thick-white' | 'line-extra-thick-white'
  | 'line-thin-black' | 'line-medium-black' | 'line-thick-black' | 'line-extra-thick-black'
  | 'vline-thin-white' | 'vline-medium-white' | 'vline-thick-white' | 'vline-extra-thick-white'
  | 'vline-thin-black' | 'vline-medium-black' | 'vline-thick-black' | 'vline-extra-thick-black';

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

export interface SplitOptions {
  horizontalCount: number;
  verticalCount: number;
}

export interface CropOptions {
  top: number;
  bottom: number;
  left: number;
  right: number;
}