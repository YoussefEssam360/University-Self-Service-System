// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

// Import Admin/Public Pages
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminCoursesPage from "./pages/AdminCoursesPage.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";

// ⭐️ Import Student Components (based on your structure src/pages/Student/) ⭐️
import StudentLayout from "./pages/Student/StudentLayout";
import StudentRegistrationPage from "./pages/Student/StudentRegistrationPage";

// Simple Student Courses placeholder
const StudentCoursesPage = () => (
    <div style={{ color: '#ffffff' }}>No current enrolled courses.</div>
);

function App() {
    // ⭐️ Updated: Get all necessary auth states ⭐️
    const { isAdmin, isAuthenticated, user } = useAuth();

    // Helper function to determine the correct landing page after a successful login
    const getLandingPage = () => {
        if (!isAuthenticated) return "/login";

        // Route based on role stored in the 'user' object from AuthContext
        switch (user.role) {
            case "Admin":
                return "/admin";
            case "Student":
                // Students land directly on the registration page
                return "/student/register";
            // Add other roles here if needed (e.g., Professor)
            default:
                // Fallback if authenticated but role is unknown/unhandled
                return "/login";
        }
    };

    return (
        <Routes>

            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* ⭐️ STUDENT ROUTES: Protected and Nested ⭐️ */}
            <Route
                path="/student"
                element={
                    // Auth Guard: User must be logged in AND have the 'Student' role
                    isAuthenticated && user.role === "Student"
                        ? <StudentLayout />
                        : <Navigate to="/login" />
                }
            >
                {/* Redirect index to registration so Dashboard is never shown */}
                <Route index element={<Navigate to="register" replace />} />

                {/* Registration page: Matches /student/register */}
                <Route path="register" element={<StudentRegistrationPage />} />

                {/* My courses page: Matches /student/courses */}
                <Route path="courses" element={<StudentCoursesPage />} />

            </Route>


            {/* Protected Admin Routes (from your original file) */}
            <Route
                path="/admin"
                element={isAdmin ? <AdminDashboard /> : <Navigate to="/login" />}
            />

            <Route
                path="/admin/courses"
                element={isAdmin ? <AdminCoursesPage /> : <Navigate to="/login" />}
            />

            <Route
                path="/admin/courses/new"
                element={isAdmin ? <CreateCoursePage /> : <Navigate to="/login" />}
            />

            {/* Default fall-back: Redirects to the appropriate page or login */}
            <Route path="*" element={<Navigate to={getLandingPage()} />} />

        </Routes>
    );
}

export default App;