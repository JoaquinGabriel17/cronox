import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Activity, Session } from '../types';

interface AppState {
  // --- ESTADO (DATOS) ---
  activities: Activity[];
  sessions: Session[]; // Sesiones
  history: Session[]; // Sesiones terminadas
  activeSession: Session | null; // La sesión que está corriendo actualmente (o null)

  // --- ACCIONES (FUNCIONES) ---
  addActivity: (name: string, color: string) => void; // Agregar actividad
  removeActivity: (id: string) => void; // Eliminar actividad

  addSession: (activityId: string, )
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
      sessions: [],
      activeSession: null,

      // Acciones implementation
      addActivity: (name, color) => {
        const newActivity: Activity = {
          id: crypto.randomUUID(), // Genera un ID único nativo del navegador
          name,
          color,
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

        const newSession: Session = {
          id: crypto.randomUUID(),
          sessionId,
          startTime: Date.now(),
          // endTime es undefined
        };

        set({ activeSession: newSession });
      },

      stopTimer: () => {
        const { activeSession } = get();
        if (!activeSession) return;

        // Finalizamos la sesión actual
        const completedSession: Session = {
          ...activeSession,
          endTime: Date.now(),
        };

        set((state) => ({
          history: [completedSession, ...state.history], // Agregamos al principio del historial
          activeSession: null, // Ya no hay nada corriendo
        }));
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