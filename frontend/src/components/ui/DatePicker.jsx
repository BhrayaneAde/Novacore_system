import React from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import 'react-datepicker/dist/react-datepicker.css';

const DatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  className = '',
  disabled = false,
  dateFormat = "dd/MM/yyyy"
}) => {
  return (
    <div className={`relative max-w-sm ${className}`}>
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <ReactDatePicker
        selected={value}
        onChange={onChange}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        disabled={disabled}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-secondary-500 focus:border-secondary-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-secondary-500 dark:focus:border-secondary-500"
      />
    </div>
  );
};

export default DatePicker;