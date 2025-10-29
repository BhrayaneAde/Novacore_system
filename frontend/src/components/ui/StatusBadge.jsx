import React from 'react';

const StatusBadge = ({ 
  variant = 'gray', 
  children, 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    gray: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    red: 'bg-red-50 text-red-700 ring-red-600/10',
    yellow: 'bg-primary-50 text-primary-800 ring-primary-600/20',
    green: 'bg-green-50 text-green-700 ring-green-600/20',
    blue: 'bg-secondary-50 text-secondary-700 ring-secondary-700/10',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-700/10',
    purple: 'bg-purple-50 text-purple-700 ring-purple-700/10',
    pink: 'bg-pink-50 text-pink-700 ring-pink-700/10',
    // Status spécifiques
    active: 'bg-green-50 text-green-700 ring-green-600/20',
    inactive: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    pending: 'bg-primary-50 text-primary-800 ring-primary-600/20',
    success: 'bg-green-50 text-green-700 ring-green-600/20',
    warning: 'bg-primary-50 text-primary-800 ring-primary-600/20',
    error: 'bg-red-50 text-red-700 ring-red-600/10',
    info: 'bg-secondary-50 text-secondary-700 ring-secondary-700/10'
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-sm'
  };

  return (
    <span 
      className={`inline-flex items-center rounded-md font-medium ring-1 ring-inset ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusBadge;