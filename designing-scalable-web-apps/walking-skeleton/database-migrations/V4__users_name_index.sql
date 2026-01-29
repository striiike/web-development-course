CREATE INDEX idx_users_name ON users(name);

-- CREATE UNIQUE INDEX idx_users_email_unique ON users(LOWER(email));
-- CREATE INDEX idx_users_email_active ON users(email) WHERE status = 'active';