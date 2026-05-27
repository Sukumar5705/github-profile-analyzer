# GitHub Profile Analyzer API

A backend API service that analyzes GitHub user profiles using the GitHub REST API and stores useful profile insights in a MySQL database.

---

# Live API

```bash
https://your-deployed-api-url.com
```

---

# GitHub Repository

```bash
https://github.com/your-username/github-profile-analyzer-api
```

---

# Features

- Analyze GitHub user profiles
- Fetch public GitHub profile data
- Fetch repository statistics
- Store analyzed profiles in MySQL
- Calculate useful insights
- Get all analyzed profiles
- Get single analyzed profile
- Search profiles
- Pagination support
- Delete stored profiles
- Error handling
- Cloud MySQL integration

---

# Tech Stack

| Technology | Purpose |
|------------|----------|
| Node.js | Backend runtime |
| Express.js | API framework |
| MySQL | Database |
| GitHub REST API | Third-party API |
| Railway MySQL | Cloud database |
| Render/Railway | Deployment |

---

# Project Structure

```bash
github-profile-analyzer-api/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── githubController.js
│
├── middleware/
│   └── errorHandler.js
│
├── routes/
│   └── githubRoutes.js
│
├── services/
│   └── githubService.js
│
├── utils/
│   └── analyzer.js
│
├── .env
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/github-profile-analyzer-api.git
```

---

## Navigate To Project

```bash
cd github-profile-analyzer-api
```

---

## Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000

DATABASE_URL=your_mysql_connection_url
```

Example:

```env
DATABASE_URL=mysql://username:password@host:3306/database
```

---

# Run Project

## Development Mode

```bash
npm run dev
```

---

## Production Mode

```bash
npm start
```

---

# API Endpoints

---

# 1. Analyze GitHub Profile

Analyze a GitHub profile and store insights in the database.

## Endpoint

```http
POST /api/github/analyze/:username
```

## Example

```http
POST /api/github/analyze/octocat
```

## Example Response

```json
{
  "success": true,
  "message": "Profile analyzed successfully",
  "data": {
    "username": "octocat",
    "followers": 10000,
    "publicRepos": 8,
    "totalStars": 250,
    "mostUsedLanguage": "JavaScript"
  }
}
```

---

# 2. Get All Profiles

Fetch all analyzed profiles.

## Endpoint

```http
GET /api/github/profiles
```

## Pagination Example

```http
GET /api/github/profiles?page=1&limit=5
```

## Example Response

```json
{
  "success": true,
  "currentPage": 1,
  "totalPages": 2,
  "totalProfiles": 10,
  "count": 5,
  "data": []
}
```

---

# 3. Get Single Profile

Fetch one analyzed profile by username.

## Endpoint

```http
GET /api/github/profiles/:username
```

## Example

```http
GET /api/github/profiles/octocat
```

---

# 4. Search Profiles

Search analyzed profiles using username.

## Endpoint

```http
GET /api/github/search?username=oct
```

## Example Response

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "username": "octocat"
    }
  ]
}
```

---

# 5. Delete Profile

Delete a stored profile from the database.

## Endpoint

```http
DELETE /api/github/profiles/:username
```

---

# Database Schema

```sql
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
```

---

# Insights Calculated

The API calculates:

- Total stars
- Total forks
- Most used programming language
- Public repository count
- Followers count
- Following count
- Account age in days

---

# Error Handling

The API handles:

- Invalid GitHub usernames
- GitHub API rate limits
- Database errors
- Missing parameters
- Route not found errors

---

# Deployment

Backend deployed using:

- Render
- Railway

Cloud Database:

- Railway MySQL

---

# Future Improvements

- Swagger API documentation
- GitHub scoring algorithm
- Repository contribution analytics
- Caching
- Authentication
- Rate limiting
- Top starred repository analysis

---

# Author

Sukumar Erugadindla

---

# License

This project is developed for educational and assessment purposes.
