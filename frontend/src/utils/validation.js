import { useState } from 'react';

// Système de validation robuste pour les formulaires

export const validators = {
  required: (value, message = 'Ce champ est requis') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  },

  email: (value, message = 'Email invalide') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  minLength: (min, message) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : message || `Minimum ${min} caractères`;
  },

  maxLength: (max, message) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : message || `Maximum ${max} caractères`;
  },

  number: (value, message = 'Doit être un nombre') => {
    if (!value) return null;
    return !isNaN(value) && !isNaN(parseFloat(value)) ? null : message;
  },

  positiveNumber: (value, message = 'Doit être un nombre positif') => {
    if (!value) return null;
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 ? null : message;
  },

  phone: (value, message = 'Numéro de téléphone invalide') => {
    if (!value) return null;
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : message;
  },

  date: (value, message = 'Date invalide') => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : message;
  },

  futureDate: (value, message = 'La date doit être dans le futur') => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today ? null : message;
  },

  salary: (value, message = 'Salaire invalide (minimum SMIC 2024: 1398€)') => {
    if (!value) return null;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 1398 ? null : message;
  }
};

export const validateField = (value, validationRules) => {
  if (!validationRules || validationRules.length === 0) return null;

  for (const rule of validationRules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

export const useFormValidation = (initialData, validationSchema) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateFieldLocal = (field, value) => {
    if (!validationSchema[field]) return null;
    
    for (const rule of validationSchema[field]) {
      const error = rule(value);
      if (error) return error;
    }
    return null;
  };

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    
    if (touched[field]) {
      const error = validateFieldLocal(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateFieldLocal(field, data[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validateAll = () => {
    const newErrors = {};
    const newTouched = {};
    let isValid = true;

    Object.keys(validationSchema).forEach(field => {
      newTouched[field] = true;
      const error = validateFieldLocal(field, data[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    isValid: Object.keys(errors).every(key => !errors[key])
  };
};

export const validationSchemas = {
  employee: {
    first_name: [validators.required, validators.minLength(2)],
    last_name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    salary: [validators.required, validators.salary]
  },

  leaveRequest: {
    leave_type: [validators.required],
    start_date: [validators.required, validators.date, validators.futureDate],
    end_date: [validators.required, validators.date, validators.futureDate],
    reason: [validators.required, validators.minLength(10)]
  }
};