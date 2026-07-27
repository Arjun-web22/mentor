import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'secondary' | 'primary';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 text-[#4CAF50] border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-[#FF9800] border-amber-200';
      case 'danger':
        return 'bg-red-50 text-[#F44336] border-red-200';
      case 'info':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'secondary':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-[#EBF1FA] text-[#5B82C5] border-[#5B82C5]/30';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-[11px]';
      case 'lg':
        return 'px-3 py-1 text-sm font-extrabold';
      default:
        return 'px-2.5 py-0.5 text-xs font-bold';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-lg border leading-tight ${getVariantStyles()} ${getSizeStyles()}`}>
      {children}
    </span>
  );
};
