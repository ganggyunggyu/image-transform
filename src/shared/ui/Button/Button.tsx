import React from 'react';
import { cn } from '@/shared/lib';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'neon' | 'glass' | 'cyber' | 'ghost' | 'glitch';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  glow?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'neon',
  size = 'md',
  glow = false,
  pulse = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    xl: 'px-10 py-4 text-xl',
  };

  const variantClasses = {
    neon: cn(
      'relative overflow-hidden',
      'bg-gradient-to-r from-[var(--neon-purple)] via-[var(--neon-pink)] to-[var(--neon-purple)]',
      'text-white font-bold tracking-wide',
      'border-2 border-transparent',
      'before:absolute before:inset-0',
      'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
      'before:translate-x-[-200%] hover:before:translate-x-[200%]',
      'before:transition-transform before:duration-[600ms]',
      'transform transition-all duration-[var(--warp-smooth)]',
      'hover:scale-105 hover:shadow-[var(--glow-neon)]',
      'active:scale-95'
    ),
    glass: cn(
      'backdrop-blur-xl',
      'bg-[var(--glass-white-10)] hover:bg-[var(--glass-white-20)]',
      'border border-white/20 hover:border-white/40',
      'text-white font-semibold',
      'shadow-[var(--shadow-float)]',
      'transform transition-all duration-[var(--warp-smooth)]',
      'hover:translate-y-[-2px] hover:shadow-[var(--shadow-deep)]',
      'active:translate-y-[0px]'
    ),
    cyber: cn(
      'relative',
      'bg-[var(--space-dark)] text-[var(--neon-cyan)]',
      'border-2 border-[var(--neon-cyan)]/50',
      'font-mono font-bold uppercase tracking-widest',
      'clip-path-polygon-[0_0,calc(100%-8px)_0,100%_8px,100%_100%,8px_100%,0_calc(100%-8px)]',
      'before:absolute before:inset-[2px]',
      'before:bg-[var(--space-void)]',
      'before:clip-path-polygon-[0_0,calc(100%-6px)_0,100%_6px,100%_100%,6px_100%,0_calc(100%-6px)]',
      'after:absolute after:inset-0',
      'after:bg-gradient-to-br after:from-[var(--neon-cyan)]/20 after:to-transparent',
      'after:opacity-0 hover:after:opacity-100',
      'after:transition-opacity after:duration-[var(--warp-smooth)]',
      'transform transition-all duration-[var(--warp-smooth)]',
      'hover:text-white hover:shadow-[var(--glow-intense)]'
    ),
    ghost: cn(
      'relative overflow-hidden',
      'bg-transparent text-[var(--neon-purple)]',
      'border-2 border-[var(--neon-purple)]/30',
      'font-semibold',
      'before:absolute before:inset-0',
      'before:bg-[var(--neon-purple)]/10',
      'before:transform before:scale-x-0 before:origin-left',
      'hover:before:scale-x-100',
      'before:transition-transform before:duration-[var(--warp-smooth)]',
      'hover:border-[var(--neon-purple)] hover:text-white',
      'transition-all duration-[var(--warp-smooth)]'
    ),
    glitch: cn(
      'relative',
      'bg-[var(--ink-black)] text-[var(--neon-lime)]',
      'font-mono font-bold uppercase',
      'transition-all duration-[var(--warp-instant)]',
      'hover:animate-[glitch_var(--warp-smooth)_infinite]',
      '[animation-timing-function:var(--motion-glitch)]',
      'hover:text-[var(--neon-pink)]',
      'data-[text]:before:content-[attr(data-text)]',
      'before:absolute before:inset-0',
      'before:text-[var(--neon-cyan)] before:opacity-0',
      'hover:before:opacity-100 hover:before:animate-[glitch-2_var(--warp-quick)_infinite]',
      'after:absolute after:inset-0',
      'after:text-[var(--neon-orange)] after:opacity-0',
      'hover:after:opacity-100 hover:after:animate-[glitch-3_var(--warp-quick)_infinite]'
    ),
  };

  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-lg font-medium',
        'transition-all duration-[var(--warp-smooth)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--neon-purple)] focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
        sizeClasses[size],
        variantClasses[variant],
        glow && 'shadow-[var(--glow-soft)]',
        pulse && 'animate-pulse',
        className
      )}
      disabled={disabled}
      {...props}
    >
      <span className={cn('relative z-10')}>{children}</span>
    </button>
  );
};