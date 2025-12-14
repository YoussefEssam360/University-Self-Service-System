// src/pages/AdminCoursesPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
// CourseModal lives in the same folder (src/pages)
import CourseModal from "./CourseModal";

export default function AdminCoursesPage() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [_editingCourse, _setEditingCourse] = useState(null); // prefixed to silence "assigned but never used"

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
        if (!window.confirm("Are you sure?")) return;
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

    if (loading) return <p style={{ color: "white" }}>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const panelStyle = {
        maxWidth: 1100,
        margin: "40px auto",
        color: "white",
        padding: "0 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // center everything horizontally
        boxSizing: "border-box",
    };

    const headerStyle = {
        display: "flex",
        flexDirection: "column", // stacked and centered
        justifyContent: "center",
        alignItems: "center",
        gap: 12,
        marginBottom: 20,
        width: "100%",
    };

    const tableWrapperStyle = {
        width: "100%",
        maxWidth: 900, // constrain table width, centered by parent
        background: "#0b0b0c",
        borderRadius: 8,
        padding: 12,
        boxSizing: "border-box",
    };

    const createButtonStyle = {
        padding: "0.6rem 0.9rem",
        borderRadius: 8,
    };

    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                <div style={{ width: "100%", textAlign: "center" }}>
                    <h1 style={{ margin: 0 }}>All Courses</h1>
                    <div style={{ marginTop: 6, color: "#bbb" }}>
                        Logged in as: <strong style={{ color: "white" }}>{user?.username}</strong>
                    </div>
                </div>

                <div>
                    <button onClick={openCreate} style={createButtonStyle}>+ Create New Course</button>
                </div>
            </div>

            <div style={tableWrapperStyle}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ textAlign: "left", color: "#ddd" }}>
                            <th style={{ padding: 12 }}>Title</th>
                            <th style={{ padding: 12 }}>Code</th>
                            <th style={{ padding: 12 }}>Credit Hours</th>
                            <th style={{ padding: 12 }}>Professor</th>
                            <th style={{ padding: 12 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: 20, textAlign: "center" }}>No courses found.</td>
                            </tr>
                        )}
                        {courses.map((c) => {
                            const cid = getId(c);
                            return (
                                <React.Fragment key={cid ?? Math.random()}>
                                    <tr style={{ borderTop: "1px solid #222" }}>
                                        <td style={{ padding: 12 }}>{c.title}</td>
                                        <td style={{ padding: 12 }}>{c.courseCode ?? c.code}</td>
                                        <td style={{ padding: 12 }}>{c.creditHours}</td>
                                        <td style={{ padding: 12 }}>{c.professorName ?? "Not Assigned"}</td>
                                        <td style={{ padding: 12 }}>
                                            <button onClick={() => openEdit(c)} style={{ marginRight: 8 }}>Edit</button>
                                            <button onClick={() => handleDelete(cid)} style={{ marginRight: 8, color: "red" }}>Delete</button>
                                            <button onClick={() => toggleExpanded(cid)}>{c.expanded ? "Hide" : "View"} Students</button>
                                        </td>
                                    </tr>

                                    {c.expanded && (
                                        <tr>
                                            <td colSpan={5} style={{ background: "#0a0a0a", padding: 12 }}>
                                                <strong>Enrolled Students</strong>
                                                {(!c.enrolledStudents || c.enrolledStudents.length === 0) ? (
                                                    <div style={{ paddingTop: 8 }}>No students enrolled.</div>
                                                ) : (
                                                    <ul style={{ marginTop: 8 }}>
                                                        {c.enrolledStudents.map((s, idx) => (
                                                            <li key={idx}>{s.name ?? s.Name ?? s.studentId}</li>
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