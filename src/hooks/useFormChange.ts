import { useState, useCallback, useRef, useEffect } from 'react';
import { BlogFormData } from '@/lib/types';

const areEqual = (a: BlogFormData, b: BlogFormData): boolean => {
  return (
    a.title === b.title &&
    a.description === b.description &&
    a.category === b.category &&
    a.author === b.author &&
    a.image === b.image &&
    a.publishDate === b.publishDate &&
    a.status === b.status
  );
};

export const useFormChange = (initialData: BlogFormData) => {
  // Use ref to store original data to avoid re-render loops
  const originalDataRef = useRef<BlogFormData>(initialData);
  const [currentData, setCurrentData] = useState<BlogFormData>(initialData);

  // Sync ref and state when initialData changes (e.g., blog loaded)
  useEffect(() => {
    originalDataRef.current = initialData;
    setCurrentData(initialData);
  }, [initialData]);

  // Compute hasChanges directly from current state and ref
  const hasChanges = !areEqual(originalDataRef.current, currentData);

  const updateField = useCallback(<K extends keyof BlogFormData>(
    field: K,
    value: BlogFormData[K]
  ) => {
    setCurrentData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback((newData?: BlogFormData) => {
    const data = newData || originalDataRef.current;
    originalDataRef.current = data;
    setCurrentData(data);
  }, []);

  return {
    formData: currentData,
    hasChanges,
    updateField,
    resetForm,
    setFormData: setCurrentData,
  };
};
