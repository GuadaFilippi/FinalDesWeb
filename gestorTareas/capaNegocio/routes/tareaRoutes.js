const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');

router.get('/', tareaController.getTareas);
router.get('/:id', tareaController.getTareaById);
router.post('/', tareaController.crearTarea);
router.put('/:id', tareaController.actualizarTarea);
router.delete('/:id', tareaController.eliminarTarea);

module.exports = router; 