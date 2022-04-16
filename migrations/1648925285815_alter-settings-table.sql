-- Up Migration
ALTER TABLE settings
ADD COLUMN pickem_start_date TIMESTAMP,
ADD COLUMN pickem_end_date TIMESTAMP;
-- Down Migration