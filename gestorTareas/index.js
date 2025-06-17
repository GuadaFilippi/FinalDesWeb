const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize database if it doesn't exist
const dbPath = 'db.json';
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
}

let tareas = JSON.parse(fs.readFileSync(dbPath));

// Helper function to save to database
const saveToDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(tareas, null, 2));
};

// Get all tasks
app.get('/tareas', (req, res) => {
  try {
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Create new task
app.post('/tareas', (req, res) => {
  try {
    const { titulo, descripcion, prioridad, categoria } = req.body;
    if (!titulo) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const nueva = {
      id: Date.now(),
      titulo,
      descripcion: descripcion || '',
      prioridad: prioridad || 'media',
      categoria: categoria || 'general',
      completada: false,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    tareas.push(nueva);
    saveToDb();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la tarea' });
  }
});

// Update task
app.put('/tareas/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  try {
    const { titulo, descripcion, prioridad, categoria, completada } = req.body;
    const tareaIndex = tareas.findIndex(t => t.id === id);
    if (tareaIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    const tareaActualizada = {
      ...tareas[tareaIndex],
      titulo: titulo || tareas[tareaIndex].titulo,
      descripcion: descripcion || tareas[tareaIndex].descripcion,
      prioridad: prioridad || tareas[tareaIndex].prioridad,
      categoria: categoria || tareas[tareaIndex].categoria,
      completada: completada !== undefined ? completada : tareas[tareaIndex].completada,
      fechaActualizacion: new Date().toISOString()
    };
    tareas[tareaIndex] = tareaActualizada;
    saveToDb();
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar la tarea' });
  }
});

// Delete task
app.delete('/tareas/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tareaIndex = tareas.findIndex(t => t.id === id);
    
    if (tareaIndex === -1) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tareas = tareas.filter(t => t.id !== id);
    saveToDb();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  }
});

// Get task by ID
app.get('/tareas/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tarea = tareas.find(t => t.id === id);
    
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json(tarea);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la tarea' });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
