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

export type TransformMode = 'free' | 'perspective' | 'distort' | 'skew';
export type RotationMode = 'single' | 'multiple' | 'full';
export type BackgroundColor = 'transparent' | 'white' | 'black';
export type AlertSeverity = 'success' | 'error' | 'info' | 'warning';