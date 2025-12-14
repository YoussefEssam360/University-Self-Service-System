import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function CourseModal({ open, onClose, initialCourse, refresh }) {
    const [form, setForm] = useState({ title: "", code: "", creditHours: 3, professorId: "" });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const isEdit = !!initialCourse;

    useEffect(() => {
        if (initialCourse) {
            setForm({
                title: initialCourse.title ?? "",
                code: initialCourse.courseCode ?? initialCourse.code ?? "",
                creditHours: initialCourse.creditHours ?? 3,
                professorId: initialCourse.professorId ?? "",
            });
        } else {
            setForm({ title: "", code: "", creditHours: 3, professorId: "" });
        }
        setError("");
    }, [initialCourse, open]);

    if (!open) return null;

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1200,
    };

    const modalStyle = {
        width: "100%",
        maxWidth: 520,
        background: "#0f0f10",
        padding: "2rem",
        borderRadius: 12,
        boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
        color: "white",
        boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block",
        marginBottom: 6,
        fontSize: 14,
        color: "#bbb",
    };

    const inputStyle = {
        width: "100%",
        padding: "0.65rem 0.75rem",
        marginBottom: 16,
        borderRadius: 6,
        border: "1px solid #333",
        background: "#1a1a1a",
        color: "white",
        boxSizing: "border-box",
        fontSize: 14,
    };

    const primaryButton = {
        flex: 1,
        padding: "0.7rem",
        borderRadius: 8,
        border: "none",
        background: "#2b6cff",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
    };

    const neutralButton = {
        flex: 1,
        padding: "0.7rem",
        borderRadius: 8,
        border: "1px solid #333",
        background: "#111",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);
        try {
            if (isEdit) {
                await axiosClient.put("/CourseFactory", {
                    OriginalCode: initialCourse.courseCode ?? initialCourse.code,
                    Code: form.code,
                    Title: form.title,
                    CreditHours: Number(form.creditHours),
                });
            } else {
                await axiosClient.post("/CourseFactory", {
                    code: form.code,
                    title: form.title,
                    creditHours: Number(form.creditHours),
                    professorId: form.professorId ? Number(form.professorId) : null,
                });
            }

            if (typeof refresh === "function") await refresh();
            onClose();
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message ?? "Failed to save. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={overlayStyle} onClick={onClose} role="dialog" aria-modal="true">
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginTop: 0, marginBottom: 20 }}>{isEdit ? "Edit Course" : "Create Course"}</h2>

                {error && (
                    <div style={{ background: "#ffe6e6", color: "#900", padding: "0.6rem", marginBottom: 16, borderRadius: 6 }}>
                        {error}
                    </div>
                )}

                <form onSubmit={submit}>
                    <label style={labelStyle}>Title</label>
                    <input name="title" value={form.title} onChange={onChange} style={inputStyle} required />

                    <label style={labelStyle}>Code</label>
                    <input name="code" value={form.code} onChange={onChange} style={inputStyle} required />

                    <label style={labelStyle}>Credit Hours</label>
                    <input
                        name="creditHours"
                        type="number"
                        min="1"
                        value={form.creditHours}
                        onChange={onChange}
                        style={inputStyle}
                        required
                    />

                    <label style={labelStyle}>Professor ID (optional)</label>
                    <input name="professorId" value={form.professorId} onChange={onChange} style={inputStyle} />

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="submit" disabled={saving} style={primaryButton}>
                            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
                        </button>

                        <button type="button" onClick={onClose} style={neutralButton}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}