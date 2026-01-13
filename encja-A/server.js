const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./db/database.sqlite');
db.exec(fs.readFileSync('./db/migration.sql', 'utf8'));

app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => res.json(rows));
});

app.post('/tasks', (req, res) => {
    console.log('POST /tasks body:', req.body);

    const { title, description, priority, status } = req.body;

    if (!title || !description || !priority || !status) {
        console.log('VALIDATION ERROR');
        return res.status(400).json({ error: 'Invalid data' });
    }

    db.run(
        'INSERT INTO tasks (title, description, priority, status) VALUES (?, ?, ?, ?)',
        [title, description, priority, status],
        function (err) {
            if (err) {
                console.log('DB ERROR:', err);
                return res.status(500).json(err);
            }
            console.log('INSERTED ID:', this.lastID);
            res.status(201).json({ id: this.lastID });
        }
    );
});


app.delete('/tasks/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function () {
        if (this.changes === 0)
            return res.status(404).json({ error: 'Not found' });
        res.json({ deleted: true });
    });
});

app.listen(3000, () => console.log('Encja A: http://localhost:3000'));
