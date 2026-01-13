const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./db/database.sqlite');
db.exec(fs.readFileSync('./db/migration.sql', 'utf8'));

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (e, r) => res.json(r));
});

app.post('/products', (req, res) => {
  const { name, sku, price, category } = req.body;
  if (!name || !sku || !price || !category) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  db.run(
    'INSERT INTO products (name, sku, price, category) VALUES (?, ?, ?, ?)',
    [name, sku, price, category],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(3001, () => console.log('Encja B: http://localhost:3001'));
