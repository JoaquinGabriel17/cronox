export interface Activity {
  id: string;
  name: string; // Nombre
  color: string; // Para mostrar en la UI (ej: 'bg-blue-500')
}

export interface Session {
  id: string;
  activityId: string; // Relación con la actividad
  startTime: number; // Guardamos timestamps (ms) es más fácil de calcular
  endTime?: number; // Opcional, porque si está corriendo, no tiene fin aún
  note?: string; // Opcional: "Capítulo 4 de libro X"
}