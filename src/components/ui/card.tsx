import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: 'blue' | 'emerald' | 'amber' | 'crimson' | 'cyan' | 'none';
}

export function Card({
  className,
  hoverEffect = false,
  glow = 'none',
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: '',
    blue: 'border-blue-500/30 shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]',
    emerald: 'border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]',
    amber: 'border-amber-500/30 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]',
    crimson: 'border-rose-500/30 shadow-[0_0_20px_-5px_rgba(239,68,68,0.2)]',
    cyan: 'border-blue-500/30 shadow-[0_0_20px_-5px_rgba(6,182,212,0.2)]',
  };

  return (
    <div
      className={cn(
        'bg-[#11131F] rounded-xl border border-white/[0.08] text-gray-900 relative overflow-hidden',
        hoverEffect &&
          'transition-all duration-200 hover:border-white/20 hover:bg-[#141726] hover:shadow-lg',
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 border-b border-white/[0.06]', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm font-semibold tracking-tight text-gray-900 flex items-center gap-2', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-xs text-gray-600 mt-1', className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0 border-t border-white/[0.06] mt-4', className)} {...props} />;
}
