const path = require('path');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static('public'));

let tareas = JSON.parse(fs.readFileSync('db.json'));

app.get('/tareas', (req, res) => res.json(tareas));

app.post('/tareas', (req, res) => {
  const nueva = { id: Date.now(), ...req.body };
  tareas.push(nueva);
  fs.writeFileSync('db.json', JSON.stringify(tareas, null, 2));
  res.status(201).json(nueva);
});

app.delete('/tareas/:id', (req, res) => {
  tareas = tareas.filter(t => t.id != req.params.id);
  fs.writeFileSync('db.json', JSON.stringify(tareas, null, 2));
  res.sendStatus(204);
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });
  
app.listen(3000, () => console.log("Servidor corriendo en puerto 3000"));
