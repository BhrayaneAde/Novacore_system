import React from 'react';

export const Select = ({ children, value, onValueChange, ...props }) => {
  return (
    <div className="relative">
      {React.cloneElement(children, { value, onValueChange, ...props })}
    </div>
  );
};

export const SelectTrigger = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const SelectValue = ({ placeholder, ...props }) => {
  return <span className="text-gray-900" {...props}>{placeholder}</span>;
};

export const SelectContent = ({ children, ...props }) => {
  return (
    <div className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg" {...props}>
      {children}
    </div>
  );
};

export const SelectItem = ({ children, value, ...props }) => {
  return (
    <div 
      className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
      data-value={value}
      {...props}
    >
      {children}
    </div>
  );
};