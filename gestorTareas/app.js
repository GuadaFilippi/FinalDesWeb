const path = require('path');
const express = require('express');
const app = express();
const tareaRoutes = require('./capaNegocio/routes/tareaRoutes');

app.use(express.json());

// Servir archivos estáticos desde la nueva capa de presentación
app.use(express.static(path.join(__dirname, 'capaPresentacion', 'public')));

// Cargar rutas de la API desde la capa de negocio
app.use('/tareas', tareaRoutes);

// Servir la página principal desde la nueva capa de presentación
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'capaPresentacion', 'views', 'index.html'));
});

// Middleware para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT} con la nueva arquitectura`)); 