import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ManagedCinemaDto, UserLoginData } from '../types/auth.types';

import { authApi } from '../api/authApi';
import { facilitiesApi } from '../api/facilitiesApi';

interface CinemaContextType {
  activeCinemaId: string | null;
  setActiveCinemaId: (id: string | null) => void;
  managedCinemas: ManagedCinemaDto[];
  activeCinemaName: string | null;
  loading: boolean;
  refreshCinemas: () => Promise<void>;
}

const CinemaContext = createContext<CinemaContextType | undefined>(undefined);

export const CinemaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [managedCinemas, setManagedCinemas] = useState<ManagedCinemaDto[]>([]);
  const [activeCinemaId, setActiveCinemaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshCinemas = async () => {
    try {
      const res = await authApi.getProfile();
      if (res.isSuccess) {
        const currentStored = localStorage.getItem('user_info');
        if (currentStored) {
          const current = JSON.parse(currentStored);
          const isAdmin = current.roles?.includes('Admin');
          
          let managedCinemas = res.data.managedCinemas || [];
          
          // If user is Admin and has no assigned cinemas, fetch ALL cinemas
          if (isAdmin && managedCinemas.length === 0) {
            try {
               const allCinemasRes = await facilitiesApi.getCinemaList();
               if (allCinemasRes.isSuccess) {
                  managedCinemas = allCinemasRes.data.map(c => ({
                    cinemaId: c.cinemaId,
                    cinemaName: c.cinemaName
                  }));
               }
            } catch (err) {
               console.error('Admin fetch all cinemas failed', err);
            }
          }

          const updated = { ...current, ...res.data, managedCinemas };
          localStorage.setItem('user_info', JSON.stringify(updated));
          
          setManagedCinemas(managedCinemas);
          if (managedCinemas.length > 0) {
            const savedActiveId = sessionStorage.getItem('activeCinemaId');
            if (savedActiveId && managedCinemas.find(c => c.cinemaId === savedActiveId)) {
                setActiveCinemaId(savedActiveId);
            } else {
                setActiveCinemaId(managedCinemas[0].cinemaId);
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to refresh cinemas in CinemaContext', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeCinema = async () => {
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser) as UserLoginData;
          const hasManagerRole = parsed.roles?.some(r => r.includes('Manager'));
          const hasAdminRole = parsed.roles?.includes('Admin');

          if (parsed.managedCinemas && parsed.managedCinemas.length > 0) {
            setManagedCinemas(parsed.managedCinemas);
            
            const savedActiveId = sessionStorage.getItem('activeCinemaId');
            if (savedActiveId && parsed.managedCinemas.find(c => c.cinemaId === savedActiveId)) {
              setActiveCinemaId(savedActiveId);
            } else {
              setActiveCinemaId(parsed.managedCinemas[0].cinemaId);
            }
            setLoading(false);
          } else if (hasManagerRole || hasAdminRole) {
            // If it's a manager or admin, try to fetch managed cinemas
            await refreshCinemas();
          } else {
            setManagedCinemas([]);
            setActiveCinemaId(null);
            setLoading(false);
          }
        } catch (e) {
          console.error('Failed to parse user_info for CinemaContext', e);
          setLoading(false);
        }
      } else {
        setManagedCinemas([]);
        setActiveCinemaId(null);
        setLoading(false);
      }
    };

    initializeCinema();

    // Listen to storage changes (e.g. from RoleSelectionPage or Login)
    window.addEventListener('storage', initializeCinema);
    
    // Custom event for same-window updates
    window.addEventListener('user_info_updated', initializeCinema);

    return () => {
      window.removeEventListener('storage', initializeCinema);
      window.removeEventListener('user_info_updated', initializeCinema);
    };
  }, []);

  useEffect(() => {
    if (activeCinemaId) {
      sessionStorage.setItem('activeCinemaId', activeCinemaId);
    }
  }, [activeCinemaId]);

  const activeCinemaName = managedCinemas.find(c => c.cinemaId === activeCinemaId)?.cinemaName || null;

  return (
    <CinemaContext.Provider value={{ activeCinemaId, setActiveCinemaId, managedCinemas, activeCinemaName, loading, refreshCinemas }}>
      {children}
    </CinemaContext.Provider>
  );
};

export const useCinema = () => {
  const context = useContext(CinemaContext);
  if (context === undefined) {
    throw new Error('useCinema must be used within a CinemaProvider');
  }
  return context;
};
