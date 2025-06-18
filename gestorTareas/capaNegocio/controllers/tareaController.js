const tareasService = require('../services/tareaService');

function getTareas(req, res) {
  try {
    const tareas = tareasService.getTareas();
    res.json(tareas);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error al obtener las tareas' });
  }
}

function getTareaById(req, res) {
  try {
    const tarea = tareasService.getTareaById(req.params.id);
    res.json(tarea);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error al obtener la tarea' });
  }
}

function crearTarea(req, res) {
  try {
    const nuevaTarea = tareasService.crearTarea(req.body);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error al crear la tarea' });
  }
}

function actualizarTarea(req, res) {
  try {
    const tareaActualizada = tareasService.actualizarTarea(req.params.id, req.body);
    res.json(tareaActualizada);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error al actualizar la tarea' });
  }
}

function eliminarTarea(req, res) {
  try {
    tareasService.eliminarTarea(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message || 'Error al eliminar la tarea' });
  }
}

module.exports = {
  getTareas,
  getTareaById,
  crearTarea,
  actualizarTarea,
  eliminarTarea
}; 