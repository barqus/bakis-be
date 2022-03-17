-- Up Migration
CREATE TABLE IF NOT EXISTS tournaments
(
    id                 SERIAL PRIMARY KEY,
    name               VARCHAR(100) UNIQUE,
    type               VARCHAR(100),
    region             VARCHAR(100),
    maximum_players    NUMERIC,
    registration_until DATE,
    starting_date      DATE,
    created_by_user    SERIAL NOT NULL,
    CONSTRAINT fk_users
        FOREIGN KEY (created_by_user)
            REFERENCES users (id)
);
-- Down Migration
DROP TABLE IF EXISTS tournaments;