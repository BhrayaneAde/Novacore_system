import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  size = 'md',
  type = 'default', // 'default', 'confirmation', 'danger'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className={`relative p-4 w-full ${sizes[size]} max-h-full`}>
        <div className={`relative bg-white rounded-lg shadow-sm dark:bg-gray-700 ${className}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              {type === 'danger' && <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />}
              {title}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <X className="w-3 h-3" />
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          {/* Body */}
          <div className="p-4 md:p-5 space-y-4">
            {type === 'confirmation' ? (
              <div className="text-center">
                <AlertTriangle className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" />
                <div className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                  {children}
                </div>
              </div>
            ) : (
              children
            )}
          </div>

          {/* Footer */}
          {(type === 'confirmation' || onConfirm) && (
            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                onClick={onConfirm}
                className={`font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                  type === 'danger' 
                    ? 'text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800'
                    : 'text-white bg-secondary-700 hover:bg-secondary-800 focus:ring-4 focus:outline-none focus:ring-secondary-300 dark:bg-secondary-600 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800'
                }`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-secondary-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
              >
                {cancelText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;