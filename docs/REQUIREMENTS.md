# Software Requirements Document (SRD)
## University Self-Service System

**Project Name:** University Self-Service System  
**Version:** 1.0  
**Date:** 19/12/2025  
**Prepared By:** Youssef Zein

---

## Table of Contents
1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [User Requirements](#5-user-requirements)
6. [System Requirements](#6-system-requirements)
7. [Assumptions and Dependencies](#7-assumptions-and-dependencies)

---

## 1. Introduction

### 1.1 Purpose
This document defines the software requirements for the University Self-Service System, a web-based application that enables students, professors, and administrators to manage academic activities including course registration, grade viewing, and user management.

### 1.2 Scope
The University Self-Service System provides:
- Student self-service portal for registration and grade viewing
- Administrative dashboard for managing courses, professors, and students
- Role-based authentication and authorization
- RESTful API backend with React frontend

### 1.3 Definitions and Acronyms

| Term | Definition |
|------|------------|
| **SRS** | Software Requirements Specification |
| **API** | Application Programming Interface |
| **CRUD** | Create, Read, Update, Delete |
| **JWT** | JSON Web Token |
| **SPA** | Single Page Application |
| **Admin** | System Administrator |
| **UI** | User Interface |

### 1.4 References
- IEEE 830-1998 Standard for Software Requirements Specifications
- Project Test Cases Document (`docs/TEST_CASES.md`)
- Project Specifications Document (`docs/SPECIFICATIONS.md`)

---

## 2. Overall Description

### 2.1 Product Perspective
The University Self-Service System is a standalone web application consisting of:
- **Frontend:** React-based Single Page Application (SPA)
- **Backend:** ASP.NET Core 9 Web API
- **Database:** SQL Server (Entity Framework Core)

### 2.2 Product Functions
The system provides the following high-level functions:

| Function | Description |
|----------|-------------|
| User Authentication | Login, logout, and session management |
| Student Registration | Students can submit/update their profile information |
| Grade Viewing | Students can view their academic grades |
| Course Management | Admins can create, update, and delete courses |
| Professor Management | Admins can manage professor records |
| Student Management | Admins can manage student records |
| Enrollment Management | Students can enroll in courses |

### 2.3 User Classes and Characteristics

| User Class | Description | Technical Proficiency |
|------------|-------------|----------------------|
| **Student** | University students accessing self-service features | Basic computer skills |
| **Administrator** | Staff managing system data and users | Intermediate technical skills |
| **Professor** | Faculty members (future scope) | Basic computer skills |

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Server:** Windows/Linux server with .NET 9 runtime
- **Database:** SQL Server 2019 or later

### 2.5 Design and Implementation Constraints
- Must use React for frontend development
- Must use ASP.NET Core 9 for backend API
- Must follow RESTful API design principles
- Must implement role-based access control

---

## 3. Functional Requirements

### 3.1 Authentication Module

#### FR-AUTH-001: User Login
| Field | Description |
|-------|-------------|
| **ID** | FR-AUTH-001 |
| **Title** | User Login |
| **Priority** | High |
| **Description** | The system shall allow users to authenticate using username and password credentials. |
| **Input** | Username, Password |
| **Output** | Authentication token, User role, Redirect to appropriate dashboard |
| **Acceptance Criteria** | 1. Valid credentials grant access<br>2. Invalid credentials display error message<br>3. Empty fields are rejected with validation message |

#### FR-AUTH-002: User Logout
| Field | Description |
|-------|-------------|
| **ID** | FR-AUTH-002 |
| **Title** | User Logout |
| **Priority** | High |
| **Description** | The system shall allow authenticated users to log out and terminate their session. |
| **Input** | Logout action (button click) |
| **Output** | Session terminated, Redirect to login page |
| **Acceptance Criteria** | 1. Auth token is invalidated<br>2. User cannot access protected routes after logout |

#### FR-AUTH-003: Role-Based Redirection
| Field | Description |
|-------|-------------|
| **ID** | FR-AUTH-003 |
| **Title** | Role-Based Redirection |
| **Priority** | High |
| **Description** | The system shall redirect users to their respective dashboards based on their role after successful login. |
| **Input** | User role (from authentication) |
| **Output** | Redirect to `/student` for students, `/admin` for administrators |
| **Acceptance Criteria** | 1. Students see Student Dashboard<br>2. Admins see Admin Dashboard |

#### FR-AUTH-004: Protected Routes
| Field | Description |
|-------|-------------|
| **ID** | FR-AUTH-004 |
| **Title** | Protected Routes |
| **Priority** | High |
| **Description** | The system shall prevent unauthorized access to protected routes. |
| **Input** | Unauthenticated request to protected route |
| **Output** | Redirect to login page |
| **Acceptance Criteria** | 1. Unauthenticated users cannot access `/student/*` or `/admin/*` routes |

---

### 3.2 Student Module

#### FR-STU-001: View Student Dashboard
| Field | Description |
|-------|-------------|
| **ID** | FR-STU-001 |
| **Title** | View Student Dashboard |
| **Priority** | High |
| **Description** | The system shall display a dashboard for authenticated students with navigation to available features. |
| **Input** | Authenticated student session |
| **Output** | Dashboard with navigation links (Dashboard, Registration, Grades) |
| **Acceptance Criteria** | 1. Navigation links are visible<br>2. Username is displayed<br>3. Logout button is functional |

#### FR-STU-002: Student Registration Form
| Field | Description |
|-------|-------------|
| **ID** | FR-STU-002 |
| **Title** | Student Registration Form |
| **Priority** | High |
| **Description** | The system shall provide a form for students to submit their profile information. |
| **Input** | Full Name, Student Number, Major, Phone Number, Date of Birth |
| **Output** | Registration data saved, Confirmation message |
| **Acceptance Criteria** | 1. All fields are editable<br>2. Required fields are validated<br>3. Submission triggers backend API call |

#### FR-STU-003: Registration Field Validation
| Field | Description |
|-------|-------------|
| **ID** | FR-STU-003 |
| **Title** | Registration Field Validation |
| **Priority** | Medium |
| **Description** | The system shall validate required fields before form submission. |
| **Input** | Form data |
| **Output** | Validation errors for empty required fields |
| **Acceptance Criteria** | 1. Full Name is required<br>2. Student Number is required<br>3. Form does not submit if validation fails |

#### FR-STU-004: View Grades
| Field | Description |
|-------|-------------|
| **ID** | FR-STU-004 |
| **Title** | View Grades |
| **Priority** | High |
| **Description** | The system shall display the student's academic grades. |
| **Input** | Student ID (from session) |
| **Output** | List of courses with grades |
| **Acceptance Criteria** | 1. Grades page is accessible from navigation<br>2. Enrolled courses are displayed with grades |

#### FR-STU-005: Student Navigation
| Field | Description |
|-------|-------------|
| **ID** | FR-STU-005 |
| **Title** | Student Navigation |
| **Priority** | Medium |
| **Description** | The system shall provide navigation links with active state indication. |
| **Input** | Navigation click |
| **Output** | Route change, Active link highlighted |
| **Acceptance Criteria** | 1. Clicking link navigates to correct page<br>2. Active link has visual distinction |

---

### 3.3 Admin Module

#### FR-ADM-001: View Admin Dashboard
| Field | Description |
|-------|-------------|
| **ID** | FR-ADM-001 |
| **Title** | View Admin Dashboard |
| **Priority** | High |
| **Description** | The system shall display an administrative dashboard with management options. |
| **Input** | Authenticated admin session |
| **Output** | Dashboard with links to Course, Professor, and Student management |
| **Acceptance Criteria** | 1. Welcome message with username<br>2. Management buttons are visible and functional |

#### FR-ADM-002: Navigate to Management Pages
| Field | Description |
|-------|-------------|
| **ID** | FR-ADM-002 |
| **Title** | Navigate to Management Pages |
| **Priority** | High |
| **Description** | The system shall allow admins to navigate to Course, Professor, and Student management pages. |
| **Input** | Button click |
| **Output** | Route to respective management page |
| **Acceptance Criteria** | 1. Course Management navigates to `/admin/courses`<br>2. Professor Management navigates to `/admin/professors`<br>3. Student Management navigates to `/admin/students` |

---

### 3.4 Professor Management Module

#### FR-PROF-001: View All Professors
| Field | Description |
|-------|-------------|
| **ID** | FR-PROF-001 |
| **Title** | View All Professors |
| **Priority** | High |
| **Description** | The system shall display a list of all professors in the system. |
| **Input** | API request to `/api/ProfManagement` |
| **Output** | List of professors with Id, Name, Email, Department, CourseCount |
| **Acceptance Criteria** | 1. All professors are listed<br>2. Data is retrieved from backend API |

#### FR-PROF-002: View Professor by ID
| Field | Description |
|-------|-------------|
| **ID** | FR-PROF-002 |
| **Title** | View Professor by ID |
| **Priority** | Medium |
| **Description** | The system shall retrieve and display details of a specific professor. |
| **Input** | Professor ID |
| **Output** | Professor details or "Not Found" indicator |
| **Acceptance Criteria** | 1. Valid ID returns professor details<br>2. Invalid ID returns `ProfessorNotFound: true` |

#### FR-PROF-003: Create Professor
| Field | Description |
|-------|-------------|
| **ID** | FR-PROF-003 |
| **Title** | Create Professor |
| **Priority** | High |
| **Description** | The system shall allow admins to create new professor records. |
| **Input** | Name, Email, Department, Phone |
| **Output** | New professor record created |
| **Acceptance Criteria** | 1. Valid data creates professor<br>2. Professor appears in list after creation |

#### FR-PROF-004: Update Professor
| Field | Description |
|-------|-------------|
| **ID** | FR-PROF-004 |
| **Title** | Update Professor |
| **Priority** | High |
| **Description** | The system shall allow admins to update existing professor records. |
| **Input** | Professor ID, Updated fields |
| **Output** | Professor record updated |
| **Acceptance Criteria** | 1. Changes are persisted<br>2. Updated data is reflected in list |

#### FR-PROF-005: Delete Professor
| Field | Description |
|-------|-------------|
| **ID** | FR-PROF-005 |
| **Title** | Delete Professor |
| **Priority** | High |
| **Description** | The system shall allow admins to delete professor records. |
| **Input** | Professor ID |
| **Output** | Professor deleted, `Success: true` or `ProfessorNotFound: true` |
| **Acceptance Criteria** | 1. Valid ID deletes professor<br>2. Invalid ID returns not found |

---

### 3.5 Course Management Module

#### FR-CRS-001: View All Courses
| Field | Description |
|-------|-------------|
| **ID** | FR-CRS-001 |
| **Title** | View All Courses |
| **Priority** | High |
| **Description** | The system shall display a list of all courses. |
| **Input** | API request |
| **Output** | List of courses with Code, Title, CreditHours, InstructorName, Dates |
| **Acceptance Criteria** | 1. All courses are displayed<br>2. Course details are accurate |

#### FR-CRS-002: Create Course
| Field | Description |
|-------|-------------|
| **ID** | FR-CRS-002 |
| **Title** | Create Course |
| **Priority** | High |
| **Description** | The system shall allow admins to create new courses. |
| **Input** | Code, Title, CreditHours, StartDate, EndDate, ProfessorId |
| **Output** | New course created |
| **Acceptance Criteria** | 1. Required fields are validated<br>2. Course is created in database |

#### FR-CRS-003: Update Course
| Field | Description |
|-------|-------------|
| **ID** | FR-CRS-003 |
| **Title** | Update Course |
| **Priority** | High |
| **Description** | The system shall allow admins to update course information. |
| **Input** | Course ID, Updated fields |
| **Output** | Course updated |
| **Acceptance Criteria** | 1. Changes are persisted<br>2. Professor assignment can be modified |

#### FR-CRS-004: Delete Course
| Field | Description |
|-------|-------------|
| **ID** | FR-CRS-004 |
| **Title** | Delete Course |
| **Priority** | High |
| **Description** | The system shall allow admins to delete courses. |
| **Input** | Course ID |
| **Output** | Course deleted |
| **Acceptance Criteria** | 1. Course is removed from database<br>2. Related enrollments are handled |

---

### 3.6 Enrollment Module

#### FR-ENR-001: Enroll in Course
| Field | Description |
|-------|-------------|
| **ID** | FR-ENR-001 |
| **Title** | Enroll in Course |
| **Priority** | High |
| **Description** | The system shall allow students to enroll in available courses. |
| **Input** | Student ID, Course ID |
| **Output** | Enrollment record created with timestamp |
| **Acceptance Criteria** | 1. Enrollment is saved<br>2. Duplicate enrollment is prevented |

#### FR-ENR-002: View Enrollments
| Field | Description |
|-------|-------------|
| **ID** | FR-ENR-002 |
| **Title** | View Enrollments |
| **Priority** | High |
| **Description** | The system shall display a student's enrolled courses. |
| **Input** | Student ID |
| **Output** | List of enrolled courses with grades |
| **Acceptance Criteria** | 1. All enrollments are shown<br>2. Grade is displayed if assigned |

---

## 4. Non-Functional Requirements

### 4.1 Performance Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-001 | Page load time | < 3 seconds |
| NFR-PERF-002 | API response time | < 500ms for standard requests |
| NFR-PERF-003 | Concurrent users | Support minimum 100 concurrent users |

### 4.2 Security Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-SEC-001 | Authentication | All protected routes require valid authentication |
| NFR-SEC-002 | Password Storage | Passwords must be hashed (not stored in plaintext) |
| NFR-SEC-003 | Session Management | Sessions must expire after period of inactivity |
| NFR-SEC-004 | Input Validation | All user inputs must be validated and sanitized |
| NFR-SEC-005 | HTTPS | Production deployment must use HTTPS |

### 4.3 Usability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-USE-001 | Responsive Design | UI must be usable on desktop and tablet devices |
| NFR-USE-002 | Error Messages | Clear, user-friendly error messages |
| NFR-USE-003 | Navigation | Intuitive navigation with active state indication |
| NFR-USE-004 | Accessibility | Basic accessibility support (semantic HTML) |

### 4.4 Reliability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-REL-001 | Availability | System should be available 99% during academic hours |
| NFR-REL-002 | Data Integrity | Database transactions must maintain data integrity |
| NFR-REL-003 | Error Handling | Graceful error handling without system crashes |

### 4.5 Maintainability Requirements

| ID | Requirement | Description |
|----|-------------|-------------|
| NFR-MNT-001 | Code Structure | Separation of concerns (Controllers, Services, DTOs) |
| NFR-MNT-002 | Documentation | Code should be documented with comments |
| NFR-MNT-003 | Version Control | All code managed in Git repository |

---

## 5. User Requirements

### 5.1 Student User Requirements

| ID | Requirement |
|----|-------------|
| UR-STU-001 | Students shall be able to log in with their credentials |
| UR-STU-002 | Students shall be able to view and update their profile information |
| UR-STU-003 | Students shall be able to view their enrolled courses |
| UR-STU-004 | Students shall be able to view their grades |
| UR-STU-005 | Students shall be able to log out securely |

### 5.2 Administrator User Requirements

| ID | Requirement |
|----|-------------|
| UR-ADM-001 | Administrators shall be able to log in with admin credentials |
| UR-ADM-002 | Administrators shall be able to manage (CRUD) courses |
| UR-ADM-003 | Administrators shall be able to manage (CRUD) professors |
| UR-ADM-004 | Administrators shall be able to manage (CRUD) students |
| UR-ADM-005 | Administrators shall be able to assign professors to courses |

---

## 6. System Requirements

### 6.1 Hardware Requirements

| Component | Minimum Requirement |
|-----------|---------------------|
| Server CPU | 2 cores |
| Server RAM | 4 GB |
| Storage | 20 GB SSD |
| Network | 100 Mbps |

### 6.2 Software Requirements

| Component | Requirement |
|-----------|-------------|
| Operating System | Windows Server 2019+ or Linux (Ubuntu 20.04+) |
| Runtime | .NET 9 SDK/Runtime |
| Database | SQL Server 2019+ or SQL Server Express |
| Node.js | v18+ (for frontend build) |
| Web Server | Kestrel (built-in) or IIS |

### 6.3 Client Requirements

| Component | Requirement |
|-----------|-------------|
| Browser | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| JavaScript | Enabled |
| Screen Resolution | Minimum 1024x768 |

---

## 7. Assumptions and Dependencies

### 7.1 Assumptions

1. Users have stable internet connectivity
2. Users have modern web browsers with JavaScript enabled
3. University has existing student and staff data for import
4. Email addresses are unique per user
5. Student numbers are unique identifiers

### 7.2 Dependencies

| Dependency | Description |
|------------|-------------|
| React 18+ | Frontend framework |
| Vite | Frontend build tool |
| React Router | Client-side routing |
| ASP.NET Core 9 | Backend framework |
| Entity Framework Core | ORM for database access |
| SQL Server | Database management system |

### 7.3 Constraints

1. Development timeline limited to academic semester
2. Must use technologies specified by course requirements
3. Single-tenant application (one university)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 19/12/2025 | Youssef Zein | Initial requirements document |