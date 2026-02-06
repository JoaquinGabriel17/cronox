import { useState } from 'react';
import { useStore } from './store/index';

function App() {
  // Extraemos lo que necesitamos del store
  const {
    activities,
    activeActivities,
    addActivity,
    startActivity,
    stopActivity,
    clearActiveActivities,
  } = useStore();

  const [newActName, setNewActName] = useState('');

  const defaultDurationMs = 30 * 60 * 1000;
  const activeIds = new Set(activeActivities.map((activity) => activity.id));

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
                addActivity(newActName, 'bg-blue-500', defaultDurationMs); // Color harcodeado por ahora
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
          {activities.map((act) => {
            const isActive = activeIds.has(act.id);
            return (
              <button
                key={act.id}
                onClick={() => (isActive ? stopActivity(act.id) : startActivity(act.id))}
                className={`p-4 rounded text-white font-bold text-left transition-all ${
                  isActive ? 'ring-4 ring-green-400 scale-105' : ''
                } ${act.color}`}
              >
                {act.name}
                {isActive && (
                  <span className="block text-sm font-light mt-1">Corriendo...</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Botón de STOP global */}
        {activeActivities.length > 0 && (
          <button
            onClick={clearActiveActivities}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-bold text-xl hover:bg-red-600 mt-4"
          >
            DETENER TODAS LAS ACTIVIDADES
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
