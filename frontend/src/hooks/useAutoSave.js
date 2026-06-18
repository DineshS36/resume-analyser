'use client';

import { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'resume_builder_draft';

export function useAutoSave(resumeData, setResumeData) {
  const saveTimeoutRef = useRef(null);
  const isRestoredRef = useRef(false);

  // Load saved data on mount
  useEffect(() => {
    if (!isRestoredRef.current) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setResumeData(parsed);
          toast.success('Previous progress restored!', {
            icon: '📋',
            duration: 3000,
          });
        } catch (e) {
          console.error('Failed to restore saved data:', e);
        }
      }
      isRestoredRef.current = true;
    }
  }, [setResumeData]);

  // Auto-save when data changes
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      toast.success('Progress saved automatically', {
        icon: '💾',
        duration: 2000,
        style: {
          fontSize: '14px',
        },
      });
    }, 2000); // Save 2 seconds after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [resumeData]);

  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    toast.success('Draft cleared', { icon: '🗑️' });
  }, []);

  return { clearSavedData };
}
