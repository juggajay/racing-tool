'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'default',
  children,
  className = '',
  ...props
}) => {
  // Improved base styles with better touch targets and focus states for mobile
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 touch-manipulation';

  const variantStyles = {
    default: 'bg-indigo-900 text-white hover:bg-purple-900 active:bg-purple-950',
    outline: 'border border-white/20 bg-transparent hover:bg-white/10 active:bg-white/20',
    link: 'bg-transparent underline-offset-4 hover:underline text-indigo-400',
  };

  // Increased touch target sizes for mobile
  const sizeStyles = {
    default: 'min-h-[44px] px-4 py-2',
    sm: 'min-h-[36px] px-3 py-1 text-sm',
    lg: 'min-h-[50px] px-6 py-3 text-lg',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;