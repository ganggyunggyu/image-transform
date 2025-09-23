import React, { useState } from 'react';
import { Provider } from 'jotai';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { ContentGenerator } from '@/widgets/content-generator';
import { ImageProcessor } from '@/widgets/image-processor';
import { cn } from '@/shared/lib';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={cn('w-full')}
      {...other}
    >
      {value === index && <Box className={cn('py-6')}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(1);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Provider>
      <Box className={cn('min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100')}>
        <Container
          maxWidth={false}
          className={cn('py-6 px-8 w-screen max-w-screen mx-auto')}
        >
          <Paper
            elevation={3}
            className={cn('rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border border-white/20')}
          >
            <Box className={cn('border-b border-gray-100')}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                className={cn('px-6')}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    minHeight: 64,
                    color: '#64748b',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      color: '#3b82f6',
                      backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    },
                    '&.Mui-selected': {
                      color: '#3b82f6',
                      fontWeight: 700,
                    },
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '2px 2px 0 0',
                    background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  },
                }}
              >
                <Tab
                  label="AI 원고 생성"
                  id="tab-0"
                  aria-controls="tabpanel-0"
                  className={cn('px-8')}
                />
                <Tab
                  label="이미지 변형"
                  id="tab-1"
                  aria-controls="tabpanel-1"
                  className={cn('px-8')}
                />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <ContentGenerator />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ImageProcessor />
            </TabPanel>
          </Paper>
        </Container>
      </Box>
    </Provider>
  );
}

export default App;
