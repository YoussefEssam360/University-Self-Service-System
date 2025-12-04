// FIXED to use legacy courseCode and call backend DTO shapes
// src/pages/AdminCoursesPage.jsx

import { useEffect, useState } from "react";
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

    // Prefer legacy 'courseCode' (string) as stable identifier
    const getId = (course) =>
        course?.courseCode ?? course?.CourseCode ?? course?.code ?? course?.id ?? null;

    // Load from backend
    useEffect(() => {
        const load = async () => {
            try {
                const res = await axiosClient.get("/CourseFactory");
                setCourses(res.data);
            } catch {
                setError("Failed to load courses.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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

        // id is the courseCode string
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
            // Send OriginalCode so backend can find the existing record even if Code was changed
            const payload = {
                OriginalCode: editForm.id,          // original courseCode string
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
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ background: "#222" }}>
                            <th style={{ padding: 10 }}>Title</th>
                            <th style={{ padding: 10 }}>Code</th>
                            <th style={{ padding: 10 }}>Credit Hours</th>
                            <th style={{ padding: 10 }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {courses.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: 10, textAlign: "center" }}>
                                    No courses found.
                                </td>
                            </tr>
                        )}

                        {courses.map((c) => {
                            const cid = getId(c);
                            return (
                                <tr key={cid ?? Math.random()} style={{ borderTop: "1px solid #333" }}>
                                    <td style={{ padding: 10 }}>{c.title}</td>
                                    <td style={{ padding: 10 }}>{c.courseCode ?? c.code}</td>
                                    <td style={{ padding: 10 }}>{c.creditHours}</td>
                                    <td style={{ padding: 10 }}>
                                        <button onClick={() => startEdit(c)}>Edit</button>
                                        <button
                                            onClick={() => handleDelete(cid)}
                                            style={{ marginLeft: 10, color: "red" }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}