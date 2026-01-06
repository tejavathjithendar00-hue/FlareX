'use client';

import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { TemperatureData } from '@/lib/data';
import { generateFireTheme } from '@/ai/flows/dynamic-fire-theme';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { TriangleAlert } from 'lucide-react';
import { useFireData } from '@/hooks/use-fire-data';

// --- Types ---
type User = {
  name: string;
  email: string;
  role: 'user' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, role: 'user' | 'admin') => void;
  logout: () => void;
};

type FireDataContextType = {
  fireData: TemperatureData[];
  isFireDetected: boolean;
  toggleFire: () => void;
};

// --- Contexts ---
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const FireDataContext = createContext<FireDataContextType | undefined>(undefined);

// --- Helper Components ---

function DynamicThemeHandler() {
  const { isFireDetected } = useFireData();

  useEffect(() => {
    const updateTheme = async () => {
      try {
        const result = await generateFireTheme({
          fireDetected: isFireDetected,
          environmentalData: 'System nominal. Stand by for real-time sensor readings.',
        });

        const root = document.documentElement;
        if (isFireDetected && !result.alertDismissed) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      } catch (error) {
        console.error('Failed to generate theme:', error);
        // Fallback behavior
        const root = document.documentElement;
        if (isFireDetected) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    updateTheme();
  }, [isFireDetected]);

  return null;
}

function FireAlertModal() {
    const { isFireDetected } = useFireData();

    return (
        <AlertDialog open={isFireDetected}>
            <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                         <TriangleAlert className="h-12 w-12 text-destructive" />
                    </div>
                    <AlertDialogTitle className="text-center text-3xl font-bold text-destructive">
                        ALERT: FIRE DETECTED
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-center text-base">
                        Elevated temperature readings detected. Please review the live data and take immediate action.
                    </AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// --- Main Provider ---
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('fireResponseUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
        console.error("Could not parse user from local storage", error);
        localStorage.removeItem('fireResponseUser');
    }
    setLoading(false);
  }, []);

  const login = (email: string, role: 'user' | 'admin') => {
    setLoading(true);
    let newUser: User;
    if (role === 'admin') {
      newUser = { name: 'Admin', email, role: 'admin' };
    } else {
       const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
       const approvedUser = approvedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
       newUser = { name: approvedUser?.name || 'Station User', email, role: 'user' };
    }
    
    localStorage.setItem('fireResponseUser', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    router.push(newUser.role === 'admin' ? '/admin/dashboard' : '/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('fireResponseUser');
    setUser(null);
    router.push('/login');
  };
  
  const authContextValue = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  // Fire Data State
  const [fireData, setFireData] = useState<TemperatureData[]>([]);
  const [isFireDetected, setIsFireDetected] = useState(false);
  const [isSimulatingFire, setIsSimulatingFire] = useState(false);


  useEffect(() => {
    const interval = setInterval(() => {
      setFireData(prevData => {
        const now = new Date();
        const newTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        
        const newTemp = isSimulatingFire
          ? Math.floor(Math.random() * 50) + 100 // High temp for fire: 100-150
          : Math.floor(Math.random() * 25) + 20; // Normal temp: 20-45

        const newDataPoint: TemperatureData = { time: newTime, temperature: newTemp };
        
        const updatedData = [...prevData, newDataPoint];
        if(newTemp > 40) {
          setIsFireDetected(true);
        } else {
          if(!isSimulatingFire) {
            setIsFireDetected(false);
          }
        }
        return updatedData.length > 30 ? updatedData.slice(-30) : updatedData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulatingFire]);

  const toggleFire = useCallback(() => {
    setIsSimulatingFire(prev => {
      const newSimulatingState = !prev;
      if (newSimulatingState) {
        setIsFireDetected(true); // When simulation starts, fire is detected
      } else {
        // When simulation stops, let the interval logic decide if fire is detected
        // based on temperature. We can force a check here or just wait for next interval.
        const lastTemp = fireData.length > 0 ? fireData[fireData.length-1].temperature : 0;
        if(lastTemp <= 40) {
            setIsFireDetected(false);
        }
      }
      setFireData([]); // Clear previous data for a fresh start
      return newSimulatingState;
    });
  }, []);

  const fireDataContextValue = useMemo(() => ({ fireData, isFireDetected, toggleFire }), [fireData, isFireDetected, toggleFire]);

  // Render
  return (
    <AuthContext.Provider value={authContextValue}>
      <FireDataContext.Provider value={fireDataContextValue}>
        <DynamicThemeHandler />
        {(!loading && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) && <FireAlertModal />}
        {children}
      </FireDataContext.Provider>
    </AuthContext.Provider>
  );
}