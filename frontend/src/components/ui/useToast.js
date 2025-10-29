import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success',
    message: ''
  });

  const showToast = (type, message) => {
    setToast({
      isVisible: true,
      type,
      message
    });
  };

  const hideToast = () => {
    setToast(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  const showSuccess = (message) => showToast('success', message);
  const showError = (message) => showToast('error', message);
  const showWarning = (message) => showToast('warning', message);
  const showInfo = (message) => showToast('info', message);

  return {
    toast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideToast
  };
};