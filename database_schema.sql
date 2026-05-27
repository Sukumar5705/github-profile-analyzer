CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    bio TEXT,

    public_repos INT DEFAULT 0,
    followers INT DEFAULT 0,
    following INT DEFAULT 0,

    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,

    most_used_language VARCHAR(100),

    account_age_days INT DEFAULT 0,

    profile_url VARCHAR(500),
    avatar_url VARCHAR(500),

    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
