import React from 'react';
import { Provider as JotaiProvider } from 'jotai';
import { BrowserRouter, Routes, Route, Link as RouterLink, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HomePage } from '@/pages/home';
import { ImageProcessorPage } from '@/pages/image-processor';
import { cn } from '@/shared/lib';

const AppShell: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <React.Fragment>
      {/* Navigation */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'border-b border-slate-200/80',
        'bg-white/90 backdrop-blur-md'
      )}>
        <nav className={cn(
          'mx-auto flex h-16 w-full max-w-7xl items-center',
          'px-4 sm:px-6 lg:px-8'
        )}>
          {/* Left Section */}
          <div className={cn('flex items-center flex-1')}>
            <RouterLink
              to="/"
              className={cn(
                'flex items-center gap-3',
                'text-gray-900 hover:text-black',
                'transition-colors duration-200'
              )}
            >
              <div className={cn(
                'flex items-center justify-center',
                'w-10 h-10 rounded-lg bg-black text-white',
                'text-sm font-bold'
              )}>
                IT
              </div>
              <span className={cn(
                'text-lg font-bold tracking-tight'
              )}>
                Image Transform
              </span>
            </RouterLink>
          </div>

          {/* Center Navigation */}
          <div className={cn(
            'hidden md:flex items-center justify-center'
          )}>
            <div className={cn(
              'flex items-center gap-8',
              'text-sm font-medium text-gray-600'
            )}>
              <RouterLink
                to="/"
                className={cn(
                  'px-3 py-2 rounded-md',
                  'hover:text-gray-900 hover:bg-gray-50',
                  'transition-all duration-200',
                  isHome && 'text-gray-900 bg-gray-100'
                )}
              >
                홈
              </RouterLink>
              <RouterLink
                to="/image-transform"
                className={cn(
                  'px-3 py-2 rounded-md',
                  'hover:text-gray-900 hover:bg-gray-50',
                  'transition-all duration-200',
                  location.pathname === '/image-transform' && 'text-gray-900 bg-gray-100'
                )}
              >
                스튜디오
              </RouterLink>
            </div>
          </div>

          {/* Right Section */}
          <div className={cn('flex items-center justify-end flex-1 gap-4')}>
            <RouterLink
              to="/image-transform"
              className={cn(
                'hidden sm:inline-flex items-center justify-center',
                'px-4 py-2 rounded-lg',
                'bg-black text-white text-sm font-semibold',
                'hover:bg-gray-800',
                'transition-colors duration-200'
              )}
            >
              시작하기
            </RouterLink>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                'md:hidden flex items-center justify-center',
                'w-10 h-10 rounded-lg border border-gray-200',
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                'transition-all duration-200'
              )}
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className={cn(
            'sm:hidden absolute top-full left-0 right-0 z-40',
            'bg-white border-t border-slate-200',
            'shadow-[0_16px_32px_-24px_rgba(15,23,42,0.35)]'
          )}>
            <div className={cn('py-4 px-4 space-y-2')}>
              <RouterLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block rounded-lg px-4 py-3',
                  'text-sm font-medium text-slate-600',
                  'transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900',
                  isHome && 'text-slate-900 bg-slate-50'
                )}
              >
                홈
              </RouterLink>
              <RouterLink
                to="/image-transform"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block rounded-lg px-4 py-3',
                  'text-sm font-medium text-slate-600',
                  'transition-colors duration-200 hover:bg-slate-50 hover:text-slate-900',
                  location.pathname === '/image-transform' && 'text-slate-900 bg-slate-50'
                )}
              >
                스튜디오
              </RouterLink>
              <RouterLink
                to="/image-transform"
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block w-full rounded-full px-4 py-3',
                  'text-sm font-semibold text-center',
                  'border border-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:text-blue-600'
                )}
              >
                지금 시작하기
              </RouterLink>
            </div>
          </div>
        )}
      </header>

      <div aria-hidden className={cn('h-16')} />

      {/* Main Content */}
      <main className={cn('min-h-screen bg-gray-50')}>
        <div className={cn('mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12')}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/image-transform" element={<ImageProcessorPage />} />
          </Routes>
        </div>
      </main>
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
