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
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50';
  
  const variantStyles = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-white/20 bg-transparent hover:bg-white/10',
    link: 'bg-transparent underline-offset-4 hover:underline text-blue-500',
  };
  
  const sizeStyles = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 py-1 text-sm',
    lg: 'h-12 px-6 py-3 text-lg',
  };
  
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;