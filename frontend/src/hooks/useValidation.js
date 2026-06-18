'use client';

import { useState, useCallback } from 'react';

const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email';
    return null;
  },
  phone: (value) => {
    if (!value) return null; // Optional
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    return null;
  },
  required: (value, fieldName) => {
    if (!value || value.trim() === '') return `${fieldName} is required`;
    return null;
  },
  linkedin: (value) => {
    if (!value) return null; // Optional
    if (!value.includes('linkedin.com')) return 'Please enter a valid LinkedIn URL';
    return null;
  },
  url: (value) => {
    if (!value) return null; // Optional
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(value)) return 'Please enter a valid URL (starting with http:// or https://)';
    return null;
  },
  date: (value) => {
    if (!value) return null; // Optional
    const dateRegex = /^\d{4}-\d{2}$/;
    if (!dateRegex.test(value)) return 'Please use format: YYYY-MM';
    return null;
  },
};

export function useValidation() {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = useCallback((name, value, rules = {}) => {
    let error = null;

    if (rules.required) {
      error = validators.required(value, rules.fieldName || name);
    }

    if (!error && value) {
      if (rules.email) error = validators.email(value);
      if (rules.phone) error = validators.phone(value);
      if (rules.linkedin) error = validators.linkedin(value);
      if (rules.url) error = validators.url(value);
      if (rules.date) error = validators.date(value);
    }

    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));

    return error;
  }, []);

  const validateAll = useCallback((fields) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(fields).forEach(([name, { value, rules }]) => {
      const error = validateField(name, value, rules);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setTouched(Object.keys(fields).reduce((acc, key) => ({
      ...acc,
      [key]: true,
    }), {}));

    return isValid;
  }, [validateField]);

  const touchField = useCallback((name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  const getFieldError = useCallback((name) => {
    return touched[name] ? errors[name] : null;
  }, [errors, touched]);

  return {
    errors,
    touched,
    validateField,
    validateAll,
    touchField,
    clearErrors,
    getFieldError,
  };
}
