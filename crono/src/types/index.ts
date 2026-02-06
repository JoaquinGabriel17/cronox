export interface Activity {
  id: string;
  name: string; // Nombre
  color: string; // Para mostrar en la UI (ej: 'bg-blue-500')
  startTime: number; // Timestamp de creación
  endTime: number; // Timestamp de finalización 
  description?: string; // Descripción opcional
  timeLeft: number; // Tiempo restante
  isActive: boolean; // para saber si está activa.
  stopTime?: number; // Timestamp de detención
}
