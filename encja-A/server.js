const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database('./db/database.sqlite');
db.exec(fs.readFileSync('./db/migration.sql', 'utf8'));

app.get('/tasks', (req, res) => {
    db.all(
        'SELECT * FROM tasks ORDER BY task_index ASC',
        [],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        }
    );
});

app.post('/tasks', (req, res) => {
    const { task_index, title, description, priority, status } = req.body;

    if (
        task_index === undefined ||
        !title ||
        !description ||
        !priority ||
        !status
    ) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    db.run(
        `INSERT INTO tasks (task_index, title, description, priority, status)
         VALUES (?, ?, ?, ?, ?)`,
        [task_index, title, description, priority, status],
        function (err) {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: this.lastID });
        }
    );
});

app.delete('/tasks/:id', (req, res) => {
    db.run(
        'DELETE FROM tasks WHERE id = ?',
        [req.params.id],
        function () {
            if (this.changes === 0)
                return res.status(404).json({ error: 'Not found' });
            res.json({ deleted: true });
        }
    );
});

app.listen(3000, () =>
    console.log('Encja A: http://localhost:3000')
);
