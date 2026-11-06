import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5268D8] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap shrink-0 cursor-pointer select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-[6px] gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-[8px] gap-2',
    lg: 'text-base px-5 py-2.5 rounded-[8px] gap-2.5'
  }[size];

  const variantClasses = {
    primary: 'bg-[#5268D8] hover:bg-[#4356b8] text-white shadow-xs active:scale-[0.98]',
    secondary: 'bg-white hover:bg-neutral-50 text-[#17191F] border border-[#E7E9ED] dark:bg-[#1B1E25] dark:hover:bg-[#292E38] dark:text-[#E9EBF0] dark:border-[#292E38] shadow-xs active:scale-[0.98]',
    outline: 'bg-transparent hover:bg-neutral-100 text-[#17191F] border border-[#E7E9ED] dark:hover:bg-[#1B1E25] dark:text-[#E9EBF0] dark:border-[#292E38]',
    ghost: 'bg-transparent hover:bg-neutral-100 text-[#68717E] hover:text-[#17191F] dark:hover:bg-[#1B1E25] dark:text-[#9BA3B2] dark:hover:text-[#E9EBF0]',
    danger: 'bg-[#DC6470] hover:bg-[#c5505c] text-white shadow-xs active:scale-[0.98]'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
