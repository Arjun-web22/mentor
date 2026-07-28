import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'primary',
  onClick,
}) => {
  const getBadgeColors = () => {
    switch (colorScheme) {
      case 'success':
        return 'bg-emerald-50 text-[#4CAF50] border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-[#FF9800] border-amber-200';
      case 'danger':
        return 'bg-red-50 text-[#F44336] border-red-200';
      case 'info':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-[#EBF1FA] text-[#5B82C5] border-[#5B82C5]/30';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all duration-150 min-h-[44px] flex flex-col justify-center ${
        onClick ? 'cursor-pointer hover:border-[#5B82C5]' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl border ${getBadgeColors()} min-h-[44px] min-w-[44px] flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-black text-gray-900 tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
              trend.isPositive
                ? 'bg-emerald-100 text-emerald-800'
                : trend.isNegative
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-gray-500 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
};
