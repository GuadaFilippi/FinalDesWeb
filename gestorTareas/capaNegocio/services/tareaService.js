const tareasModel = require('../../capaDatos/models/tareaModel');

function getTareas() {
  return tareasModel.getAll();
}

function getTareaById(id) {
  const numericId = parseInt(id);
  if (isNaN(numericId)) {
    const error = new Error('ID inválido');
    error.statusCode = 400;
    throw error;
  }
  const tareas = tareasModel.getAll();
  const tarea = tareas.find(t => t.id === numericId);
  if (!tarea) {
    const error = new Error('Tarea no encontrada');
    error.statusCode = 404;
    throw error;
  }
  return tarea;
}

function crearTarea(tareaData) {
  const { titulo, descripcion, prioridad, categoria } = tareaData;
  if (!titulo) {
    const error = new Error('El título es requerido');
    error.statusCode = 400;
    throw error;
  }
  const tareas = tareasModel.getAll();
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
  tareasModel.saveAll(tareas);
  return nueva;
}

function actualizarTarea(id, tareaData) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
        const error = new Error('ID inválido');
        error.statusCode = 400;
        throw error;
    }
    const { titulo, descripcion, prioridad, categoria, completada } = tareaData;
    const tareas = tareasModel.getAll();
    const tareaIndex = tareas.findIndex(t => t.id === numericId);

    if (tareaIndex === -1) {
        const error = new Error('Tarea no encontrada');
        error.statusCode = 404;
        throw error;
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
    tareasModel.saveAll(tareas);
    return tareaActualizada;
}

function eliminarTarea(id) {
    const numericId = parseInt(id);
    if (isNaN(numericId)) {
        const error = new Error('ID inválido');
        error.statusCode = 400;
        throw error;
    }
    let tareas = tareasModel.getAll();
    const tareaIndex = tareas.findIndex(t => t.id === numericId);
    if (tareaIndex === -1) {
        const error = new Error('Tarea no encontrada');
        error.statusCode = 404;
        throw error;
    }
    tareas = tareas.filter(t => t.id !== numericId);
    tareasModel.saveAll(tareas);
}

module.exports = {
  getTareas,
  getTareaById,
  crearTarea,
  actualizarTarea,
  eliminarTarea
}; 