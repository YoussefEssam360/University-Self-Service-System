// src/pages/Student/StudentLayout.jsx
import React from 'react';
import StudentNavDashboard from "./StudentNavDashboard.jsx";
import { Outlet } from 'react-router-dom';
import './StudentLayout.css';

export default function StudentLayout() {
    return (
        <div className="student-root">
            <StudentNavDashboard />

            <main className="student-content">
                <Outlet />
            </main>
        </div>
    );
}