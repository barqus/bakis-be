-- Up Migration
CREATE TABLE IF NOT EXISTS stream (
    twitch_id VARCHAR PRIMARY KEY,
    display_name VARCHAR,
    game_name VARCHAR,
    is_live BOOLEAN,
    title VARCHAR,
    started_at VARCHAR,
    viewers INTEGER,
    thumbnail VARCHAR,
    participant_id INTEGER NOT NULL,
    CONSTRAINT fk_participant FOREIGN KEY (participant_id) REFERENCES participants (id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS stream;