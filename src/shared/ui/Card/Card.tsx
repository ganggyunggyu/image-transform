import React from 'react';
import { cn } from '@/shared/lib';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'neon' | 'hologram' | 'metal';
  hover?: 'float' | 'tilt' | 'glow' | 'morph';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hover = 'float',
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    glass: cn(
      'backdrop-blur-2xl',
      'bg-gradient-to-br from-[var(--glass-white-10)] to-[var(--glass-white-5)]',
      'border border-white/10',
      'shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
    ),
    neon: cn(
      'relative',
      'bg-[var(--space-void)]',
      'border-2 border-transparent',
      'before:absolute before:inset-[-2px]',
      'before:bg-[var(--gradient-neon)]',
      'before:rounded-2xl before:-z-10',
      'before:blur-sm',
      'after:absolute after:inset-0',
      'after:bg-[var(--space-void)]',
      'after:rounded-2xl after:-z-10'
    ),
    hologram: cn(
      'relative overflow-hidden',
      'bg-gradient-to-br from-[var(--glass-purple-10)] to-[var(--glass-cyan-10)]',
      'border border-white/20',
      'before:absolute before:inset-0',
      'before:bg-[var(--gradient-holo)]',
      'before:opacity-30',
      'before:blur-3xl',
      'after:absolute after:top-0 after:left-[-100%]',
      'after:w-full after:h-full',
      'after:bg-gradient-to-r after:from-transparent after:via-white/10 after:to-transparent',
      'after:skew-x-12',
      'hover:after:left-[100%]',
      'after:transition-all after:duration-[var(--warp-drift)]'
    ),
    metal: cn(
      'relative',
      'bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300',
      'border border-gray-400/30',
      'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.5),inset_0_-1px_0_0_rgba(0,0,0,0.1)]',
      'before:absolute before:inset-0',
      'before:bg-[var(--metal-silver)]',
      'before:opacity-50 before:mix-blend-overlay',
      'before:rounded-2xl'
    ),
  };

  const hoverClasses = {
    float: cn(
      'transition-all duration-[var(--warp-float)]',
      'hover:translate-y-[-8px]',
      'hover:shadow-[var(--shadow-float)]'
    ),
    tilt: cn(
      'transition-all duration-[var(--warp-smooth)]',
      'hover:[transform:perspective(1000px)_rotateX(-10deg)_rotateY(10deg)_scale(1.02)]',
      'hover:shadow-[var(--shadow-deep)]'
    ),
    glow: cn(
      'transition-all duration-[var(--warp-smooth)]',
      'hover:shadow-[var(--glow-intense)]'
    ),
    morph: cn(
      'transition-all duration-[var(--warp-morph)]',
      'hover:rounded-[32px]',
      'hover:scale-105',
      '[transition-timing-function:var(--motion-elastic)]'
    ),
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl p-6',
        'transform-gpu will-change-transform',
        variantClasses[variant],
        hoverClasses[hover],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};