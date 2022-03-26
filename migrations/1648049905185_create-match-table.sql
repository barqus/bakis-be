-- Up Migration
CREATE TABLE IF NOT EXISTS played_games(
    id VARCHAR(100) PRIMARY KEY,
    game_duration INT NOT NULL,
    game_creation TIMESTAMP NOT NULL,
    participant_id INT,
    CONSTRAINT fk_participant FOREIGN KEY(participant_id) REFERENCES participants(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS played_games;