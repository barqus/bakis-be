-- Up Migration
CREATE TABLE IF NOT EXISTS summoners (
    id VARCHAR(100) NOT NULL PRIMARY KEY,
    summoner_name VARCHAR(100) UNIQUE,
    tier VARCHAR(100),
    rank VARCHAR(100),
    league_points VARCHAR(100),
    wins INT,
    losses INT,
    mini_series BOOLEAN,
    ms_target INT,
    ms_wins INT,
    ms_losses INT,
    ms_progress VARCHAR(100),
    CONSTRAINT fk_participant FOREIGN KEY(id) REFERENCES participants(summoner_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down Migration
DROP TABLE IF EXISTS summoners;