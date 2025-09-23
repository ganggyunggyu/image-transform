import React from 'react';
import { Typography, IconButton } from '@mui/material';
import { KeyboardArrowUp as ArrowUpIcon, KeyboardArrowDown as ArrowDownIcon } from '@mui/icons-material';
import type { Point, TransformMode } from '@/shared/types';

interface CornerAdjustmentControlsProps {
  cornerPoints: Point[];
  transformMode: TransformMode;
  onAdjustCorner: (corner: 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', axis: 'x' | 'y', delta: number) => void;
}

export const CornerAdjustmentControls: React.FC<CornerAdjustmentControlsProps> = ({
  cornerPoints,
  transformMode,
  onAdjustCorner,
}) => {
  const corners = [
    { label: '좌상', corner: 'topLeft', color: '#3b82f6', index: 0 },
    { label: '우상', corner: 'topRight', color: '#10b981', index: 1 },
    { label: '우하', corner: 'bottomRight', color: '#ef4444', index: 2 },
    { label: '좌하', corner: 'bottomLeft', color: '#f59e0b', index: 3 },
  ];

  return (
    <div className="space-y-3">
      <Typography variant="subtitle2" className="font-semibold text-gray-700">
        개별 모서리 조정
      </Typography>
      {corners.map(({ label, corner, color, index }) => {
        const point = cornerPoints[index];
        const isActive =
          transformMode === 'free' ||
          (transformMode === 'perspective' && (index === 0 || index === 2)) ||
          transformMode === 'distort' ||
          transformMode === 'skew';

        return (
          <div
            key={corner}
            className={`p-3 rounded-lg border-2 ${
              isActive ? 'border-opacity-30' : 'border-gray-200 opacity-50'
            }`}
            style={{ borderColor: isActive ? color : undefined }}
          >
            <div className="flex items-center justify-between mb-2">
              <Typography
                variant="caption"
                className="font-semibold"
                style={{ color }}
              >
                {label} ({Math.round(point[0])}, {Math.round(point[1])})
              </Typography>
            </div>

            {isActive && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Typography variant="caption" className="text-gray-600 text-xs">
                      X축
                    </Typography>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => onAdjustCorner(corner as 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', 'x', 1)}
                        sx={{ width: 18, height: 18, color }}
                      >
                        <ArrowUpIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onAdjustCorner(corner as 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', 'x', -1)}
                        sx={{ width: 18, height: 18, color }}
                      >
                        <ArrowDownIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Typography variant="caption" className="text-gray-600 text-xs">
                      Y축
                    </Typography>
                    <div className="flex gap-1">
                      <IconButton
                        size="small"
                        onClick={() => onAdjustCorner(corner as 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', 'y', -1)}
                        sx={{ width: 18, height: 18, color }}
                      >
                        <ArrowUpIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onAdjustCorner(corner as 'topLeft' | 'topRight' | 'bottomRight' | 'bottomLeft', 'y', 1)}
                        sx={{ width: 18, height: 18, color }}
                      >
                        <ArrowDownIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
