import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import CourseModal from "./CourseModal";

export default function AdminCoursesPage() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInitial, setModalInitial] = useState(null);

    const getId = (course) =>
        course?.courseCode ?? course?.CourseCode ?? course?.code ?? course?.id ?? null;

    const loadCourses = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get("/CourseFactory");
            setCourses(res.data ?? []);
        } catch (err) {
            setError("Failed to load courses.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCourses();
    }, []);

    const openCreate = () => {
        setModalInitial(null);
        setModalOpen(true);
    };

    const openEdit = (course) => {
        setModalInitial(course);
        setModalOpen(true);
    };

    const handleDelete = async (courseCode) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await axiosClient.delete("/CourseFactory", { data: { Code: courseCode } });
            await loadCourses();
        } catch (err) {
            alert("Failed to delete.");
            console.error(err);
        }
    };

    const toggleExpanded = (courseCode) => {
        setCourses((prev) => prev.map((c) => (getId(c) === courseCode ? { ...c, expanded: !c.expanded } : c)));
    };

    // ===== STYLES =====
    const pageStyle = {
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#0b0b0c",
        color: "white",
        padding: "2rem",
        boxSizing: "border-box",
        overflowY: "auto",
    };

    const cardStyle = {
        width: "100%",
        maxWidth: 1100,
        background: "#0f0f10",
        borderRadius: 12,
        padding: "2rem",
        boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
        boxSizing: "border-box",
    };

    const headerStyle = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
        flexWrap: "wrap",
        gap: 12,
    };

    const titleBlock = {
        display: "flex",
        flexDirection: "column",
        gap: 4,
    };

    const backLinkStyle = {
        color: "#4cf",
        textDecoration: "none",
        fontSize: 14,
    };

    const primaryButton = {
        background: "#2b6cff",
        color: "white",
        padding: "0.7rem 1rem",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
    };

    const neutralButton = {
        background: "#111",
        color: "white",
        padding: "0.5rem 0.8rem",
        borderRadius: 6,
        border: "1px solid #333",
        cursor: "pointer",
    };

    const deleteButton = {
        ...neutralButton,
        color: "#ff4d4d",
        borderColor: "#ff4d4d",
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 12,
    };

    const thStyle = {
        padding: 14,
        textAlign: "left",
        borderBottom: "1px solid #222",
        color: "#aaa",
        fontWeight: 600,
    };

    const tdStyle = {
        padding: 14,
        borderBottom: "1px solid #1a1a1a",
    };

    const expandedRowStyle = {
        background: "#0a0a0a",
        padding: 16,
    };

    // ===== RENDER =====
    if (loading) {
        return (
            <div style={pageStyle}>
                <p>Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={cardStyle}>
                <div style={headerStyle}>
                    <div style={titleBlock}>
                        <Link to="/admin" style={backLinkStyle}>← Back to Dashboard</Link>
                        <h1 style={{ margin: 0, fontSize: "2rem" }}>Course Management</h1>
                        <div style={{ color: "#888", fontSize: 14 }}>
                            Logged in as: <strong style={{ color: "white" }}>{user?.username}</strong>
                        </div>
                    </div>

                    <button onClick={openCreate} style={primaryButton}>+ Create New Course</button>
                </div>

                <table style={tableStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Title</th>
                            <th style={thStyle}>Code</th>
                            <th style={thStyle}>Credit Hours</th>
                            <th style={thStyle}>Professor</th>
                            <th style={thStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ ...tdStyle, textAlign: "center", color: "#888" }}>
                                    No courses found. Create one to get started.
                                </td>
                            </tr>
                        )}
                        {courses.map((c) => {
                            const cid = getId(c);
                            return (
                                <React.Fragment key={cid ?? Math.random()}>
                                    <tr>
                                        <td style={tdStyle}>{c.title}</td>
                                        <td style={tdStyle}>{c.courseCode ?? c.code}</td>
                                        <td style={tdStyle}>{c.creditHours}</td>
                                        <td style={tdStyle}>{c.professorName ?? "Not Assigned"}</td>
                                        <td style={tdStyle}>
                                            <button onClick={() => openEdit(c)} style={{ ...neutralButton, marginRight: 8 }}>Edit</button>
                                            <button onClick={() => handleDelete(cid)} style={{ ...deleteButton, marginRight: 8 }}>Delete</button>
                                            <button onClick={() => toggleExpanded(cid)} style={neutralButton}>
                                                {c.expanded ? "Hide" : "View"} Students
                                            </button>
                                        </td>
                                    </tr>

                                    {c.expanded && (
                                        <tr>
                                            <td colSpan={5} style={expandedRowStyle}>
                                                <strong>Enrolled Students</strong>
                                                {(!c.enrolledStudents || c.enrolledStudents.length === 0) ? (
                                                    <div style={{ paddingTop: 8, color: "#888" }}>No students enrolled.</div>
                                                ) : (
                                                    <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                                                        {c.enrolledStudents.map((s, idx) => (
                                                            <li key={idx} style={{ padding: "4px 0" }}>
                                                                {s.name ?? s.Name ?? s.studentId}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <CourseModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                initialCourse={modalInitial}
                refresh={loadCourses}
            />
        </div>
    );
}