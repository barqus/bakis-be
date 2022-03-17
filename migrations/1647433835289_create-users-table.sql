-- Up Migration
CREATE TABLE IF NOT EXISTS users
(
    id                SERIAL PRIMARY KEY,
    username          VARCHAR(200) NOT NULL UNIQUE,
    email             VARCHAR(200) NOT NULL UNIQUE,
    hashed_password   VARCHAR(200) NOT NULL
);
-- Down Migration
DROP TABLE IF EXISTS users;