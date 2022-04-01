-- Up Migration
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    question TEXT
);

-- Down Migration
DROP TABLE IF EXISTS questions;