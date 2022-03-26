-- Up Migration
ALTER TABLE users
ADD COLUMN activated BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN role VARCHAR(100) DEFAULT 'member' NOT NULL;
-- Down Migration