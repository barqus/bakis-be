-- Up Migration
CREATE TABLE IF NOT EXISTS stream (
    id VARCHAR PRIMARY KEY,
    display_name VARCHAR,
    game_name VARCHAR,
    is_live BOOLEAN,
    title VARCHAR,
    started_at VARCHAR,
    viewers INTEGER,
    thumbnail VARCHAR,
    CONSTRAINT fk_participant FOREIGN KEY(id) REFERENCES participants(twitch_id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS stream;