import React from 'react';
import { Button } from '@mui/material';
import { 
  KeyboardArrowLeft as LeftIcon,
  KeyboardArrowRight as RightIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
  TrendingUp as TiltLeftIcon,
  TrendingDown as TiltRightIcon,
  GraphicEq as WaveIcon,
  OpenInFull as ExpandIcon,
  CloseFullscreen as ContractIcon
} from '@mui/icons-material';

interface PresetTransformButtonsProps {
  onApplyPreset: (presetType: string) => void;
}

export const PresetTransformButtons: React.FC<PresetTransformButtonsProps> = ({
  onApplyPreset,
}) => {
  const mainPresets = [
    { value: 'perspective-left', label: '좌측 원근', icon: LeftIcon, color: '#3b82f6' },
    { value: 'perspective-right', label: '우측 원근', icon: RightIcon, color: '#10b981' },
    { value: 'perspective-top', label: '상단 원근', icon: UpIcon, color: '#f59e0b' },
    { value: 'perspective-bottom', label: '하단 원근', icon: DownIcon, color: '#ef4444' },
  ];

  const skewPresets = [
    { value: 'skew-left', label: '좌 기울기', icon: LeftIcon },
    { value: 'skew-right', label: '우 기울기', icon: RightIcon },
    { value: 'wave-horizontal', label: '수평 웨이브', icon: WaveIcon },
    { value: 'wave-vertical', label: '수직 웨이브', icon: WaveIcon },
    { value: 'tilt-left', label: '좌측 기울기', icon: TiltLeftIcon },
    { value: 'tilt-right', label: '우측 기울기', icon: TiltRightIcon },
  ];

  const scalePresets = [
    { value: 'expand', label: '확장', icon: ExpandIcon, color: '#8b5cf6' },
    { value: 'contract', label: '축소', icon: ContractIcon, color: '#06b6d4' },
  ];

  return (
    <>
      {/* 메인 원근 프리셋 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {mainPresets.map(({ value, label, icon: IconComponent, color }) => (
          <Button
            key={value}
            onClick={() => onApplyPreset(value)}
            variant="outlined"
            size="small"
            className="py-2 text-xs"
            sx={{
              flexDirection: 'column',
              height: '50px',
              borderColor: color,
              color: color,
              '&:hover': {
                backgroundColor: `${color}15`,
                borderColor: color,
              },
            }}
          >
            <IconComponent sx={{ fontSize: 16, mb: 0.5 }} />
            <span className="font-medium text-xs">{label}</span>
          </Button>
        ))}
      </div>

      {/* 기울기 프리셋 */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {skewPresets.map(({ value, label, icon: IconComponent }) => (
          <Button
            key={value}
            onClick={() => onApplyPreset(value)}
            variant="outlined"
            size="small"
            className="py-2 text-xs"
            sx={{
              flexDirection: 'column',
              height: '45px',
              fontSize: '10px',
            }}
          >
            <IconComponent sx={{ fontSize: 14, mb: 0.5 }} />
            <span className="font-medium">{label}</span>
          </Button>
        ))}
      </div>

      {/* 스케일 프리셋 */}
      <div className="grid grid-cols-2 gap-2">
        {scalePresets.map(({ value, label, icon: IconComponent, color }) => (
          <Button
            key={value}
            onClick={() => onApplyPreset(value)}
            variant="outlined"
            size="small"
            className="py-2 text-xs"
            sx={{
              flexDirection: 'column',
              height: '45px',
              borderColor: color,
              color: color,
              '&:hover': {
                backgroundColor: `${color}15`,
                borderColor: color,
              },
            }}
          >
            <IconComponent sx={{ fontSize: 16, mb: 0.5 }} />
            <span className="font-medium">{label}</span>
          </Button>
        ))}
      </div>
    </>
  );
};