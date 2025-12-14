// src/pages/AdminCoursesPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminCoursesPage() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingCourse, setEditingCourse] = useState(null);

    const [editForm, setEditForm] = useState({
        id: "",
        title: "",
        code: "",
        creditHours: "",
        professorId: "",
    });

    // track expanded course rows to show professor + enrolled students
    const [expanded, setExpanded] = useState(new Set());

    // Prefer legacy 'courseCode' (string) as stable identifier
    const getId = (course) =>
        course?.courseCode ?? course?.CourseCode ?? course?.code ?? course?.id ?? null;

    // normalize helper to read nested fields regardless of casing variations
    const getProfessorName = (course) =>
        course?.professorName ??
        course?.ProfessorName ??
        course?.Professor?.name ??
        course?.professor?.name ??
        "Not Assigned";

    const getEnrolledStudents = (course) =>
        course?.enrolledStudents ??
        course?.EnrolledStudents ??
        course?.enrollments ??
        course?.Enrollments ??
        [];

    // Load from backend
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get("/CourseFactory");
                console.log("GET /api/CourseFactory =>", res.data);
                setCourses(res.data ?? []);
            } catch {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggleExpanded = (courseCode) => {
        setExpanded((prev) => {
            const copy = new Set(prev);
            if (copy.has(courseCode)) copy.delete(courseCode);
            else copy.add(courseCode);
            return copy;
        });
    };

    // Delete course: backend Delete expects body { Code }
    const handleDelete = async (courseCode) => {
        if (!window.confirm("Are you sure?")) return;

        try {
            await axiosClient.delete("/CourseFactory", { data: { Code: courseCode } });
            setCourses((prev) => prev.filter((c) => getId(c) !== courseCode));
        } catch {
            alert("Failed to delete.");
        }
    };

    const startEdit = (course) => {
        const id = getId(course);
        if (id === null) {
            console.warn("Could not determine course id for edit:", course);
            return;
        }

        setEditingCourse(id);
        setEditForm({
            id,
            title: course.title ?? "",
            code: course.courseCode ?? course.code ?? "",
            creditHours: course.creditHours ?? "",
            professorId: course.professorId ?? "",
        });
    };

    const cancelEdit = () => {
        setEditingCourse(null);
        setEditForm({
            id: "",
            title: "",
            code: "",
            creditHours: "",
            professorId: "",
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const saveEdit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                OriginalCode: editForm.id,
                Code: editForm.code,
                Title: editForm.title,
                CreditHours: Number(editForm.creditHours),
            };

            await axiosClient.put("/CourseFactory", payload);

            setCourses((prev) =>
                prev.map((c) => {
                    const cid = getId(c);
                    return cid === editForm.id
                        ? {
                              ...c,
                              title: payload.Title,
                              code: payload.Code,
                              courseCode: payload.Code,
                              creditHours: payload.CreditHours,
                          }
                        : c;
                })
            );

            cancelEdit();
        } catch {
            alert("Failed to save changes.");
        }
    };

    if (loading) return <p style={{ color: "white" }}>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>All Courses</h1>
            <p>Logged in as: <strong>{user?.username}</strong></p>

            <Link to="/admin" style={{ color: "#4cf" }}>← Back to Dashboard</Link>

            <div style={{ marginTop: "20px" }}>
                <Link to="/admin/courses/new">
                    <button>+ Create New Course</button>
                </Link>
            </div>

            {/* EDIT FORM */}
            {editingCourse !== null && (
                <form
                    onSubmit={saveEdit}
                    style={{
                        marginBottom: "20px",
                        padding: "15px",
                        border: "1px solid #555",
                        borderRadius: "8px",
                    }}
                >
                    <h3>Edit Course</h3>

                    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <label style={{ display: "flex", flexDirection: "column" }}>
                            Title
                            <input
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                            />
                        </label>

                        <label style={{ display: "flex", flexDirection: "column" }}>
                            Code
                            <input
                                name="code"
                                value={editForm.code}
                                onChange={handleEditChange}
                            />
                        </label>

                        <label style={{ display: "flex", flexDirection: "column" }}>
                            Credit Hours
                            <input
                                type="number"
                                name="creditHours"
                                value={editForm.creditHours}
                                onChange={handleEditChange}
                            />
                        </label>

                        <label style={{ display: "flex", flexDirection: "column" }}>
                            Professor ID
                            <input
                                type="number"
                                name="professorId"
                                value={editForm.professorId}
                                onChange={handleEditChange}
                            />
                        </label>
                    </div>

                    <button type="submit">Save</button>
                    <button type="button" onClick={cancelEdit} style={{ marginLeft: 10 }}>
                        Cancel
                    </button>
                </form>
            )}

            {/* TABLE */}
            <div style={{ maxHeight: "600px", overflowY: "auto", marginTop: 16 }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#222" }}>
                            <th style={{ padding: 10 }}>Title</th>
                            <th style={{ padding: 10 }}>Code</th>
                            <th style={{ padding: 10 }}>Credit Hours</th>
                            <th style={{ padding: 10 }}>Professor</th>
                            <th style={{ padding: 10 }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ padding: 10, textAlign: "center" }}>
                                    No courses found.
                                </td>
                            </tr>
                        )}

                        {courses.map((c) => {
                            const cid = getId(c);
                            const profName = getProfessorName(c);
                            const students = getEnrolledStudents(c);

                            return (
                                <React.Fragment key={cid ?? Math.random()}>
                                    <tr style={{ borderTop: "1px solid #333" }}>
                                        <td style={{ padding: 10 }}>{c.title}</td>
                                        <td style={{ padding: 10 }}>{c.courseCode ?? c.code}</td>
                                        <td style={{ padding: 10 }}>{c.creditHours}</td>
                                        <td style={{ padding: 10 }}>{profName}</td>
                                        <td style={{ padding: 10 }}>
                                            <button onClick={() => startEdit(c)}>Edit</button>

                                            <button
                                                onClick={() => handleDelete(cid)}
                                                style={{ marginLeft: 10, color: "red" }}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                style={{ marginLeft: 10 }}
                                                onClick={() => toggleExpanded(cid)}
                                            >
                                                {expanded.has(cid) ? "Hide" : "View"} Students
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Expanded details row */}
                                    {expanded.has(cid) && (
                                        <tr style={{ background: "#111" }}>
                                            <td colSpan={5} style={{ padding: 10 }}>
                                                <h4 style={{ marginTop: 0 }}>Enrolled Students</h4>

                                                {students.length === 0 ? (
                                                    <p>No students enrolled.</p>
                                                ) : (
                                                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                        <thead>
                                                            <tr style={{ background: "#222" }}>
                                                                <th style={{ padding: 8 }}>Student Id</th>
                                                                <th style={{ padding: 8 }}>Name</th>
                                                                <th style={{ padding: 8 }}>Email</th>
                                                                <th style={{ padding: 8 }}>Grade</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {students.map((s, idx) => (
                                                                <tr key={s.studentId ?? s.StudentId ?? idx} style={{ borderTop: "1px solid #333" }}>
                                                                    <td style={{ padding: 8 }}>{s.studentId ?? s.StudentId ?? "-"}</td>
                                                                    <td style={{ padding: 8 }}>{s.name ?? s.Name ?? s.username ?? "-"}</td>
                                                                    <td style={{ padding: 8 }}>{s.email ?? s.Email ?? "-"}</td>
                                                                    <td style={{ padding: 8 }}>{s.grade ?? s.Grade ?? "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
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
        </div>
    );
}