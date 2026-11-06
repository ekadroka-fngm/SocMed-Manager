import React from 'react';
import { ContentStatus, FunnelStage } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'status' | 'funnel' | 'outline' | 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
  status?: ContentStatus;
  funnel?: FunnelStage;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  status,
  funnel,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  if (status) {
    let statusStyle = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    if (status === 'APPROVED' || status === 'PUBLISHED') {
      statusStyle = 'bg-[#21A68A]/10 text-[#21A68A] border-[#21A68A]/30 dark:bg-[#21A68A]/20';
    } else if (status === 'SCHEDULED' || status === 'QUEUED') {
      statusStyle = 'bg-[#5268D8]/10 text-[#5268D8] border-[#5268D8]/30 dark:bg-[#5268D8]/20 dark:text-[#8292F0]';
    } else if (status === 'IN_REVIEW' || status === 'PUBLISHING') {
      statusStyle = 'bg-[#E4A44A]/10 text-[#B87A24] border-[#E4A44A]/30 dark:text-[#E4A44A] dark:bg-[#E4A44A]/20';
    } else if (status === 'CHANGES_REQUESTED' || status === 'FAILED' || status === 'CANCELLED') {
      statusStyle = 'bg-[#DC6470]/10 text-[#DC6470] border-[#DC6470]/30 dark:bg-[#DC6470]/20';
    }

    return (
      <span className={`inline-flex items-center font-mono font-medium rounded-full border ${sizeClasses} ${statusStyle} ${className}`}>
        {status.replace(/_/g, ' ')}
      </span>
    );
  }

  if (funnel) {
    const funnelColors: Record<FunnelStage, string> = {
      TOFU: 'bg-[#5268D8]/10 text-[#5268D8] border-[#5268D8]/30 dark:text-[#8292F0]',
      MOFU: 'bg-[#21A68A]/10 text-[#21A68A] border-[#21A68A]/30',
      BOFU: 'bg-[#E4A44A]/10 text-[#B87A24] border-[#E4A44A]/30 dark:text-[#E4A44A]'
    };
    return (
      <span className={`inline-flex items-center font-mono font-medium rounded-full border ${sizeClasses} ${funnelColors[funnel]} ${className}`}>
        {funnel}
      </span>
    );
  }

  const variants: Record<string, string> = {
    primary: 'bg-[#5268D8]/10 text-[#5268D8] border-[#5268D8]/30 dark:text-[#8292F0]',
    success: 'bg-[#21A68A]/10 text-[#21A68A] border-[#21A68A]/30',
    warning: 'bg-[#E4A44A]/10 text-[#B87A24] border-[#E4A44A]/30 dark:text-[#E4A44A]',
    danger: 'bg-[#DC6470]/10 text-[#DC6470] border-[#DC6470]/30',
    outline: 'border border-[#E7E9ED] text-[#68717E] dark:border-[#292E38] dark:text-[#9BA3B2]',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-[#292E38] dark:text-neutral-300 dark:border-neutral-700'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${sizeClasses} ${variants[variant] || variants.neutral} ${className}`}>
      {children}
    </span>
  );
};
