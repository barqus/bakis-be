-- Up Migration
CREATE TABLE settings (
    id integer UNIQUE default(1),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    last_time_history_updated TIMESTAMP NOT NULL,
    Constraint CHK_Settings_singlerow CHECK (id = 1)
);

-- Down Migration
DROP TABLE IF EXISTS settings;