/**
 * 디자인 토큰 시스템 - Toss 스타일 디자인 시스템
 * 일관된 UI/UX를 위한 중앙화된 디자인 토큰
 */

export const theme = {
  colors: {
    // Primary Colors - Modern Purple/Violet Gradient
    primary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',  // Main primary
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Gray Scale - Toss style neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic Colors
    success: {
      light: '#d1fae5',
      DEFAULT: '#10b981',
      dark: '#065f46',
    },
    warning: {
      light: '#fed7aa',
      DEFAULT: '#f59e0b',
      dark: '#92400e',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#ef4444',
      dark: '#991b1b',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#1e40af',
    },

    // Background Colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      elevated: '#ffffff',
    },

    // Text Colors
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      tertiary: '#9ca3af',
      disabled: '#d1d5db',
      inverse: '#ffffff',
    },

    // Border Colors
    border: {
      light: '#e5e7eb',
      DEFAULT: '#d1d5db',
      dark: '#9ca3af',
    },
  },

  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px',
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    none: 'none',

    // Toss style elevation shadows
    elevation: {
      1: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
      2: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)',
      3: '0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)',
      4: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',
      5: '0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22)',
    },
  },

  animation: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },

    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

      // Toss style spring animations
      spring: {
        gentle: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        wobbly: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
        stiff: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
    },
  },

  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    overlay: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    notification: 1080,
  },
} as const;

export type Theme = typeof theme;

// 다크 모드 색상 (향후 구현용)
export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    background: {
      primary: '#0f0f0f',
      secondary: '#1a1a1a',
      tertiary: '#262626',
      elevated: '#1f1f1f',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a3a3a3',
      tertiary: '#737373',
      disabled: '#525252',
      inverse: '#0f0f0f',
    },
    border: {
      light: '#262626',
      DEFAULT: '#404040',
      dark: '#525252',
    },
  },
};

// CSS 변수로 내보내기 위한 유틸리티
export const getCSSVariables = (selectedTheme: typeof theme = theme) => {
  const cssVars: Record<string, string> = {};

  // Colors
  Object.entries(selectedTheme.colors).forEach(([category, values]) => {
    if (typeof values === 'object') {
      Object.entries(values).forEach(([key, value]) => {
        cssVars[`--color-${category}-${key}`] = value as string;
      });
    }
  });

  // Spacing
  Object.entries(selectedTheme.spacing).forEach(([key, value]) => {
    cssVars[`--spacing-${key}`] = value;
  });

  // Border Radius
  Object.entries(selectedTheme.borderRadius).forEach(([key, value]) => {
    cssVars[`--radius-${key}`] = value;
  });

  return cssVars;
};