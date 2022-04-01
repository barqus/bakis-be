-- Up Migration
CREATE TABLE IF NOT EXISTS played_team_player (
    id SERIAL PRIMARY KEY,
    summoner_id VARCHAR,
    summoner_name VARCHAR,
    kills INT,
    assists INT,
    deaths INT,
    gold_earned INT,
    individual_position VARCHAR,
    lane VARCHAR,
    champ_level INT,
    champ_id INT,
    champ_name VARCHAR,
    total_damage_dealt INT,
    win BOOLEAN,
    team_id INT,
    is_participant BOOLEAN,
    CONSTRAINT fk_played_games_team FOREIGN KEY(team_id) REFERENCES played_games_team(id) ON UPDATE CASCADE ON DELETE CASCADE
);   
-- Down Migration
DROP TABLE IF EXISTS played_team_player;