-- Up Migration
INSERT INTO users 
(username, email, hashed_password, activated, role) 
VALUES 
('karma0707','armandas0707@gmail.com', '$2b$10$Zhr4WkX5UKsjdZbO2vR0OO/ZXFFnIyDgJd6KD59zUBt.nYfKKLblq', true, 'admin');
-- Down Migration