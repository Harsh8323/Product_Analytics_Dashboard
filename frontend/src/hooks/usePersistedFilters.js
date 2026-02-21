import { useState, useEffect } from 'react';
import { getCookie, setCookie } from '../utils/cookieUtils';

const defaultFilters = {
  startDate: '',
  endDate: '',
  ageGroup: '',
  gender: '',
};

export const usePersistedFilters = () => {
  const [filters, setFilters] = useState(() => {
    const saved = getCookie('filters');
    return saved || defaultFilters;
  });

  useEffect(() => {
    setCookie('filters', filters);
  }, [filters]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return { filters, updateFilters, resetFilters };
};