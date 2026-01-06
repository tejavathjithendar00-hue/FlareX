'use client';
import { AuthContext } from '@/contexts/app-provider';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};
