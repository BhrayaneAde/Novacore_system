import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const getVariantStyles = (variant) => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(to right, #f59e0b, #055169)',
          color: 'white',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        };
      case 'secondary':
        return {
          backgroundColor: '#e0f2fe',
          color: '#055169',
          border: '1px solid #bae6fd'
        };
      case 'success':
        return {
          backgroundColor: '#059669',
          color: 'white'
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: 'white'
        };
      case 'outline':
        return {
          border: '2px solid #055169',
          color: '#055169',
          backgroundColor: 'transparent'
        };
      default:
        return {};
    }
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizes[size]} ${className}`}
      style={getVariantStyles(variant)}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
