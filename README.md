# University Self-Service System

A web-based self-service portal for university students and administrators to manage academic activities.

## 🌐 Live Demo

| Component | URL |
|-----------|-----|
| **Frontend** | https://youssefessam360.github.io/University-Self-Service-System/ |
| **Backend API (Swagger)** | https://university-self-service-api-a9gdfdbqhpdedrfa.uaenorth-01.azurewebsites.net/swagger |

## Overview

This system provides:
- **Student Portal** - Registration, grade viewing, course enrollment
- **Admin Dashboard** - Manage courses, professors, and students
- **Role-Based Access** - Secure authentication with role-specific features

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| Backend | ASP.NET Core 9, C# 13 |
| Database | SQL Server, Entity Framework Core |

## CI/CD Pipeline

This project uses GitHub Actions for automated builds and deployment:

| Workflow | Purpose | Status |
|----------|---------|--------|
| CI Build | Build and validate code | ✅ Active |
| Deploy Backend | Deploy to Azure App Service | ✅ Active |
| Deploy Frontend | Deploy to GitHub Pages | ✅ Active |

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+
- .NET 9 SDK
- SQL Server (or LocalDB)

### Run the Backend

Navigate to the backend folder and run restore then run commands.

Backend runs at: http://localhost:5000

### Run the Frontend

Navigate to the frontend folder and run npm install then npm run dev.

Frontend runs at: http://localhost:4153

## Project Structure

**Backend** - `University Self Service System - Backend/`

| Folder | Purpose |
|--------|---------|
| Controllers/ | API endpoints |
| Services/ | Business logic |
| Entities/ | Database models |
| DTOs/ | Data transfer objects |

**Frontend** - `university-self-service-system-frontend/src/`

| Folder | Purpose |
|--------|---------|
| pages/ | Page components |
| context/ | React context (Auth) |
| components/ | Reusable UI components |

**Documentation** - `docs/`

## Features

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Complete |
| Student Registration | ✅ Complete |
| Grade Viewing | ✅ Complete |
| Course Management (Admin) | ✅ Complete |
| Professor Management (Admin) | ✅ Complete |
| Student Management (Admin) | 🔲 Backlog |

## Documentation

| Document | Description |
|----------|-------------|
| [Requirements](docs/REQUIREMENTS.md) | Functional and non-functional requirements |
| [Specifications](docs/SPECIFICATIONS.md) | Technical architecture and API specs |
| [Test Cases](docs/TEST_CASES.md) | 39 comprehensive test cases |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| POST /api/Auth/login | User authentication |
| POST /api/Auth/register | User registration |
| GET /api/ProfManagement | List all professors |
| GET /api/CourseFactory | List all courses |

See [SPECIFICATIONS.md](docs/SPECIFICATIONS.md) for complete API documentation.

## Diagrams

Diagrams are stored in `docs/diagrams/`. PlantUML sources (`.puml`) are included.

| Diagram | File |
|---------|------|
| Use Case | `use-case-diagram.puml` |
| Class Diagram | `class-diagram.puml` |
| Sequence - Login | `sequence-diagram-login.puml` |
| Sequence - Create Course | `sequence-diagram-create-course.puml` |
| Activity - Login | `activity-diagram-login.puml` |
| State - User Session | `state-diagram-user-session.puml` |

## Deployment

| Component | Platform | URL |
|-----------|----------|-----|
| Frontend | GitHub Pages | https://youssefessam360.github.io/University-Self-Service-System/ |
| Backend | Azure App Service | https://university-self-service-api-a9gdfdbqhpdedrfa.uaenorth-01.azurewebsites.net/swagger |
| Database | Azure SQL | Cloud-hosted SQL Server |

## Author

**Youssef Zein** - Initial development

## License

This project is for educational purposes as part of university coursework.
