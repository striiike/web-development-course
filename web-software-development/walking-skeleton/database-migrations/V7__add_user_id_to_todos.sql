-- Add user_id column to todos table with default value for existing rows
ALTER TABLE todos
  ADD COLUMN user_id INTEGER NOT NULL DEFAULT 1
  REFERENCES users(id);

-- Remove the default constraint after adding the column
ALTER TABLE todos
  ALTER COLUMN user_id DROP DEFAULT;


