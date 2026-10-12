'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'ai';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex min-h-[44px] min-w-[44px] items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090A0F] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none touch-manipulation text-xs tracking-wide uppercase sm:min-h-0 sm:min-w-0';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-gray-900 shadow-sm hover:shadow-[0_0_15px_rgba(59,130,246,0.35)] focus:ring-blue-500 border border-blue-400/30',
      secondary:
        'bg-[#181B2C] hover:bg-[#20243B] text-gray-800 border border-white/10 hover:border-white/20 focus:ring-slate-400',
      outline:
        'bg-transparent hover:bg-white/[0.04] text-gray-800 border border-white/15 hover:border-white/30 focus:ring-white/20',
      ghost:
        'bg-transparent hover:bg-white/[0.06] text-gray-700 hover:text-gray-900 focus:ring-white/10',
      danger:
        'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 hover:border-rose-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] focus:ring-rose-500',
      success:
        'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] focus:ring-emerald-500',
      warning:
        'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 hover:border-amber-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] focus:ring-amber-500',
      ai:
        'bg-cyan-600/20 hover:bg-cyan-600/30 text-blue-500 border border-blue-500/40 hover:border-blue-500/60 shadow-sm hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:ring-cyan-500',
    };

    const sizes = {
      sm: 'h-7 px-2.5 text-[11px] gap-1.5',
      md: 'h-9 px-3.5 text-xs gap-2',
      lg: 'h-11 px-5 text-sm gap-2.5',
      icon: 'h-8 w-8 p-0',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-0.5 mr-1.5 h-3.5 w-3.5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
