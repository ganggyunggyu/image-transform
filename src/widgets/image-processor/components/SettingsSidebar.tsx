import React from 'react';
import {
  Typography,
  Button,
  IconButton,
  Slider,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowLeft as ArrowLeftIcon,
  KeyboardArrowRight as ArrowRightIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';
import { useAtom, useAtomValue } from 'jotai';
import type { TransformMode } from '@/shared/types';
import { cn } from '@/shared/lib';
import { useTransform } from '@/features/free-transform';
import {
  activeTabAtom,
  transformModeAtom,
  cornerPointsAtom,
  rotationAtom,
  flipHorizontalAtom,
  flipVerticalAtom,
} from '@/shared/stores/atoms';
import { PresetTransformButtons } from './PresetTransformButtons';
import { TransformModeSelector } from './TransformModeSelector';
import { CornerAdjustmentControls } from './CornerAdjustmentControls';

export const SettingsSidebar: React.FC = () => {
  const activeTab = useAtomValue(activeTabAtom);
  const [transformMode, setTransformMode] = useAtom(transformModeAtom);
  const cornerPoints = useAtomValue(cornerPointsAtom);
  const [rotation, setRotation] = useAtom(rotationAtom);
  const [flipHorizontal, setFlipHorizontal] = useAtom(flipHorizontalAtom);
  const [flipVertical, setFlipVertical] = useAtom(flipVerticalAtom);

  const {
    adjustHorizontal,
    adjustVertical,
    adjustCornerPrecise,
    resetAllAdjustments,
    applyPresetTransform,
  } = useTransform();

  const handleResetRotation = React.useCallback(() => {
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
  }, [setRotation, setFlipHorizontal, setFlipVertical]);
  return (
    <aside className={cn('w-80 min-w-80 bg-white border-l border-gray-200 flex flex-col shadow-sm overflow-hidden')}>
      <div className={cn('p-5 border-b bg-slate-50')}>
        <Typography variant="h6" className={cn('font-bold text-gray-800')}>
          {activeTab === 0 ? '자유 변형 설정' : '회전 설정'}
        </Typography>
      </div>

      <div className={cn('flex-1 p-5 overflow-y-auto space-y-5')}>
        {activeTab === 0 ? (
          <React.Fragment>
            <PresetTransformButtons onApplyPreset={applyPresetTransform} />

            <TransformModeSelector transformMode={transformMode} onModeChange={setTransformMode} />

            <div className={cn('space-y-3')}>
              <Typography variant="subtitle2" className={cn('font-semibold text-gray-700')}>
                전체 이동
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Stack spacing={1} alignItems="center">
                  <Typography variant="caption" className={cn('text-gray-500')}>상하</Typography>
                  <div className={cn('flex gap-1')}>
                    <IconButton size="small" onClick={() => adjustVertical('up', 2)}>
                      <ArrowUpIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => adjustVertical('down', 2)}>
                      <ArrowDownIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Stack>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="caption" className={cn('text-gray-500')}>좌우</Typography>
                  <div className={cn('flex gap-1')}>
                    <IconButton size="small" onClick={() => adjustHorizontal('left', 2)}>
                      <ArrowLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => adjustHorizontal('right', 2)}>
                      <ArrowRightIcon fontSize="small" />
                    </IconButton>
                  </div>
                </Stack>
              </Stack>
            </div>

            <CornerAdjustmentControls
              cornerPoints={cornerPoints}
              transformMode={transformMode}
              onAdjustCorner={adjustCornerPrecise}
            />

            <Button
              onClick={resetAllAdjustments}
              variant="outlined"
              size="large"
              startIcon={<RestartIcon />}
              className={cn('w-full rounded-xl')}
            >
              모서리 초기화
            </Button>

            <div className={cn('text-xs text-gray-500 p-3 bg-slate-50 rounded-lg leading-relaxed space-y-1')}>
              <p><strong>사용법</strong></p>
              <p>• 색상 원을 드래그하여 모서리를 조정</p>
              <p>• 사각형 핸들을 드래그하여 변(edge)을 조절</p>
              <p>• 상하/좌우 버튼으로 1px 단위 이동</p>
              <p>
                • 현재 모드:{' '}
                {transformMode === 'free' && '자유 변형'}
                {transformMode === 'perspective' && '원근 변형'}
                {transformMode === 'distort' && '비틀기 변형'}
                {transformMode === 'skew' && '기울이기'}
              </p>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div>
              <Typography variant="subtitle2" className={cn('font-semibold text-gray-700 mb-2')}>
                회전 각도 ({rotation}°)
              </Typography>
              <Slider
                value={rotation}
                onChange={(_, value) => {
                  if (typeof value === 'number') {
                    setRotation(value);
                  }
                }}
                min={-180}
                max={180}
                step={1}
                marks={[
                  { value: -180, label: '-180°' },
                  { value: 0, label: '0°' },
                  { value: 180, label: '180°' },
                ]}
              />
              <div className={cn('flex gap-2 mt-2 flex-wrap')}>
                {[0, 90, 180, -90].map((angle) => (
                  <Button
                    key={angle}
                    variant={rotation === angle ? 'contained' : 'outlined'}
                    onClick={() => setRotation(angle)}
                    size="small"
                    className={cn('rounded-lg min-w-[72px]')}
                  >
                    {angle}°
                  </Button>
                ))}
              </div>
            </div>

            <div className={cn('space-y-2')}>
              <Typography variant="subtitle2" className={cn('font-semibold text-gray-700')}>
                반전 설정
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={flipHorizontal}
                    onChange={(event) => setFlipHorizontal(event.target.checked)}
                    size="small"
                  />
                }
                label="좌우 반전"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={flipVertical}
                    onChange={(event) => setFlipVertical(event.target.checked)}
                    size="small"
                  />
                }
                label="상하 반전"
              />
            </div>

            <Button
              onClick={handleResetRotation}
              variant="outlined"
              startIcon={<RestartIcon />}
              className={cn('w-full rounded-xl')}
            >
              회전 설정 초기화
            </Button>
          </React.Fragment>
        )}
      </div>
    </aside>
  );
};
