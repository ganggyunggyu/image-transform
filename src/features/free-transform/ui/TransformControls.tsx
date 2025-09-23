import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Slider,
  IconButton,
  Button,
  Chip,
  Paper
} from '@mui/material';
import {
  KeyboardArrowUp,
  KeyboardArrowDown,
  RestartAlt
} from '@mui/icons-material';
import type { TransformMode } from '@/shared/types';
import { cn } from '@/shared/lib';

interface Props {
  transformMode: TransformMode;
  topLeftY: number;
  topRightY: number;
  bottomLeftY: number;
  bottomRightY: number;
  setTopLeftY: (value: number) => void;
  setTopRightY: (value: number) => void;
  setBottomLeftY: (value: number) => void;
  setBottomRightY: (value: number) => void;
  adjustVertical: (
    corner: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight',
    direction: 'up' | 'down',
    amount?: number
  ) => void;
  onResetAll: () => void;
}

type CornerKey = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

interface CornerConfig {
  name: string;
  key: CornerKey;
  value: number;
  setter: (value: number) => void;
}

const getModeDescription = (mode: TransformMode): string => {
  const descriptions = {
    free: '모든 모서리를 자유롭게 드래그할 수 있습니다',
    perspective: '좌상, 우하 모서리만 드래그하여 원근감을 조정합니다',
    distort: '모든 모서리를 드래그하여 자유롭게 비틉니다 (강한 효과)',
    skew: '우상, 좌하 모서리만 좌우로 드래그하여 기울입니다',
  };
  return descriptions[mode];
};

export const TransformControls: React.FC<Props> = ({
  transformMode,
  topLeftY,
  topRightY,
  bottomLeftY,
  bottomRightY,
  setTopLeftY,
  setTopRightY,
  setBottomLeftY,
  setBottomRightY,
  adjustVertical,
  onResetAll,
}) => {
  const corners: CornerConfig[] = [
    { name: '좌상', key: 'topLeft', value: topLeftY, setter: setTopLeftY },
    { name: '우상', key: 'topRight', value: topRightY, setter: setTopRightY },
    { name: '좌하', key: 'bottomLeft', value: bottomLeftY, setter: setBottomLeftY },
    { name: '우하', key: 'bottomRight', value: bottomRightY, setter: setBottomRightY },
  ];

  const createPressHandler = (cornerKey: CornerKey, direction: 'up' | 'down') => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      adjustVertical(cornerKey, direction, 2);

      const interval = setInterval(() => {
        adjustVertical(cornerKey, direction, 1);
      }, 100);

      const handleMouseUp = () => {
        clearInterval(interval);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mouseup', handleMouseUp);
    };
  };

  return (
    <Card className={cn('shadow-lg border-0')}>
      <CardContent className={cn('p-0')}>
        <Box className={cn('px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b')}>
          <Typography variant="h6" className={cn('font-bold text-gray-800')}>
            모서리 조정
          </Typography>
          <Typography variant="body2" className={cn('text-gray-600 mt-1')}>
            {getModeDescription(transformMode)}
          </Typography>
        </Box>

        <Box className={cn('p-6 space-y-6')}>
          {corners.map(({ name, key, value, setter }) => (
            <Paper key={key} className={cn('p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-100')}>
              <Box className={cn('flex items-center justify-between mb-4')}>
                <Typography variant="body1" className={cn('font-semibold text-gray-800')}>
                  {name} 모서리
                </Typography>
                <Chip 
                  label={`${value > 0 ? '+' : ''}${value}px`} 
                  size="small" 
                  className={cn('bg-blue-100 text-blue-800 font-bold')}
                />
              </Box>

              <Box className={cn('flex items-center gap-3')}>
                <IconButton
                  size="small"
                  onClick={() => adjustVertical(key, 'up', 2)}
                  onMouseDown={createPressHandler(key, 'up')}
                  className={cn('bg-white shadow-md hover:shadow-lg transition-shadow')}
                  sx={{
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  <KeyboardArrowUp className={cn('text-blue-600')} />
                </IconButton>

                <Box className={cn('flex-1')}>
                  <Slider
                    value={value}
                    onChange={(_, newValue) => {
                      if (typeof newValue === 'number') {
                        setter(newValue);
                      }
                    }}
                    min={-100}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    className={cn('mx-2')}
                    sx={{
                      color: '#3b82f6',
                      height: 8,
                      '& .MuiSlider-thumb': {
                        backgroundColor: '#3b82f6',
                        width: 20,
                        height: 20,
                        '&:hover': {
                          boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.16)',
                        },
                      },
                      '& .MuiSlider-track': {
                        backgroundColor: '#3b82f6',
                        height: 8,
                        borderRadius: 4
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: '#e5e7eb',
                        height: 8,
                        borderRadius: 4
                      },
                      '& .MuiSlider-valueLabel': {
                        backgroundColor: '#3b82f6'
                      }
                    }}
                  />
                  <Box className={cn('flex justify-between text-xs text-gray-500 mt-1 px-2')}>
                    <span>-100</span>
                    <span>0</span>
                    <span>+100</span>
                  </Box>
                </Box>

                <IconButton
                  size="small"
                  onClick={() => adjustVertical(key, 'down', 2)}
                  onMouseDown={createPressHandler(key, 'down')}
                  className={cn('bg-white shadow-md hover:shadow-lg transition-shadow')}
                  sx={{
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: '#f9fafb',
                      borderColor: '#3b82f6'
                    }
                  }}
                >
                  <KeyboardArrowDown className={cn('text-blue-600')} />
                </IconButton>
              </Box>
            </Paper>
          ))}

          <Button
            onClick={onResetAll}
            variant="outlined"
            fullWidth
            startIcon={<RestartAlt />}
            className={cn('py-3 text-sm font-bold border-2 rounded-xl')}
            sx={{
              borderColor: '#d1d5db',
              color: '#374151',
              '&:hover': {
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                color: '#3b82f6',
                borderWidth: '2px'
              }
            }}
          >
            모든 설정 초기화
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
