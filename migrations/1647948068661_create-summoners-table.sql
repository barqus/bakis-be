-- Up Migration
CREATE TABLE IF NOT EXISTS summoners (
    id VARCHAR NOT NULL PRIMARY KEY,
    summoner_name VARCHAR UNIQUE,
    tier VARCHAR,
    rank VARCHAR,
    league_points VARCHAR,
    wins INT,
    losses INT,
    mini_series BOOLEAN,
    ms_target INT,
    ms_wins INT,
    ms_losses INT,
    ms_progress VARCHAR,
    CONSTRAINT fk_participant FOREIGN KEY(id) REFERENCES participants(summoner_id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down Migration
DROP TABLE IF EXISTS summoners;