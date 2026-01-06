'use client';
import { FireDataContext } from '@/contexts/app-provider';
import { useContext } from 'react';

export const useFireData = () => {
  const context = useContext(FireDataContext);
  if (context === undefined) {
    throw new Error('useFireData must be used within an AppProvider');
  }
  return context;
};
