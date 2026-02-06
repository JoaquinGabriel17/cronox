import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Activity } from '../types';

interface AppState {
  // --- ESTADO (DATOS) ---
  activities: Activity[];
  history: Activity[]; // Sesiones terminadas
  activeSession: Activity | null; // La sesión que está corriendo actualmente (o null)

  // --- ACCIONES (FUNCIONES) ---
  addActivity: (name: string, color: string, endTime?: number, description?: string) => void; // Agregar actividad
  removeActivity: (id: string) => void; // Eliminar actividad

  startTimer: (sessionId: string) => void; // Iniciar sesión
  stopTimer: () => void; // Detener sesión actualmente activa
  
  deleteSession: (sessionId: string) => void;
  resetApp: () => void; // Útil para borrar datos en desarrollo
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      activities: [],
      history: [],
      activeSession: null,

      // Acciones implementation
      addActivity: (name, color, endTime, description) => {
        const newActivity: Activity = {
          id: crypto.randomUUID(), // Genera un ID único nativo del navegador
          name,
          color,
          startTime: Date.now(),
          endTime: endTime || 0,
          description: description || '',
          timeLeft:0,
        };
        // Actualizamos el array de actividades manteniendo las anteriores
        set((state) => ({ activities: [...state.activities, newActivity] }));
      },

      removeActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((act) => act.id !== id),
        }));
      },

      startTimer: (sessionId) => {
        const { activeSession, stopTimer } = get();

        // Si ya hay algo corriendo, lo paramos primero
        if (activeSession) {
          stopTimer();
        }

    
      },

      stopTimer: () => {
        const { activeSession } = get();
        if (!activeSession) return;

      },

      deleteSession: (sessionId) => {
        set((state) => ({
          history: state.history.filter((s) => s.id !== sessionId),
        }));
      },

      resetApp: () => set({ activities: [], history: [], activeSession: null }),
    }),
    {
      name: 'cronox', // Nombre de la key en localStorage
      storage: createJSONStorage(() => localStorage), 
    }
  )
);