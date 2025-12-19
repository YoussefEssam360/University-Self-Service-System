# Technical Specifications Document
## University Self-Service System

**Project Name:** University Self-Service System  
**Version:** 1.0  
**Date:** 19/12/2025  
**Prepared By:** Youssef Zein

---

## Table of Contents
1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Database Design](#3-database-design)
4. [API Specifications](#4-api-specifications)
5. [Frontend Specifications](#5-frontend-specifications)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Data Transfer Objects (DTOs)](#7-data-transfer-objects-dtos)
8. [Error Handling](#8-error-handling)
9. [Deployment Specifications](#9-deployment-specifications)

---

## 1. System Architecture

### 1.1 High-Level Architecture

The system follows a **3-tier architecture**:

| Layer | Technology | Responsibility |
|-------|------------|----------------|
| **Presentation (Client)** | React SPA (Vite) | User interface, routing, state management |
| **Application (API)** | ASP.NET Core 9 Web API | Business logic, authentication, data validation |
| **Data** | SQL Server + EF Core | Data persistence, queries, transactions |

**Communication Flow:**
- Client ↔ API: HTTP/HTTPS (RESTful JSON)
- API ↔ Database: Entity Framework Core (ORM)

### 1.2 Component Overview

**Frontend Components:**
| Component | Purpose |
|-----------|---------|
| AuthContext | Manages authentication state across the app |
| StudentPages | Student dashboard, registration, grades |
| AdminPages | Admin dashboard, management pages |
| React Router | Client-side navigation |

**Backend Components:**
| Component | Purpose |
|-----------|---------|
| Controllers | Handle HTTP requests, return responses |
| Services | Business logic implementation |
| DTOs | Data transfer between layers |
| DbContext | Database access via Entity Framework |
| Entity Models | Database table representations |

### 1.3 Request Flow

1. User interacts with React frontend
2. Frontend makes HTTP request to backend API
3. API Controller receives and validates request
4. Controller calls appropriate Service
5. Service performs business logic and data access
6. Response DTO is returned through the layers
7. Frontend updates UI based on response

---

## 2. Technology Stack

### 2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI component library |
| Vite | 5.x | Build tool and dev server |
| React Router | 6.x | Client-side routing |
| JavaScript (ES6+) | - | Programming language |
| CSS3 | - | Styling |

### 2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 9.0 | Runtime framework |
| ASP.NET Core | 9.0 | Web API framework |
| Entity Framework Core | 9.x | ORM / Data access |
| C# | 13.0 | Programming language |

### 2.3 Database

| Technology | Version | Purpose |
|------------|---------|---------|
| SQL Server | 2019+ | Relational database |
| T-SQL | - | Query language |

### 2.4 Development Tools

| Tool | Purpose |
|------|---------|
| Visual Studio 2022/2026 | IDE |
| Git | Version control |
| npm | Package management (frontend) |
| NuGet | Package management (backend) |

---

## 3. Database Design

### 3.1 Entity Relationships

| Relationship | Type | Description |
|--------------|------|-------------|
| User → Student | One-to-One | Each student has one user account |
| User → Professor | One-to-One | Each professor has one user account |
| Professor → Course | One-to-Many | One professor teaches many courses |
| Student → Enrollment | One-to-Many | One student has many enrollments |
| Course → Enrollment | One-to-Many | One course has many enrollments |

### 3.2 Table Specifications

#### 3.2.1 User Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | INT | PK, Identity | Primary key |
| Username | NVARCHAR(50) | NOT NULL, Unique | Login username |
| PasswordHash | NVARCHAR(255) | NOT NULL | Hashed password |
| Role | NVARCHAR(20) | NOT NULL | User role (Student/Admin/Professor) |
| Email | NVARCHAR(100) | NOT NULL, Unique | User email |

#### 3.2.2 Student Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | INT | PK, Identity | Primary key |
| UserId | INT | FK → User.Id | Link to user account |
| Name | NVARCHAR(100) | NOT NULL | Display name |
| FullName | NVARCHAR(200) | NOT NULL | Full legal name |
| DateOfBirth | DATE | NULL | Date of birth |
| Email | NVARCHAR(100) | NOT NULL | Student email |
| PhoneNumber | NVARCHAR(50) | NOT NULL, MaxLength(50) | Contact phone |
| Major | NVARCHAR(100) | NOT NULL | Academic major |

#### 3.2.3 Professor Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | INT | PK, Identity | Primary key |
| UserId | INT | FK → User.Id | Link to user account |
| Name | NVARCHAR(100) | NOT NULL | Professor name |
| Email | NVARCHAR(100) | NOT NULL | Professor email |
| Department | NVARCHAR(100) | NOT NULL | Academic department |
| PhoneNumber | NVARCHAR(50) | NULL | Contact phone |

#### 3.2.4 Course Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | INT | PK, Identity | Primary key |
| Code | NVARCHAR(20) | NOT NULL, Unique | Course code (e.g., CS101) |
| Title | NVARCHAR(200) | NOT NULL | Course title |
| CreditHours | INT | NOT NULL | Credit hours |
| ProfessorId | INT | FK → Professor.Id, NULL | Assigned professor |
| StartDate | DATE | NULL | Course start date |
| EndDate | DATE | NULL | Course end date |

#### 3.2.5 Enrollment Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| Id | INT | PK, Identity | Primary key |
| StudentId | INT | FK → Student.Id | Enrolled student |
| CourseId | INT | FK → Course.Id | Enrolled course |
| EnrolledAt | DATETIME | NOT NULL | Enrollment timestamp |
| Grade | NVARCHAR(5) | NULL | Final grade (A, B, C, etc.) |

---

## 4. API Specifications

### 4.1 Base URL

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:5000/api` |
| Production | `https://[domain]/api` |

### 4.2 Professor Management API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/ProfManagement` | Get all professors | - | `List<RViewProfessorDto>` |
| GET | `/api/ProfManagement/{id}` | Get professor by ID | - | `RViewProfessorDto` |
| POST | `/api/ProfManagement` | Create professor | `CreateProfessorDto` | `RCreatedProfessorDto` |
| PUT | `/api/ProfManagement` | Update professor | `UpdateProfessorDto` | `RUpdateProfessorDto` |
| DELETE | `/api/ProfManagement` | Delete professor | `DeleteProfessorDto` | `RDeleteProfessorDto` |

### 4.3 Course Management API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/Course` | Get all courses | - | `List<CourseDto>` |
| GET | `/api/Course/{id}` | Get course by ID | - | `CourseDto` |
| POST | `/api/Course` | Create course | `CreateCourseDto` | `CourseDto` |
| PUT | `/api/Course/{id}` | Update course | `UpdateCourseDto` | `CourseDto` |
| DELETE | `/api/Course/{id}` | Delete course | - | `200 OK` |

### 4.4 Student Management API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/Student` | Get all students | - | `List<StudentDto>` |
| GET | `/api/Student/{id}` | Get student by ID | - | `StudentDto` |
| POST | `/api/Student/register` | Register student | `StudentRegistrationDto` | `StudentDto` |
| PUT | `/api/Student/{id}` | Update student | `UpdateStudentDto` | `StudentDto` |

### 4.5 Authentication API

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/Auth/login` | User login | `LoginDto` | `AuthResponseDto` |
| POST | `/api/Auth/logout` | User logout | - | `200 OK` |

### 4.6 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server-side error |

---

## 5. Frontend Specifications

### 5.1 Project Structure

| Directory | Purpose |
|-----------|---------|
| `src/components/` | Reusable UI components |
| `src/context/` | React context providers (AuthContext) |
| `src/pages/Student/` | Student-related pages and layouts |
| `src/pages/Admin/` | Admin-related pages |
| `src/services/` | API service functions |
| `public/` | Static assets |

### 5.2 Key Files

| File | Purpose |
|------|---------|
| `main.jsx` | Application entry point |
| `App.jsx` | Main component with routing |
| `AuthContext.jsx` | Authentication state management |
| `StudentLayout.jsx` | Student page layout with navigation |
| `StudentRegistrationPage.jsx` | Student profile form |
| `AdminDashboard.jsx` | Admin main dashboard |

### 5.3 Routing Configuration

| Path | Component | Access Level |
|------|-----------|--------------|
| `/` | LoginPage | Public |
| `/login` | LoginPage | Public |
| `/student` | StudentLayout → StudentDashboard | Student |
| `/student/register` | StudentLayout → StudentRegistrationPage | Student |
| `/student/grades` | StudentLayout → StudentGrades | Student |
| `/admin` | AdminDashboard | Admin |
| `/admin/courses` | CourseManagement | Admin |
| `/admin/professors` | ProfessorManagement | Admin |
| `/admin/students` | StudentManagement | Admin |

### 5.4 State Management

**AuthContext provides:**
- `user` - Current user data (id, username, role)
- `login(credentials)` - Async login function
- `logout()` - Logout function
- `isAuthenticated` - Boolean authentication status

### 5.5 Development Server Configuration

| Setting | Value |
|---------|-------|
| Port | 4153 |
| Host | localhost |
| Hot Module Replacement | Enabled |

---

## 6. Authentication & Authorization

### 6.1 Authentication Flow

| Step | Action |
|------|--------|
| 1 | User submits credentials (username + password) |
| 2 | Backend validates credentials against database |
| 3 | If valid: Generate auth token/session |
| 4 | If invalid: Return 401 Unauthorized |
| 5 | Frontend stores auth state in AuthContext |
| 6 | Subsequent requests include auth token |
| 7 | Backend validates token on protected endpoints |

### 6.2 Role-Based Access Control

| Role | Accessible Routes | Permissions |
|------|-------------------|-------------|
| Student | `/student/*` | View profile, registration, grades |
| Admin | `/admin/*` | Full CRUD on courses, professors, students |
| Professor | `/professor/*` | View courses, manage grades (future scope) |

### 6.3 Route Protection

- Unauthenticated users accessing protected routes are redirected to `/login`
- Role mismatch (e.g., student accessing `/admin`) redirects to appropriate dashboard
- Logout clears auth state and redirects to login

---

## 7. Data Transfer Objects (DTOs)

### 7.1 Professor DTOs

**CreateProfessorDto:**
| Property | Type | Required |
|----------|------|----------|
| Name | string | Yes |
| Email | string | Yes |
| Department | string | Yes |
| PhoneNumber | string | No |

**UpdateProfessorDto:**
| Property | Type | Required |
|----------|------|----------|
| Id | int | Yes |
| Name | string | Yes |
| Email | string | Yes |
| Department | string | Yes |
| PhoneNumber | string | No |

**RViewProfessorDto:**
| Property | Type | Description |
|----------|------|-------------|
| Id | int | Professor ID |
| Name | string | Professor name |
| Email | string | Professor email |
| Department | string | Department name |
| CourseCount | int | Number of assigned courses |
| ProfessorNotFound | bool | True if professor doesn't exist |

**RDeleteProfessorDto:**
| Property | Type | Description |
|----------|------|-------------|
| Success | bool | True if deletion succeeded |
| ProfessorNotFound | bool | True if professor doesn't exist |

### 7.2 Student Registration DTO

**StudentRegistrationDto (Frontend Form):**
| Property | Type | Required |
|----------|------|----------|
| fullName | string | Yes |
| studentNumber | string | Yes |
| major | string | No |
| phoneNumber | string | No |
| dateOfBirth | string (date) | No |

---

## 8. Error Handling

### 8.1 Backend Error Handling

| Scenario | Response |
|----------|----------|
| Validation failure | 400 Bad Request with error details |
| Resource not found | DTO with `NotFound: true` flag or 404 |
| Unauthorized access | 401 Unauthorized |
| Server error | 500 Internal Server Error |

### 8.2 Frontend Error Handling

| Scenario | Handling |
|----------|----------|
| API call failure | Try-catch with user-friendly message |
| Network error | Display connection error message |
| Form validation | Inline validation messages |
| Auth failure | Redirect to login page |

### 8.3 Standard Error Response Format

| Property | Type | Description |
|----------|------|-------------|
| success | bool | Operation success status |
| message | string | Error description |
| errors | string[] | List of validation errors |

---

## 9. Deployment Specifications

### 9.1 Frontend Build

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Production build (outputs to `dist/`) |

### 9.2 Backend Build

| Command | Purpose |
|---------|---------|
| `dotnet restore` | Restore NuGet packages |
| `dotnet run` | Start development server |
| `dotnet publish -c Release` | Production build |

### 9.3 Environment URLs

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| Development | http://localhost:4153 | http://localhost:5000 | LocalDB |
| Production | https://[domain] | https://[domain]/api | SQL Server |

### 9.4 CORS Configuration

Backend must allow requests from frontend origin:

| Setting | Value |
|---------|-------|
| Allowed Origins | `http://localhost:4153` (dev) |
| Allowed Methods | GET, POST, PUT, DELETE |
| Allowed Headers | Any |

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 19/12/2025 | Youssef Zein | Initial specifications document |