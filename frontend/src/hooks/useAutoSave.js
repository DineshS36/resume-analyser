'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { saveResumeToCloud } from '@/lib/api';

const STORAGE_KEY = 'resume_builder_draft';

export function useAutoSave(resumeData, setResumeData) {
  const saveTimeoutRef = useRef(null);
  const isRestoredRef = useRef(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);

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

    saveTimeoutRef.current = setTimeout(async () => {
      // 1. Fast local cache
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      
      // 2. Background cloud sync
      try {
        setIsSavingCloud(true);
        await saveResumeToCloud(resumeData);
        toast.success('Saved to Cloud ☁️', {
          icon: '☁️',
          duration: 2000,
          style: { fontSize: '14px' },
          id: 'cloud-save-toast'
        });
      } catch (error) {
        console.error('Failed to sync with cloud:', error);
        toast.error('Local save only (cloud sync failed)', {
          id: 'cloud-save-toast'
        });
      } finally {
        setIsSavingCloud(false);
      }
    }, 1500); // Save 1.5 seconds after last change

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

  return { clearSavedData, isSavingCloud };
}
