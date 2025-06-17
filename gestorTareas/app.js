const path = require('path');
const express = require('express');
const app = express();
const tareaRoutes = require('./capaNegocio/routes/tareaRoutes');
const fs = require('fs');
const usuariosPath = path.join(__dirname, 'capaDatos', 'db', 'usuarios.json');

app.use(express.json());

// Servir archivos estáticos desde la nueva capa de presentación
app.use(express.static(path.join(__dirname, 'capaPresentacion', 'public')));

// Cargar rutas de la API desde la capa de negocio
app.use('/tareas', tareaRoutes);

// Endpoint de registro
app.post('/register', (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  let usuarios = [];
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
  }
  if (usuarios.find(u => u.email === email)) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }
  const nuevoUsuario = { id: Date.now(), nombre, apellido, email, password };
  usuarios.push(nuevoUsuario);
  fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});

// Endpoint de login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }
  let usuarios = [];
  if (fs.existsSync(usuariosPath)) {
    usuarios = JSON.parse(fs.readFileSync(usuariosPath, 'utf-8'));
  }
  const user = usuarios.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Email o contraseña incorrectos' });
  }
  // No enviar la contraseña al frontend
  const { password: _, ...userData } = user;
  res.json({ user: userData });
});

// Servir login y registro
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'capaPresentacion', 'views', 'login.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'capaPresentacion', 'views', 'login.html'));
});
app.get('/register.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'capaPresentacion', 'views', 'register.html'));
});

// Endpoint para servir index.html
app.get('/index.html', (req, res) => {
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