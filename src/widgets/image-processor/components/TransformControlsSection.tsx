import React from 'react';
import { useAtom } from 'jotai';
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Settings as SettingsIcon,
  KeyboardArrowLeft as LeftIcon,
  KeyboardArrowRight as RightIcon,
  TrendingUp as TiltLeftIcon,
  TrendingDown as TiltRightIcon,
  OpenInFull as ExpandIcon,
  CloseFullscreen as ContractIcon,
} from '@mui/icons-material';
import {
  activeTabAtom,
  rotationAtom,
  flipHorizontalAtom,
  flipVerticalAtom,
} from '../../../shared/stores/atoms';
import { useTransform } from '../../../features/free-transform';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box className="pt-4">{children}</Box>}
  </div>
);

export const TransformControlsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [rotation, setRotation] = useAtom(rotationAtom);
  const [flipHorizontal, setFlipHorizontal] = useAtom(flipHorizontalAtom);
  const [flipVertical, setFlipVertical] = useAtom(flipVerticalAtom);
  
  const {
    applyPresetTransform,
  } = useTransform({ width: 800, height: 600 });

  return (
    <div className="w-80 bg-white shadow-lg border-l flex flex-col h-full">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <SettingsIcon />
          변형 설정
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white border">
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                minHeight: 50,
                color: '#64748b',
                '&.Mui-selected': { color: '#3b82f6', fontWeight: 700 }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              }
            }}
          >
            <Tab label="자유 변형" />
            <Tab label="회전 변형" />
          </Tabs>
        </div>

        <div className="flex-1 p-2 flex flex-col">
          <TabPanel value={activeTab} index={0}>
            {/* 자유 변형 컨트롤들 */}
            <div className="space-y-4">
              {/* 모서리 조정 */}
              <div className="grid grid-cols-4 gap-2">
                {['좌상', '우상', '우하', '좌하'].map((label, idx) => (
                  <div key={idx} className="text-center">
                    <Typography variant="caption" className="text-gray-600 mb-1 block">
                      {label}
                    </Typography>
                    <div className="flex flex-col gap-1">
                      <Button
                        onClick={() => applyPresetTransform('expand')}
                        variant="outlined"
                        size="small"
                        className="min-w-0 p-1"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => applyPresetTransform('contract')}
                        variant="outlined"
                        size="small"
                        className="min-w-0 p-1"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 원터치 변형 프리셋 */}
              <div>
                <Typography variant="subtitle2" className="mb-2 font-semibold text-gray-700">
                  원터치 변형 프리셋
                </Typography>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { value: 'perspective-left', label: '좌측 원근', icon: LeftIcon, color: '#3b82f6' },
                    { value: 'perspective-right', label: '우측 원근', icon: RightIcon, color: '#10b981' },
                    { value: 'perspective-top', label: '상단 원근', icon: ArrowUpIcon, color: '#f59e0b' },
                    { value: 'perspective-bottom', label: '하단 원근', icon: ArrowDownIcon, color: '#ef4444' },
                  ].map(({ value, label, icon: IconComponent, color }) => (
                    <Button
                      key={value}
                      onClick={() => applyPresetTransform(value)}
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

                {/* 추가 변형 프리셋들 */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'skew-left', label: '좌측 기울기', icon: TiltLeftIcon, color: '#8b5cf6' },
                    { value: 'skew-right', label: '우측 기울기', icon: TiltRightIcon, color: '#06b6d4' },
                    { value: 'expand', label: '확장', icon: ExpandIcon, color: '#10b981' },
                    { value: 'contract', label: '축소', icon: ContractIcon, color: '#f97316' },
                  ].map(({ value, label, icon: IconComponent, color }) => (
                    <Button
                      key={value}
                      onClick={() => applyPresetTransform(value)}
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
              </div>
            </div>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {/* 회전 변형 컨트롤들 */}
            <div className="space-y-4">
              <div>
                <Typography variant="subtitle2" className="mb-2">
                  회전 ({rotation}°)
                </Typography>
                <Slider
                  value={rotation}
                  onChange={(_, value) => setRotation(value as number)}
                  min={-180}
                  max={180}
                  step={1}
                  marks={[
                    { value: -180, label: '-180°' },
                    { value: 0, label: '0°' },
                    { value: 180, label: '180°' },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <FormControlLabel
                  control={
                    <Switch
                      checked={flipHorizontal}
                      onChange={(e) => setFlipHorizontal(e.target.checked)}
                    />
                  }
                  label="좌우 뒤집기"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={flipVertical}
                      onChange={(e) => setFlipVertical(e.target.checked)}
                    />
                  }
                  label="상하 뒤집기"
                />
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    </div>
  );
};