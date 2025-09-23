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
import { ContentGenerator } from '@/widgets/content-generator';
import { cn } from '@/shared/lib';

export const ContentGeneratorPage: React.FC = () => {
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
                AI 원고 생성
              </Typography>
            </Breadcrumbs>
            <Typography variant="h4" className={cn('font-bold text-slate-900')}>
              AI 원고 생성 스튜디오
            </Typography>
            <Typography variant="body1" className={cn('text-slate-600 max-w-3xl')}>
              목표, 타깃, 톤을 입력하고 단계별로 원고를 완성해보세요. 생성된 결과는 실시간으로 편집하고 저장할 수 있습니다.
            </Typography>
          </Stack>
        </Container>
        <Box className={cn('px-4 pb-12')}>
          <ContentGenerator />
        </Box>
      </Box>
    </React.Fragment>
  );
};
