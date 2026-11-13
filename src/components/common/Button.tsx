import React from 'react';
import { sound } from '../../core/audio';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'light' | 'dark' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'light',
  size = 'md',
  icon,
  onClick,
  className = '',
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      sound.playChirp();
      if (onClick) onClick(e);
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] py-1.5 px-2.5',
    md: 'text-xs py-2 px-3.5',
    lg: 'text-sm py-2.5 px-5',
  }[size];

  const variantClass = variant === 'dark' ? 'retro-btn-dark' : 'retro-btn';

  return (
    <button
      className={`${variantClass} ${sizeClasses} inline-flex items-center justify-center gap-1.5 font-bold transition-all ${className}`}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </button>
  );
};

