import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
} from '@mui/material';
import { ImageProcessor } from '@/widgets/image-processor';
import { cn } from '@/shared/lib';

export const ImageProcessorPage: React.FC = () => {
  return (
    <React.Fragment>
      <Box className={cn('min-h-[calc(100vh-64px)] bg-slate-50')}>
        <Container className={cn('py-8')}>
          <Stack spacing={3}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link component={RouterLink} color="inherit" to="/" className={cn('font-semibold text-slate-600')}>
                홈
              </Link>
              <Typography color="text.primary" className={cn('font-semibold text-slate-900')}>
                이미지 변형
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4" className={cn('font-bold text-slate-900')}>
              이미지 변형 스튜디오
            </Typography>
            <Typography variant="body1" className={cn('text-slate-600 max-w-3xl')}>
              투시 변환, 회전, 반전 등을 한 화면에서 세밀하게 조작해보세요. 업로드한 이미지 자산을 일괄 변환할 수 있도록 구성했습니다.
            </Typography>
          </Stack>
        </Container>
        <Box className={cn('px-4 pb-12')}>
          <ImageProcessor />
        </Box>
      </Box>
    </React.Fragment>
  );
};
