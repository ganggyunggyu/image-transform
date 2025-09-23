import React from 'react';
import { Button, Typography } from '@mui/material';
import type { TransformMode } from '@/shared/types';

interface TransformModeSelectorProps {
  transformMode: TransformMode;
  onModeChange: (mode: TransformMode) => void;
}

export const TransformModeSelector: React.FC<TransformModeSelectorProps> = ({
  transformMode,
  onModeChange,
}) => {
  const modes = [
    { value: 'free', label: '자유', desc: '모든 모서리 독립적' },
    { value: 'perspective', label: '원근', desc: '대각선 모서리 연동' },
    { value: 'distort', label: '비틀기', desc: '인접 모서리 영향' },
    { value: 'skew', label: '기울이기', desc: '평행선 유지' },
  ];

  return (
    <div>
      <Typography variant="subtitle2" className="font-semibold mb-2 text-gray-700">
        수동 변형 모드
      </Typography>
      <div className="grid grid-cols-2 gap-2">
        {modes.map(({ value, label, desc }) => (
          <Button
            key={value}
            onClick={() => onModeChange(value as TransformMode)}
            variant={transformMode === value ? 'contained' : 'outlined'}
            size="small"
            className="py-2 text-xs"
            sx={{
              ...(transformMode === value && {
                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
              }),
              flexDirection: 'column',
              height: '60px',
            }}
          >
            <span className="font-semibold">{label}</span>
            <span className="text-xs opacity-70">{desc}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
