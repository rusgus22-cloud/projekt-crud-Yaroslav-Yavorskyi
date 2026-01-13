CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL,
    status TEXT NOT NULL
);

ALTER TABLE tasks
ADD COLUMN task_index INTEGER;

    
    
