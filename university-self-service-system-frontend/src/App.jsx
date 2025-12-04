// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminCoursesPage from "./pages/AdminCoursesPage.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";

function App() {
    const { isAdmin } = useAuth();

    return (
        <Routes>

            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected admin routes */}
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

            {/* Default fall-back */}
            <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
    );
}

export default App;
