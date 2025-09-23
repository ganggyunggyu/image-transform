import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppBar, Toolbar, Button, Box, Stack, CssBaseline } from '@mui/material';
import { HomePage } from '@/pages/home';
import { ImageProcessorPage } from '@/pages/image-processor';
import { cn } from '@/shared/lib';

const AppShell: React.FC = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        className={cn('border-b border-slate-200 bg-white/80 backdrop-blur')}
      >
        <Toolbar className={cn('flex justify-between gap-6')}> 
          <Button
            component={RouterLink}
            to="/"
            color="inherit"
            className={cn('font-bold text-lg tracking-tight text-slate-900')}
          >
            Image Transform Studio
          </Button>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              component={RouterLink}
              to="/image-transform"
              color="inherit"
              className={cn('font-semibold text-slate-700 hover:text-indigo-600')}
            >
              이미지 변형
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/image-transform" element={<ImageProcessorPage />} />
        </Routes>
      </Box>
    </React.Fragment>
  );
};

const App: React.FC = () => {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    []
  );

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <BrowserRouter>
            <AppShell />
          </BrowserRouter>
        </JotaiProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
};

export default App;
