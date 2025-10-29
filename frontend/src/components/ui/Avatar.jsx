import React from 'react';

const Avatar = ({ 
  name, 
  src, 
  size = 'md', 
  className = '',
  fallbackColor = 'blue',
  bordered = false
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl'
  };

  const colors = {
    blue: 'bg-secondary-100 text-secondary-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-primary-100 text-primary-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  const borderClasses = bordered ? 'p-1 ring-2 ring-gray-300 dark:ring-gray-500' : '';

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} ${borderClasses} rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div 
      className={`${sizes[size]} ${colors[fallbackColor]} ${borderClasses} rounded-full flex items-center justify-center font-medium ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;