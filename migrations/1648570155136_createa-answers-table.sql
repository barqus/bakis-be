-- Up Migration
CREATE TABLE IF NOT EXISTS answers (
    id SERIAL PRIMARY KEY,
    answer TEXT,
    question_id INTEGER NOT NULL UNIQUE,
    CONSTRAINT fk_question FOREIGN KEY(question_id) REFERENCES questions(id)  ON UPDATE CASCADE ON DELETE CASCADE,
    participant_id INTEGER NOT NULL,
    CONSTRAINT fk_participant FOREIGN KEY(participant_id) REFERENCES participants(id)  ON UPDATE CASCADE ON DELETE CASCADE
);

-- Down Migration
DROP TABLE IF EXISTS answers;