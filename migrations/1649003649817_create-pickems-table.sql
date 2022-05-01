-- Up Migration
CREATE TABLE IF NOT EXISTS pickems
(
    user_id        INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    position       INTEGER NOT NULL,
    PRIMARY KEY (user_id, participant_id, position),
    UNIQUE (user_id, position),
    CONSTRAINT fk_participant
        FOREIGN KEY(participant_id)
            REFERENCES participants(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- Down Migration
DROP TABLE IF EXISTS pickems;