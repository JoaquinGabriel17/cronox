import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Activity } from '../types';

interface AppState {
  // --- ESTADO (DATOS) ---
  activities: Activity[];
  activeActivities: Activity[]; // Actividades en curso

  // --- ACCIONES (FUNCIONES) ---
  addActivity: (name: string, color: string, durationMs: number, description?: string) => void; // Crear actividad
  removeActivity: (id: string) => void; // Eliminar actividad
  startActivity: (activityId: string) => void; // Empezar actividad
  stopActivity: (activityId: string) => void; // Detener actividad
  clearActiveActivities: () => void; // Eliminar todas las actividades en curso
  updateActivity: (activityId: string, updates: Partial<Omit<Activity, 'id'>>) => void;
  resetStore: () => void; // Útil para borrar datos en desarrollo
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      activities: [],
      activeActivities: [],

      // Acciones implementation
      addActivity: (name, color, durationMs, description) => {
        const newActivity: Activity = {
          id: crypto.randomUUID(), // Genera un ID único nativo del navegador
          name,
          color,
          startTime: Date.now(),
          endTime: 0,
          description: description || '',
          timeLeft: durationMs,
          isActive: false,
        };
        // Actualizamos el array de actividades manteniendo las anteriores
        set((state) => ({ activities: [...state.activities, newActivity] }));
      },

      removeActivity: (id) => {
        set((state) => ({
          activities: state.activities.filter((act) => act.id !== id),
          activeActivities: state.activeActivities.filter((act) => act.id !== id),
        }));
      },

      startActivity: (activityId) => {
        const { activities, activeActivities } = get();
        const target = activities.find((activity) => activity.id === activityId);
        if (!target) return;

        const now = Date.now();
        const updatedActivity: Activity = {
          ...target,
          startTime: now,
          endTime: now + target.timeLeft,
          isActive: true,
          stopTime: undefined,
        };

        set(() => ({
          activities: activities.map((activity) =>
            activity.id === activityId ? updatedActivity : activity
          ),
          activeActivities: [
            ...activeActivities.filter((activity) => activity.id !== activityId),
            updatedActivity,
          ],
        }));
      },

      stopActivity: (activityId) => {
        const { activities, activeActivities } = get();
        const target = activities.find((activity) => activity.id === activityId);
        if (!target) return;

        const now = Date.now();
        const remaining = Math.max(target.endTime - now, 0);
        const updatedActivity: Activity = {
          ...target,
          timeLeft: remaining,
          isActive: false,
          stopTime: now,
        };

        set(() => ({
          activities: activities.map((activity) =>
            activity.id === activityId ? updatedActivity : activity
          ),
          activeActivities: activeActivities.filter((activity) => activity.id !== activityId),
        }));
      },

      clearActiveActivities: () => {
        const { activities, activeActivities } = get();
        const now = Date.now();
        const activeIds = new Set(activeActivities.map((activity) => activity.id));

        set(() => ({
          activities: activities.map((activity) => {
            if (!activeIds.has(activity.id)) return activity;
            const remaining = Math.max(activity.endTime - now, 0);
            return {
              ...activity,
              timeLeft: remaining,
              isActive: false,
              stopTime: now,
            };
          }),
          activeActivities: [],
        }));
      },

      updateActivity: (activityId, updates) => {
        const { activities, activeActivities } = get();
        set(() => ({
          activities: activities.map((activity) =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          ),
          activeActivities: activeActivities.map((activity) =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          ),
        }));
      },

      resetStore: () => set({ activities: [], activeActivities: [] }),
    }),
    {
      name: 'cronox', // Nombre de la key en localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
