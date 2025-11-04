import React from 'react';

export const Checkbox = ({ checked, onChange, className = '', ...props }) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${className}`}
      {...props}
    />
  );
};