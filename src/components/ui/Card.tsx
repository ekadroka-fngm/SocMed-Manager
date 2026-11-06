import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  ...props
}) => {
  return (
    <div
      className={`rounded-[12px] border transition-colors ${
        elevated
          ? 'bg-white dark:bg-[#292E38] border-[#E7E9ED] dark:border-[#383F4C] shadow-sm'
          : 'bg-white dark:bg-[#1B1E25] border-[#E7E9ED] dark:border-[#292E38]'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, badge, className = '' }) => (
  <div className={`flex items-start justify-between gap-4 p-5 pb-3 border-b border-[#E7E9ED] dark:border-[#292E38] ${className}`}>
    <div>
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-base text-[#17191F] dark:text-[#E9EBF0] tracking-tight">{title}</h3>
        {badge}
      </div>
      {subtitle && <p className="text-xs text-[#68717E] dark:text-[#9BA3B2] mt-0.5">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);
