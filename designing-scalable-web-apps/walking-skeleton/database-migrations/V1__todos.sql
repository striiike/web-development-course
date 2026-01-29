CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT false
);
CREATE INDEX idx_todos_name ON todos(name);
CREATE INDEX idx_todos_done ON todos(done);

