import React from 'react';

const Skeleton = ({ 
  lines = 3, 
  className = '',
  width = 'full'
}) => {
  const widths = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
    '1/4': 'w-1/4'
  };

  const generateLine = (index) => {
    const lineWidths = ['w-32', 'w-24', 'w-full', 'w-full', 'w-80', 'w-full', 'w-32', 'w-24', 'w-full'];
    return lineWidths[index % lineWidths.length];
  };

  return (
    <div role="status" className={`space-y-2.5 animate-pulse max-w-lg ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="flex items-center w-full">
          <div className={`h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 ${generateLine(index * 3)}`} />
          <div className={`h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 ${generateLine(index * 3 + 1)}`} />
          <div className={`h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 ${generateLine(index * 3 + 2)}`} />
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Skeleton;