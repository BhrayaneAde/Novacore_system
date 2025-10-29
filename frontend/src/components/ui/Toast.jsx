import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ 
  type = 'info', 
  message, 
  duration = 5000, 
  onClose,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const types = {
    success: {
      icon: CheckCircle,
      classes: 'bg-green-50 text-green-800 border-green-200'
    },
    error: {
      icon: XCircle,
      classes: 'bg-red-50 text-red-800 border-red-200'
    },
    warning: {
      icon: AlertCircle,
      classes: 'bg-primary-50 text-primary-800 border-primary-200'
    },
    info: {
      icon: Info,
      classes: 'bg-secondary-50 text-secondary-800 border-secondary-200'
    }
  };

  const { icon: Icon, classes } = types[type];

  return (
    <div 
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`flex items-center gap-3 p-4 rounded-lg border shadow-lg max-w-sm ${classes} ${className}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-current hover:opacity-70"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;