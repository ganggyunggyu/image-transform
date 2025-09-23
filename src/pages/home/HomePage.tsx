import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import { PhotoSizeSelectLarge, Insights, Monitor } from '@mui/icons-material';
import { cn } from '@/shared/lib';

export const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <Box className={cn('min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-white')}>
        <Container className={cn('py-16')}>
          <Stack spacing={4} className={cn('max-w-3xl mx-auto text-center')}>
            <Chip
              label="이미지 변형 스튜디오"
              color="primary"
              variant="outlined"
              className={cn('self-center font-semibold tracking-wide')}
            />
            <Typography variant="h3" className={cn('font-bold text-slate-900 leading-tight')}>
              촬영 자료를 원근, 회전, 일괄 보정까지 한 번에 처리하세요
            </Typography>
            <Typography variant="body1" className={cn('text-slate-600')}>
              콘바 기반 캔버스에서 원근 조정과 회전, 대량 다운로드까지 지원합니다. 필요한 작업만 골라 빠르게 이미지를 다듬어보세요.
            </Typography>
            <Button
              component={RouterLink}
              to="/image-transform"
              variant="contained"
              size="large"
              startIcon={<PhotoSizeSelectLarge />}
              className={cn('font-semibold px-6 py-3 self-center')}
            >
              이미지 변형 시작하기
            </Button>
          </Stack>

          <Divider className={cn('my-16')} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className={cn('h-full border border-slate-200 shadow-sm transition-all hover:shadow-lg')}>
                <CardContent className={cn('space-y-4')}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Monitor className={cn('text-indigo-500')} />
                    <Typography variant="h6" className={cn('font-semibold text-slate-900')}>
                      캔버스 기반 정밀 편집
                    </Typography>
                  </Stack>
                  <Typography variant="body2" className={cn('text-slate-600 leading-relaxed')}>
                    변형 핸들을 자유롭게 움직이며 투시, 스큐, 비틀기 모드를 전환할 수 있습니다. 캔버스 확대·축소와 프리셋으로 반복 작업을 줄여보세요.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/image-transform"
                    variant="text"
                    endIcon={<Insights />}
                    className={cn('font-semibold self-start px-0')}
                  >
                    캔버스로 이동
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={cn('h-full border border-slate-200 shadow-sm transition-all hover:shadow-lg')}>
                <CardContent className={cn('space-y-4')}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <PhotoSizeSelectLarge className={cn('text-indigo-500')} />
                    <Typography variant="h6" className={cn('font-semibold text-slate-900')}>
                      이미지 변형 스튜디오
                    </Typography>
                  </Stack>
                  <Typography variant="body2" className={cn('text-slate-600 leading-relaxed')}>
                    투시 조정, 회전, 좌우 반전 등 세밀한 편집을 한 화면에서 제어합니다. 대량 이미지도 한 번에 처리할 수 있도록 설계했습니다.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/image-transform"
                    variant="text"
                    endIcon={<Insights />}
                    className={cn('font-semibold self-start px-0')}
                  >
                    워크플로우 살펴보기
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </React.Fragment>
  );
};
