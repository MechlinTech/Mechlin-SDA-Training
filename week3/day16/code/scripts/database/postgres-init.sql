CREATE TABLE IF NOT EXISTS health_checks (
    id SERIAL PRIMARY KEY,
    service VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO health_checks (service, status)
VALUES ('postgresql', 'initialized');

SELECT 'PostgreSQL initialization completed.' AS message;