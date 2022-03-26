-- Up Migration
CREATE TABLE IF NOT EXISTS participants(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    description TEXT,
    nickname VARCHAR(100) NOT NULL,
    summoner_name VARCHAR(100) NOT NULL UNIQUE,
    summoner_id VARCHAR(100) UNIQUE,
    riot_puuid VARCHAR(100) UNIQUE,
    riot_account_id VARCHAR(100) UNIQUE,
    twitch_channel VARCHAR(100) NOT NULL UNIQUE,
    instagram VARCHAR(100),
    twitter VARCHAR(100),
    youtube VARCHAR(100)
);

-- Down Migration
DROP TABLE IF EXISTS participants;