// src/pages/Student/StudentNavDashboard.jsx (Horizontal top nav)
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './StudentLayout.css';

export default function StudentNavDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="student-header sticky">

            <div className="student-header-left">
                <div className="brand">Student Portal</div>

                <nav className="student-nav" aria-label="Student navigation">
                    <NavLink to="/student/register" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="nav-icon">📝</span>
                        <span>Registration</span>
                    </NavLink>

                    <NavLink to="/student/courses" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                        <span className="nav-icon">📚</span>
                        <span>My Courses</span>
                    </NavLink>
                </nav>
            </div>

            <div className="student-header-right">
                <span className="user-name">{user?.username ?? 'Student'}</span>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
            </div>
        </header>
    );
}