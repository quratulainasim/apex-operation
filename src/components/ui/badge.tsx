import * as React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ai' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  size = 'md',
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    'inline-flex items-center font-mono font-medium rounded-md tracking-wider uppercase select-none transition-colors';

  const variants = {
    default: 'bg-[#EFE9E3] text-[#5A4A42] border border-[#D9CFC7]',
    primary: 'bg-[#C9B59C]/20 text-[#7A604C] border border-[#C9B59C]/60',
    success: 'bg-[#8B9D83]/15 text-[#66795F] border border-[#8B9D83]/40',
    warning: 'bg-[#D4A574]/15 text-[#8A6642] border border-[#D4A574]/40',
    danger: 'bg-[#C97B7B]/15 text-[#965B5B] border border-[#C97B7B]/40',
    ai: 'bg-[#A0B4B7]/20 text-[#647C80] border border-[#A0B4B7]/50',
    neutral: 'bg-[#F9F8F6] text-[#7A6A62] border border-[#D9CFC7]',
    outline: 'bg-transparent text-[#5A4A42] border border-[#C9B59C]/60',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2 py-0.5 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
