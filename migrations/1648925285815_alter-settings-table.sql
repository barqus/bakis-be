-- Up Migration
ALTER TABLE settings
ADD COLUMN pickem_start_date TIMESTAMP NOT NULL,
ADD COLUMN pickem_end_date TIMESTAMP NOT NULL;
-- Down Migration