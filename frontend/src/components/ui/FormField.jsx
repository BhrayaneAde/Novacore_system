import React from 'react';
import { AlertCircle } from 'lucide-react';

const FormField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  options = [],
  className = '',
  disabled = false,
  ...props
}) => {
  const hasError = touched && error;
  
  const baseInputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors
    ${hasError 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
  `;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur && onBlur(name)}
            className={baseInputClasses}
            disabled={disabled}
            {...props}
          >
            <option value="">{placeholder || 'Sélectionner...'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur && onBlur(name)}
            placeholder={placeholder}
            className={`${baseInputClasses} resize-none`}
            disabled={disabled}
            rows={4}
            {...props}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value || false}
              onChange={(e) => onChange(name, e.target.checked)}
              onBlur={() => onBlur && onBlur(name)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              disabled={disabled}
              {...props}
            />
            {label && (
              <label className="ml-2 text-sm text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
          </div>
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            onBlur={() => onBlur && onBlur(name)}
            placeholder={placeholder}
            className={baseInputClasses}
            disabled={disabled}
            {...props}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <div className={`space-y-1 ${className}`}>
        {renderInput()}
        {hasError && (
          <div className="flex items-center gap-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {renderInput()}
      
      {hasError && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FormField;