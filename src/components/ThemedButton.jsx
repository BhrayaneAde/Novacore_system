import React from 'react';
import { useThemeStore } from '../store/useThemeStore';

const ThemedButton = ({ children, variant = 'primary', className = '', ...props }) => {
  const { primaryColor, secondaryColor } = useThemeStore();
  
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
        };
      case 'secondary':
        return {
          backgroundColor: secondaryColor,
          borderColor: secondaryColor,
        };
      default:
        return {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
        };
    }
  };

  return (
    <button
      style={getButtonStyle()}
      className={`text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ThemedButton;