// src/pages/AdminDashboard.jsx
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: "20px" }}>
            <h1>Admin Dashboard</h1>

            <p>
                Welcome, <strong>{user?.username}</strong> (Admin)
            </p>

            <button onClick={logout} style={{ marginBottom: "20px" }}>
                Logout
            </button>

            <h3>Course Management</h3>

            <ul>
                <li><Link to="/admin/courses">View all courses</Link></li>
                {/* Removed the old "Create course" link */}
            </ul>
        </div>
    );
}

export default AdminDashboard;