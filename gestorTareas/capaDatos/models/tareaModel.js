const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'db', 'db.json');

function initDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
  }
}

function getAll() {
  initDb();
  return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
}

function saveAll(tareas) {
  fs.writeFileSync(dbPath, JSON.stringify(tareas, null, 2));
}

module.exports = {
  getAll,
  saveAll
}; 