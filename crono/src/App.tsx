import { useState } from 'react';
import { useStore } from './store/index';

function App() {
  // Extraemos lo que necesitamos del store
  const { 
    activities, 
    activeSession, 
    addActivity, 
    startTimer, 
    stopTimer, 
    history 
  } = useStore();

  const [newActName, setNewActName] = useState('');

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Time Tracker MVP</h1>

      {/* SECCIÓN 1: Crear Actividad */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">1. Crear Actividad</h2>
        <div className="flex gap-2">
          <input
            type="text"
            className="border p-2 rounded w-full"
            placeholder="Ej: Estudiar React"
            value={newActName}
            onChange={(e) => setNewActName(e.target.value)}
          />
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              if (newActName) {
                addActivity(newActName, 'bg-blue-500'); // Color harcodeado por ahora
                setNewActName('');
              }
            }}
          >
            Crear
          </button>
        </div>
      </div>

      {/* SECCIÓN 2: Listado de Actividades y Timer */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold">2. Actividades (Haz click para iniciar)</h2>
        <div className="grid grid-cols-2 gap-4">
          {activities.map((act) => (
            <button
              key={act.id}
              onClick={() => startTimer(act.id)}
              className={`p-4 rounded text-white font-bold text-left transition-all ${
                activeSession?.activityId === act.id 
                  ? 'ring-4 ring-green-400 scale-105' // Estilo si está activa
                  : ''
              } ${act.color}`} // Usamos el color guardado (bg-blue-500)
            >
              {act.name}
              {activeSession?.activityId === act.id && (
                <span className="block text-sm font-light mt-1">Corriendo...</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Botón de STOP global */}
        {activeSession && (
          <button 
            onClick={stopTimer}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-600 mt-4"
          >
            DETENER SESIÓN ACTUAL
          </button>
        )}
      </div>

      {/* SECCIÓN 3: Historial (Debug) */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">3. Historial (Logs)</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          {history.length === 0 && <p>No hay historial aún.</p>}
          {history.map((session) => {
            const activity = activities.find(a => a.id === session.activityId);
            return (
              <li key={session.id} className="border-b pb-2">
                <span className="font-bold">{activity?.name || 'Borrado'}</span>
                <span className="mx-2">|</span>
                {new Date(session.startTime).toLocaleTimeString()} - {session.endTime ? new Date(session.endTime).toLocaleTimeString() : '...'}
                <span className="mx-2">|</span>
                Duración: {session.endTime ? ((session.endTime - session.startTime) / 1000).toFixed(1) : 0} seg
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default App;