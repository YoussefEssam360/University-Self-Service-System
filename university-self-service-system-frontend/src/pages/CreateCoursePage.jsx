import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate, Link } from "react-router-dom";

export default function CreateCoursePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        code: "",
        creditHours: "",
        professorId: ""
    });

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const payload = {
                title: form.title,
                code: form.code,
                creditHours: Number(form.creditHours),
                professorId: Number(form.professorId)
            };

            await axiosClient.post("/CourseFactory", payload);

            navigate("/admin/courses");
        } catch (err) {
            console.log(err);
            setError("Failed to create the course.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={{ padding: "20px", color: "white" }}>
            <h1>Create Course</h1>
            <Link to="/admin/courses" style={{ color: "#4cf" }}>
                ← Back to Courses
            </Link>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}
            >

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Title
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Code
                    <input
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Credit Hours
                    <input
                        type="number"
                        name="creditHours"
                        value={form.creditHours}
                        min="1"
                        onChange={handleChange}
                        required
                    />
                </label>

                <label style={{ display: "flex", flexDirection: "column" }}>
                    Professor ID
                    <input
                        type="number"
                        name="professorId"
                        value={form.professorId}
                        min="1"
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Create Course"}
                </button>
            </form>
        </div>
    );
}
