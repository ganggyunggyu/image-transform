import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { CropFree, ViewInAr, Transform, FormatShapes } from '@mui/icons-material';
import type { TransformMode } from '../../../shared/types';

interface Props {
  transformMode: TransformMode;
  onModeChange: (mode: TransformMode) => void;
}

export const TransformModeSelector: React.FC<Props> = ({
  transformMode,
  onModeChange
}) => {
  const modes = [
    { value: 'free', label: '자유 변형', icon: <CropFree />, desc: '모든 모서리 자유 조정' },
    { value: 'perspective', label: '원근 변형', icon: <ViewInAr />, desc: '원근감 효과' },
    { value: 'distort', label: '비틀기', icon: <Transform />, desc: '자유롭게 비틀기' },
    { value: 'skew', label: '기울이기', icon: <FormatShapes />, desc: '좌우로 기울이기' },
  ];

  return (
    <Box className="mb-6">
      <Typography variant="h6" className="font-bold mb-4 text-gray-800">
        변형 모드
      </Typography>
      
      <Box className="grid grid-cols-2 gap-3">
        {modes.map(({ value, label, icon, desc }) => (
          <Paper
            key={value}
            elevation={transformMode === value ? 4 : 1}
            className={`
              relative p-4 cursor-pointer transition-all duration-300 rounded-2xl
              ${transformMode === value 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 transform scale-[1.02]' 
                : 'bg-white hover:bg-gradient-to-br hover:from-gray-50 hover:to-slate-100 border border-gray-200 hover:border-blue-200 hover:shadow-md'
              }
            `}
            onClick={() => onModeChange(value as TransformMode)}
            sx={{
              '&:hover': {
                transform: transformMode === value ? 'scale(1.02)' : 'translateY(-2px)'
              }
            }}
          >
            <Box className="flex flex-col items-center text-center">
              <Box className={`mb-2 p-2 rounded-full ${
                transformMode === value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {React.cloneElement(icon, { fontSize: 'small' })}
              </Box>
              <Typography 
                variant="body2" 
                className={`font-semibold mb-1 ${transformMode === value ? 'text-blue-800' : 'text-gray-800'}`}
              >
                {label}
              </Typography>
              <Typography 
                variant="caption" 
                className={`${transformMode === value ? 'text-blue-600' : 'text-gray-500'}`}
              >
                {desc}
              </Typography>
            </Box>
            {transformMode === value && (
              <Box className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <Box className="w-2 h-2 bg-white rounded-full" />
              </Box>
            )}
          </Paper>
        ))}
      </Box>
    </Box>
  );
};