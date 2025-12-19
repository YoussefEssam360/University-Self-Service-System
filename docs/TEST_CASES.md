# Test Cases Document
## University Self-Service System

**Project Name:** University Self-Service System  
**Version:** 1.0  
**Date:** 19/12/2025
**Prepared By:** Youssef Zein

---

## Table of Contents
1. [Authentication Module](#1-authentication-module)
2. [Student Module](#2-student-module)
3. [Admin Dashboard Module](#3-admin-dashboard-module)
4. [Professor Management Module](#4-professor-management-module)
5. [Course Management Module](#5-course-management-module)

---

## 1. Authentication Module

### TC-AUTH-001: Successful Login with Valid Credentials
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-001 |
| **Test Title** | Successful Login with Valid Credentials |
| **Module** | Authentication |
| **Priority** | High |
| **Preconditions** | User account exists in the system |
| **Test Steps** | 1. Navigate to login page<br>2. Enter valid username<br>3. Enter valid password<br>4. Click "Login" button |
| **Test Data** | Username: `student1`, Password: `validPassword123` |
| **Expected Result** | User is redirected to their respective dashboard (Student/Admin) based on role |
| **Postconditions** | User session is created, auth token is stored |

### TC-AUTH-002: Login Failure with Invalid Password
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-002 |
| **Test Title** | Login Failure with Invalid Password |
| **Module** | Authentication |
| **Priority** | High |
| **Preconditions** | User account exists in the system |
| **Test Steps** | 1. Navigate to login page<br>2. Enter valid username<br>3. Enter invalid password<br>4. Click "Login" button |
| **Test Data** | Username: `student1`, Password: `wrongPassword` |
| **Expected Result** | Error message displayed: "Invalid credentials" |
| **Postconditions** | User remains on login page, no session created |

### TC-AUTH-003: Login Failure with Non-existent User
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-003 |
| **Test Title** | Login Failure with Non-existent User |
| **Module** | Authentication |
| **Priority** | High |
| **Preconditions** | None |
| **Test Steps** | 1. Navigate to login page<br>2. Enter non-existent username<br>3. Enter any password<br>4. Click "Login" button |
| **Test Data** | Username: `nonexistent_user`, Password: `anyPassword` |
| **Expected Result** | Error message displayed: "User not found" or "Invalid credentials" |
| **Postconditions** | User remains on login page |

### TC-AUTH-004: Login with Empty Fields
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-004 |
| **Test Title** | Login with Empty Fields |
| **Module** | Authentication |
| **Priority** | Medium |
| **Preconditions** | None |
| **Test Steps** | 1. Navigate to login page<br>2. Leave username field empty<br>3. Leave password field empty<br>4. Click "Login" button |
| **Test Data** | Username: `""`, Password: `""` |
| **Expected Result** | Validation error displayed, form not submitted |
| **Postconditions** | User remains on login page |

### TC-AUTH-005: Successful Logout
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-005 |
| **Test Title** | Successful Logout |
| **Module** | Authentication |
| **Priority** | High |
| **Preconditions** | User is logged in |
| **Test Steps** | 1. Click "Logout" button |
| **Test Data** | N/A |
| **Expected Result** | User is redirected to login page, session is destroyed |
| **Postconditions** | Auth token is removed, user cannot access protected routes |

### TC-AUTH-006: Role-Based Redirection After Login
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-AUTH-006 |
| **Test Title** | Role-Based Redirection After Login |
| **Module** | Authentication |
| **Priority** | High |
| **Preconditions** | Admin and Student accounts exist |
| **Test Steps** | 1. Login with admin credentials<br>2. Verify redirect to Admin Dashboard<br>3. Logout<br>4. Login with student credentials<br>5. Verify redirect to Student Dashboard |
| **Test Data** | Admin: `admin1/adminPass`, Student: `student1/studentPass` |
| **Expected Result** | Admin goes to `/admin`, Student goes to `/student` |
| **Postconditions** | User sees appropriate dashboard |

---

## 2. Student Module

### TC-STU-001: View Student Dashboard
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-001 |
| **Test Title** | View Student Dashboard |
| **Module** | Student |
| **Priority** | High |
| **Preconditions** | Student is logged in |
| **Test Steps** | 1. Login as student<br>2. Observe dashboard content |
| **Test Data** | N/A |
| **Expected Result** | Dashboard displays with navigation links (Dashboard, Registration, Grades) and user info |
| **Postconditions** | None |

### TC-STU-002: Navigate to Registration Page
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-002 |
| **Test Title** | Navigate to Registration Page |
| **Module** | Student |
| **Priority** | High |
| **Preconditions** | Student is logged in |
| **Test Steps** | 1. Click "Registration" link in navigation |
| **Test Data** | N/A |
| **Expected Result** | Registration form is displayed with all required fields |
| **Postconditions** | URL changes to `/student/register` |

### TC-STU-003: Submit Registration with Valid Data
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-003 |
| **Test Title** | Submit Registration with Valid Data |
| **Module** | Student |
| **Priority** | High |
| **Preconditions** | Student is on Registration page |
| **Test Steps** | 1. Enter full name<br>2. Enter student number<br>3. Enter major<br>4. Enter phone number<br>5. Enter date of birth<br>6. Click "Save registration" |
| **Test Data** | Full Name: `John Doe`, Student Number: `STU001`, Major: `Computer Science`, Phone: `555-1234`, DOB: `2000-01-15` |
| **Expected Result** | Registration is submitted successfully, confirmation message displayed |
| **Postconditions** | Student profile data is saved |

### TC-STU-004: Submit Registration with Missing Required Fields
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-004 |
| **Test Title** | Submit Registration with Missing Required Fields |
| **Module** | Student |
| **Priority** | High |
| **Preconditions** | Student is on Registration page |
| **Test Steps** | 1. Leave "Full name" field empty<br>2. Leave "Student number" field empty<br>3. Click "Save registration" |
| **Test Data** | Full Name: `""`, Student Number: `""` |
| **Expected Result** | Form validation prevents submission, required fields highlighted |
| **Postconditions** | Form not submitted |

### TC-STU-005: Registration Form Field Validation - Phone Number Format
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-005 |
| **Test Title** | Registration Form Field Validation - Phone Number Format |
| **Module** | Student |
| **Priority** | Medium |
| **Preconditions** | Student is on Registration page |
| **Test Steps** | 1. Enter invalid phone number format<br>2. Fill other required fields<br>3. Click "Save registration" |
| **Test Data** | Phone: `abc-invalid` |
| **Expected Result** | Validation error for phone number format (if validation implemented) |
| **Postconditions** | Form not submitted if validation fails |

### TC-STU-006: Navigate to Grades Page
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-006 |
| **Test Title** | Navigate to Grades Page |
| **Module** | Student |
| **Priority** | High |
| **Preconditions** | Student is logged in |
| **Test Steps** | 1. Click "Grades" link in navigation |
| **Test Data** | N/A |
| **Expected Result** | Grades page is displayed |
| **Postconditions** | URL changes to `/student/grades` |

### TC-STU-007: Student Navigation Active State
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-007 |
| **Test Title** | Student Navigation Active State |
| **Module** | Student |
| **Priority** | Low |
| **Preconditions** | Student is logged in |
| **Test Steps** | 1. Click on each navigation link<br>2. Verify active state styling |
| **Test Data** | N/A |
| **Expected Result** | Active navigation link has "active" class applied |
| **Postconditions** | None |

### TC-STU-008: Display Logged-in Username
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-STU-008 |
| **Test Title** | Display Logged-in Username |
| **Module** | Student |
| **Priority** | Medium |
| **Preconditions** | Student is logged in |
| **Test Steps** | 1. Observe header area after login |
| **Test Data** | N/A |
| **Expected Result** | Username is displayed in the header (e.g., "student1" or user's name) |
| **Postconditions** | None |

---

## 3. Admin Dashboard Module

### TC-ADM-001: View Admin Dashboard
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ADM-001 |
| **Test Title** | View Admin Dashboard |
| **Module** | Admin |
| **Priority** | High |
| **Preconditions** | Admin is logged in |
| **Test Steps** | 1. Login as admin<br>2. Observe dashboard content |
| **Test Data** | N/A |
| **Expected Result** | Dashboard displays with welcome message and management links |
| **Postconditions** | None |

### TC-ADM-002: Navigate to Course Management
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ADM-002 |
| **Test Title** | Navigate to Course Management |
| **Module** | Admin |
| **Priority** | High |
| **Preconditions** | Admin is on dashboard |
| **Test Steps** | 1. Click "Course Management" button |
| **Test Data** | N/A |
| **Expected Result** | Redirected to `/admin/courses` page |
| **Postconditions** | Course management interface displayed |

### TC-ADM-003: Navigate to Professor Management
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ADM-003 |
| **Test Title** | Navigate to Professor Management |
| **Module** | Admin |
| **Priority** | High |
| **Preconditions** | Admin is on dashboard |
| **Test Steps** | 1. Click "Professor Management" button |
| **Test Data** | N/A |
| **Expected Result** | Redirected to `/admin/professors` page |
| **Postconditions** | Professor management interface displayed |

### TC-ADM-004: Navigate to Student Management
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ADM-004 |
| **Test Title** | Navigate to Student Management |
| **Module** | Admin |
| **Priority** | High |
| **Preconditions** | Admin is on dashboard |
| **Test Steps** | 1. Click "Student Management" button |
| **Test Data** | N/A |
| **Expected Result** | Redirected to `/admin/students` page |
| **Postconditions** | Student management interface displayed |

### TC-ADM-005: Admin Logout from Dashboard
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ADM-005 |
| **Test Title** | Admin Logout from Dashboard |
| **Module** | Admin |
| **Priority** | High |
| **Preconditions** | Admin is logged in |
| **Test Steps** | 1. Click "Logout" button on dashboard |
| **Test Data** | N/A |
| **Expected Result** | Admin is logged out and redirected to login page |
| **Postconditions** | Session destroyed |

---

## 4. Professor Management Module

### TC-PROF-001: View All Professors
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-001 |
| **Test Title** | View All Professors |
| **Module** | Professor Management |
| **Priority** | High |
| **Preconditions** | Admin is logged in, professors exist in database |
| **Test Steps** | 1. Navigate to Professor Management<br>2. View list of professors |
| **Test Data** | N/A |
| **Expected Result** | List displays all professors with Id, Name, Email, Department, CourseCount |
| **Postconditions** | None |

### TC-PROF-002: View Professor by ID
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-002 |
| **Test Title** | View Professor by ID |
| **Module** | Professor Management |
| **Priority** | Medium |
| **Preconditions** | Professor with ID exists |
| **Test Steps** | 1. Request professor details by ID |
| **Test Data** | Professor ID: `1` |
| **Expected Result** | Professor details returned (Id, Name, Email, Department, CourseCount) |
| **Postconditions** | None |

### TC-PROF-003: View Professor by ID - Not Found
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-003 |
| **Test Title** | View Professor by ID - Not Found |
| **Module** | Professor Management |
| **Priority** | Medium |
| **Preconditions** | Professor with ID does not exist |
| **Test Steps** | 1. Request professor details by non-existent ID |
| **Test Data** | Professor ID: `9999` |
| **Expected Result** | Response with `ProfessorNotFound: true` |
| **Postconditions** | None |

### TC-PROF-004: Create New Professor with Valid Data
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-004 |
| **Test Title** | Create New Professor with Valid Data |
| **Module** | Professor Management |
| **Priority** | High |
| **Preconditions** | Admin is logged in |
| **Test Steps** | 1. Navigate to Professor Management<br>2. Click "Add Professor"<br>3. Fill all required fields<br>4. Submit form |
| **Test Data** | Name: `Dr. Jane Smith`, Email: `jsmith@university.edu`, Department: `Computer Science`, Phone: `555-9876` |
| **Expected Result** | Professor created successfully, appears in list |
| **Postconditions** | New professor record in database |

### TC-PROF-005: Create Professor with Duplicate Email
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-005 |
| **Test Title** | Create Professor with Duplicate Email |
| **Module** | Professor Management |
| **Priority** | Medium |
| **Preconditions** | Professor with email already exists |
| **Test Steps** | 1. Attempt to create professor with existing email |
| **Test Data** | Email: `existing@university.edu` |
| **Expected Result** | Error message indicating duplicate email |
| **Postconditions** | Professor not created |

### TC-PROF-006: Update Professor Information
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-006 |
| **Test Title** | Update Professor Information |
| **Module** | Professor Management |
| **Priority** | High |
| **Preconditions** | Professor exists in database |
| **Test Steps** | 1. Select professor to edit<br>2. Modify department field<br>3. Save changes |
| **Test Data** | Professor ID: `1`, New Department: `Mathematics` |
| **Expected Result** | Professor updated successfully, changes reflected in list |
| **Postconditions** | Database record updated |

### TC-PROF-007: Delete Professor
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-007 |
| **Test Title** | Delete Professor |
| **Module** | Professor Management |
| **Priority** | High |
| **Preconditions** | Professor exists with no assigned courses |
| **Test Steps** | 1. Select professor to delete<br>2. Confirm deletion |
| **Test Data** | Professor ID: `1` |
| **Expected Result** | Professor deleted, `Success: true` returned |
| **Postconditions** | Professor removed from database |

### TC-PROF-008: Delete Non-existent Professor
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-PROF-008 |
| **Test Title** | Delete Non-existent Professor |
| **Module** | Professor Management |
| **Priority** | Medium |
| **Preconditions** | None |
| **Test Steps** | 1. Attempt to delete professor with invalid ID |
| **Test Data** | Professor ID: `9999` |
| **Expected Result** | Response with `ProfessorNotFound: true`, `Success: false` |
| **Postconditions** | None |

---

## 5. Course Management Module

### TC-CRS-001: View All Courses
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-001 |
| **Test Title** | View All Courses |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Admin is logged in, courses exist |
| **Test Steps** | 1. Navigate to Course Management<br>2. View list of courses |
| **Test Data** | N/A |
| **Expected Result** | List displays all courses with Code, Title, CreditHours, InstructorName, Dates |
| **Postconditions** | None |

### TC-CRS-002: Create New Course with Valid Data
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-002 |
| **Test Title** | Create New Course with Valid Data |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Admin is logged in |
| **Test Steps** | 1. Click "Add Course"<br>2. Fill Code, Title, CreditHours, InstructorName, StartDate, EndDate<br>3. Submit |
| **Test Data** | Code: `CS101`, Title: `Intro to Programming`, CreditHours: `3`, StartDate: `2025-01-15`, EndDate: `2025-05-15` |
| **Expected Result** | Course created successfully |
| **Postconditions** | New course in database |

### TC-CRS-003: Create Course with Missing Required Fields
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-003 |
| **Test Title** | Create Course with Missing Required Fields |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Admin is logged in |
| **Test Steps** | 1. Click "Add Course"<br>2. Leave Code field empty<br>3. Submit |
| **Test Data** | Code: `""` |
| **Expected Result** | Validation error, course not created |
| **Postconditions** | None |

### TC-CRS-004: Update Course Information
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-004 |
| **Test Title** | Update Course Information |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Course exists |
| **Test Steps** | 1. Select course to edit<br>2. Modify CreditHours<br>3. Save |
| **Test Data** | Course ID: `1`, New CreditHours: `4` |
| **Expected Result** | Course updated successfully |
| **Postconditions** | Database updated |

### TC-CRS-005: Delete Course
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-005 |
| **Test Title** | Delete Course |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Course exists |
| **Test Steps** | 1. Select course<br>2. Click delete<br>3. Confirm |
| **Test Data** | Course ID: `1` |
| **Expected Result** | Course deleted successfully |
| **Postconditions** | Course removed from database |

### TC-CRS-006: Assign Professor to Course
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-CRS-006 |
| **Test Title** | Assign Professor to Course |
| **Module** | Course Management |
| **Priority** | High |
| **Preconditions** | Course and Professor exist |
| **Test Steps** | 1. Edit course<br>2. Select professor from dropdown<br>3. Save |
| **Test Data** | Course ID: `1`, Professor ID: `1` |
| **Expected Result** | Course updated with ProfessorId, InstructorName reflects professor |
| **Postconditions** | Course-Professor relationship established |

---

## 6. Enrollment Module

### TC-ENR-001: Student Enrolls in Course
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ENR-001 |
| **Test Title** | Student Enrolls in Course |
| **Module** | Enrollment |
| **Priority** | High |
| **Preconditions** | Student logged in, course available |
| **Test Steps** | 1. Browse available courses<br>2. Select course<br>3. Click "Enroll" |
| **Test Data** | Student ID: `1`, Course ID: `1` |
| **Expected Result** | Enrollment created with EnrolledAt timestamp |
| **Postconditions** | Enrollment record in database |

### TC-ENR-002: View Student Enrollments
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ENR-002 |
| **Test Title** | View Student Enrollments |
| **Module** | Enrollment |
| **Priority** | High |
| **Preconditions** | Student has enrollments |
| **Test Steps** | 1. Navigate to enrolled courses page |
| **Test Data** | N/A |
| **Expected Result** | List of enrolled courses displayed with grades (if assigned) |
| **Postconditions** | None |

### TC-ENR-003: Prevent Duplicate Enrollment
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-ENR-003 |
| **Test Title** | Prevent Duplicate Enrollment |
| **Module** | Enrollment |
| **Priority** | Medium |
| **Preconditions** | Student already enrolled in course |
| **Test Steps** | 1. Attempt to enroll in same course again |
| **Test Data** | Student ID: `1`, Course ID: `1` (already enrolled) |
| **Expected Result** | Error message: "Already enrolled in this course" |
| **Postconditions** | No duplicate record created |

---

## 7. API Integration Tests

### TC-API-001: Backend Health Check
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-API-001 |
| **Test Title** | Backend Health Check |
| **Module** | API |
| **Priority** | High |
| **Preconditions** | Backend server running |
| **Test Steps** | 1. Send GET request to health endpoint |
| **Test Data** | Endpoint: `/api/health` or base URL |
| **Expected Result** | HTTP 200 OK response |
| **Postconditions** | None |

### TC-API-002: CORS Configuration
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-API-002 |
| **Test Title** | CORS Configuration |
| **Module** | API |
| **Priority** | High |
| **Preconditions** | Frontend running on port 4153 |
| **Test Steps** | 1. Make API call from frontend to backend |
| **Test Data** | N/A |
| **Expected Result** | No CORS errors, request successful |
| **Postconditions** | None |

### TC-API-003: Invalid Endpoint Returns 404
| Field | Description |
|-------|-------------|
| **Test Case ID** | TC-API-003 |
| **Test Title** | Invalid Endpoint Returns 404 |
| **Module** | API |
| **Priority** | Low |
| **Preconditions** | Backend running |
| **Test Steps** | 1. Send GET request to non-existent endpoint |
| **Test Data** | Endpoint: `/api/nonexistent` |
| **Expected Result** | HTTP 404 Not Found |
| **Postconditions** | None |

---

## Test Summary Matrix

| Module | Total Tests | High Priority | Medium Priority | Low Priority |
|--------|-------------|---------------|-----------------|--------------|
| Authentication | 6 | 5 | 1 | 0 |
| Student | 8 | 5 | 2 | 1 |
| Admin Dashboard | 5 | 5 | 0 | 0 |
| Professor Management | 8 | 4 | 4 | 0 |
| Course Management | 6 | 5 | 0 | 1 |
| Enrollment | 3 | 2 | 1 | 0 |
| API Integration | 3 | 2 | 0 | 1 |
| **Total** | **39** | **28** | **8** | **3** |

---

## Summary of what's included:
| Module |              | Test Cases |

Authentication	        6 test cases (login, logout, validation, role-based redirect)
Student	                8 test cases (registration form, navigation, validation)
Admin Dashboard	        5 test cases (navigation to management pages)
Professor Management	8 test cases (CRUD operations)
Course Management	    6 test cases (CRUD operations, professor assignment)
Enrollment	            3 test cases (enroll, view, duplicate prevention)
API Integration	        3 test cases (health, CORS, error handling)

---

## Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 19/12/2025 | Youssef Zein | Initial test case document |

---