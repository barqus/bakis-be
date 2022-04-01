-- Up Migration
CREATE TABLE IF NOT EXISTS played_games_team (
    id SERIAL PRIMARY KEY,
    barons_killed INT NOT NULL,
    champions_killed INT NOT NULL,
    towers_killed INT NOT NULL,
    inhibitors_killed INT NOT NULL,
    dragons_killed INT NOT NULL,
    rift_heralds_killed INT NOT NULL,
    win BOOLEAN,
    game_id VARCHAR,
    CONSTRAINT fk_played_games FOREIGN KEY(game_id) REFERENCES played_games(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS played_games_team;