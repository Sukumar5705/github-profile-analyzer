# Developer Intelligence Platform

### AI-Powered GitHub Portfolio Analysis, Recruiter Insights & Career Growth Engine

Developer Intelligence Platform is a full-stack analytics platform that transforms GitHub profiles into actionable career insights.

Unlike traditional GitHub analytics tools that only display statistics such as stars, repositories, and followers, this platform analyzes a developer's portfolio to identify technical strengths, evaluate project quality, detect portfolio gaps, generate recruiter-focused feedback, and create personalized career roadmaps.

---

## Key Features

### GitHub Profile Analysis

Analyze any public GitHub profile and collect:

* Profile information
* Repository statistics
* Language usage
* Stars and forks
* Account activity
* Repository metadata

---

### Skill Extraction Engine

Automatically identifies technical skills from:

* Repository names
* Descriptions
* Topics
* Languages
* README content

Example:

```text
Node.js
Express.js
MySQL
React
Docker
AWS
Redis
```

---

### Developer Type Classification

Classifies developers into professional roles such as:

* Backend Developer
* Frontend Developer
* Full Stack Developer
* AI Engineer
* DevOps Engineer
* Mobile Developer

Each classification includes confidence scoring and supporting evidence.

---

### Career Readiness Score

Evaluates portfolio quality using multiple dimensions:

* Documentation Quality
* Project Diversity
* Technical Breadth
* Deployment Evidence
* Open Source Contributions
* Activity Consistency

Example:

```text
Career Readiness Score: 84/100
```

---

### Project Intelligence Engine

Ranks repositories using multiple quality signals:

* Documentation
* Technical Complexity
* Repository Activity
* Community Engagement
* Technology Stack

Automatically identifies:

* Best Resume Project
* Best Technical Project
* Best Architecture Project
* Most Recruiter-Friendly Project

---

### Portfolio Gap Analysis

Detects missing areas in a developer portfolio.

Examples:

* Testing
* Docker
* CI/CD
* Cloud Deployment
* Authentication
* Open Source Contributions
* System Design

Provides actionable recommendations for improvement.

---

### Recruiter View

Generates recruiter-focused insights including:

* Technical strengths
* Areas for improvement
* Top projects
* Career readiness assessment
* Hiring recommendations

Example:

```text
Strong Backend Development Experience

Good API Design Knowledge

Needs More Cloud Exposure

Recommended for Entry-Level Backend Roles
```

---

### Resume Evidence Engine

Converts GitHub activity into measurable resume evidence.

Example:

```text
Backend Development

Evidence:

• Built 8 REST API projects
• Used relational databases in 5 repositories
• Implemented authentication in 3 applications
```

---

### AI-Powered Portfolio Review

Using Gemini AI, the platform generates:

* Professional developer summaries
* Portfolio reviews
* Personalized learning roadmaps
* Career recommendations
* Resume-ready bullet points

---

### Learning Roadmap Generator

Creates personalized growth plans based on:

* Existing skills
* Portfolio gaps
* Career goals
* Developer classification

Example:

```text
Month 1
Docker
Testing

Month 2
Redis
AWS

Month 3
System Design
Microservices
```

---

## System Architecture

```text
GitHub Username
        │
        ▼
GitHub API
        │
        ▼
Developer Intelligence Platform
        │
        ├── Skill Extraction Engine
        ├── Project Ranking Engine
        ├── Career Score Engine
        ├── Gap Analysis Engine
        ├── Recruiter Analysis Engine
        ├── Resume Evidence Engine
        └── AI Insight Engine
        │
        ▼
MySQL Database
        │
        ▼
Developer Intelligence Report
```

---

## Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

### Backend

* Node.js
* Express.js
* Axios
* Zod
* Winston

### Database

* MySQL
* Railway

### AI

* Gemini AI API

### External APIs

* GitHub REST API

### Deployment

* Vercel
* Render
* Railway

---

## Backend Architecture

```text
src/

├── config/
├── controllers/
├── routes/
├── services/
├── analyzers/
├── repositories/
├── middleware/
├── validations/
├── prompts/
├── utils/
├── app.js
└── server.js
```

---

## Core Analysis Pipeline

```text
GitHub Profile
      │
      ▼
Repository Collection
      │
      ▼
Skill Extraction
      │
      ▼
Developer Classification
      │
      ▼
Project Ranking
      │
      ▼
Career Score Calculation
      │
      ▼
Portfolio Gap Analysis
      │
      ▼
Recruiter Evaluation
      │
      ▼
Resume Evidence Generation
      │
      ▼
AI Insights & Roadmap
      │
      ▼
Final Developer Intelligence Report
```

---

## API Endpoints

### Analyze Profile

```http
POST /api/analyze/:username
```

Runs the complete developer intelligence pipeline.

---

### Profile Information

```http
GET /api/profile/:username
```

---

### Skills

```http
GET /api/skills/:username
```

---

### Top Projects

```http
GET /api/projects/top/:username
```

---

### Career Score

```http
GET /api/career-score/:username
```

---

### Recruiter View

```http
GET /api/recruiter/:username
```

---

### AI Insights

```http
POST /api/analysis/:username/generate-ai
```

---

## Example Use Cases

### For Students

* Improve portfolio quality
* Identify missing projects
* Prepare for placements
* Build stronger resumes

### For Recruiters

* Quickly assess developer profiles
* Identify strengths and weaknesses
* Review top projects
* Generate hiring insights

### For Developers

* Track growth
* Discover portfolio gaps
* Plan learning paths
* Improve professional branding

---

## Future Enhancements

* GitHub Profile Comparison
* Developer Benchmarking
* Portfolio Growth Tracking
* ATS Resume Matching
* Interview Preparation Assistant
* Team Portfolio Analysis
* Open Source Contribution Analytics

---

## Resume Highlights

This project demonstrates:

* REST API Design
* Scalable Backend Architecture
* Repository Pattern
* Service Layer Architecture
* Database Design
* GitHub API Integration
* AI Integration
* Prompt Engineering
* Data Analytics
* Rule-Based Intelligence Systems
* Software Design Principles

---

## Author

**Sukumar Erugadindla**

GitHub: https://github.com/Sukumar5705

---

## License

This project is developed for educational, portfolio, and research purposes.
