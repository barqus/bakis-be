-- Up Migration
CREATE TABLE IF NOT EXISTS participants(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    description TEXT,
    nickname VARCHAR NOT NULL,
    summoner_name VARCHAR NOT NULL UNIQUE,
    summoner_id VARCHAR UNIQUE,
    riot_puuid VARCHAR UNIQUE,
    riot_account_id VARCHAR UNIQUE,
    twitch_channel VARCHAR NOT NULL UNIQUE,
    instagram VARCHAR,
    twitter VARCHAR,
    youtube VARCHAR
);

-- Down Migration
DROP TABLE IF EXISTS participants;