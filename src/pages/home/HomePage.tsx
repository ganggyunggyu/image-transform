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
import { AutoAwesome, PhotoSizeSelectLarge, Insights } from '@mui/icons-material';
import { cn } from '@/shared/lib';

export const HomePage: React.FC = () => {
  return (
    <React.Fragment>
      <Box className={cn('min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-white')}>
        <Container className={cn('py-16')}>
          <Stack spacing={4} className={cn('max-w-3xl mx-auto text-center')}>
            <Chip
              label="이미지 & 원고 자동화 플랫폼"
              color="primary"
              variant="outlined"
              className={cn('self-center font-semibold tracking-wide')}
            />
            <Typography variant="h3" className={cn('font-bold text-slate-900 leading-tight')}>
              콘텐츠 제작을 빠르게 정리하고 시각 자료를 한 번에 다듬어보세요
            </Typography>
            <Typography variant="body1" className={cn('text-slate-600')}> 
              AI 원고 생성과 이미지 변형 툴을 통합한 워크스페이스입니다. 필요한 기능을 선택해서 바로 편집을 시작하세요.
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={RouterLink}
                to="/content-generator"
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                className={cn('font-semibold px-6 py-3')}
              >
                AI 원고 생성 바로가기
              </Button>
              <Button
                component={RouterLink}
                to="/image-transform"
                variant="outlined"
                size="large"
                startIcon={<PhotoSizeSelectLarge />}
                className={cn('font-semibold px-6 py-3')}
              >
                이미지 변형 시작하기
              </Button>
            </Stack>
          </Stack>

          <Divider className={cn('my-16')} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card className={cn('h-full border border-slate-200 shadow-sm transition-all hover:shadow-lg')}>
                <CardContent className={cn('space-y-4')}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <AutoAwesome className={cn('text-indigo-500')} />
                    <Typography variant="h6" className={cn('font-semibold text-slate-900')}>
                      AI 원고 생성
                    </Typography>
                  </Stack>
                  <Typography variant="body2" className={cn('text-slate-600 leading-relaxed')}>
                    주제와 스타일만 정하면 구조화된 원고를 빠르게 받을 수 있습니다. 초안부터 마감 직전까지 필요한 정보를 자동으로 정리해줍니다.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/content-generator"
                    variant="text"
                    endIcon={<Insights />}
                    className={cn('font-semibold self-start px-0')}
                  >
                    기능 자세히 보기
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
                    기능 자세히 보기
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
