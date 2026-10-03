CREATE TABLE IF NOT EXISTS app_metadata (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO app_metadata (name, value)
VALUES ('app', 'pixel-art-editor')
ON DUPLICATE KEY UPDATE value = VALUES(value);
