-- Up Migration
CREATE TABLE IF NOT EXISTS pickems
(
    id SERIAL PRIMARY KEY,
    user_id        INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    position       INTEGER NOT NULL,
    CONSTRAINT fk_participant
        FOREIGN KEY(participant_id)
            REFERENCES participants(id),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id)
);
-- Down Migration
DROP TABLE IF EXISTS pickems;