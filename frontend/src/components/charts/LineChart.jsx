import React from 'react';

const LineChart = ({ data, title, color = 'blue' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="relative h-40">
        <svg className="w-full h-full" viewBox="0 0 400 160">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={`rgb(${color === 'blue' ? '59 130 246' : color === 'green' ? '34 197 94' : '168 85 247'})`} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={`rgb(${color === 'blue' ? '59 130 246' : color === 'green' ? '34 197 94' : '168 85 247'})`} stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#f3f4f6" strokeWidth="1"/>
          ))}
          
          {/* Line path */}
          <path
            d={`M ${data.map((item, index) => 
              `${(index / (data.length - 1)) * 380 + 10},${160 - ((item.value - minValue) / range) * 140 - 10}`
            ).join(' L ')}`}
            fill="none"
            stroke={`rgb(${color === 'blue' ? '59 130 246' : color === 'green' ? '34 197 94' : '168 85 247'})`}
            strokeWidth="3"
            className="transition-all duration-500"
          />
          
          {/* Area fill */}
          <path
            d={`M 10,150 L ${data.map((item, index) => 
              `${(index / (data.length - 1)) * 380 + 10},${160 - ((item.value - minValue) / range) * 140 - 10}`
            ).join(' L ')} L 390,150 Z`}
            fill={`url(#gradient-${color})`}
          />
          
          {/* Data points */}
          {data.map((item, index) => (
            <circle
              key={index}
              cx={(index / (data.length - 1)) * 380 + 10}
              cy={160 - ((item.value - minValue) / range) * 140 - 10}
              r="4"
              fill={`rgb(${color === 'blue' ? '59 130 246' : color === 'green' ? '34 197 94' : '168 85 247'})`}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index}>{item.label}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LineChart;