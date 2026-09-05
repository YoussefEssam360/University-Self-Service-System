import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const emptyForm = {
    title: "",
    code: "",
    creditHours: 3,
    professorId: "",
    capacity: 30,
    startDate: "",
    endDate: "",
};

const toInputDate = (value) => {
    if (!value || String(value).startsWith("0001-01-01")) return "";
    return String(value).slice(0, 10);
};

const getApiError = (err) => {
    const body = err?.response?.data;
    if (body?.message) return body.message;
    if (body?.errors) {
        const messages = Object.values(body.errors).flat();
        if (messages.length) return messages.join(" ");
    }
    return "Failed to save the course. Please try again.";
};

export default function CourseModal({ open, onClose, initialCourse, refresh }) {
    const [form, setForm] = useState(emptyForm);
    const [professors, setProfessors] = useState([]);
    const [loadingProfessors, setLoadingProfessors] = useState(false);
    const [professorError, setProfessorError] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const isEdit = Boolean(initialCourse);

    useEffect(() => {
        if (!open) return;

        if (initialCourse) {
            setForm({
                title: initialCourse.title ?? "",
                code: initialCourse.courseCode ?? initialCourse.code ?? "",
                creditHours: initialCourse.creditHours ?? 3,
                professorId: initialCourse.professorId ?? "",
                capacity: initialCourse.capacity > 0 ? initialCourse.capacity : 30,
                startDate: toInputDate(initialCourse.startDate),
                endDate: toInputDate(initialCourse.endDate),
            });
        } else {
            setForm(emptyForm);
        }

        setError("");
    }, [initialCourse, open]);

    useEffect(() => {
        if (!open) return;

        let active = true;
        const loadProfessors = async () => {
            setLoadingProfessors(true);
            setProfessorError("");
            try {
                const response = await axiosClient.get("/ProfManagement");
                if (active) setProfessors(Array.isArray(response.data) ? response.data : []);
            } catch {
                if (active) setProfessorError("Professor list could not be loaded.");
            } finally {
                if (active) setLoadingProfessors(false);
            }
        };

        loadProfessors();
        return () => { active = false; };
    }, [open]);

    if (!open) return null;

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const validate = () => {
        if (!form.title.trim() || !form.code.trim()) return "Title and course code are required.";
        if (Number(form.creditHours) < 1 || Number(form.creditHours) > 12) return "Credit hours must be between 1 and 12.";
        if (Number(form.capacity) < 1) return "Capacity must be at least 1.";
        if (!form.startDate || !form.endDate) return "Start and end dates are required.";
        if (form.endDate < form.startDate) return "End date must be on or after the start date.";
        return "";
    };

    const submit = async (event) => {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");
        setSaving(true);

        const payload = {
            code: form.code.trim(),
            title: form.title.trim(),
            creditHours: Number(form.creditHours),
            professorId: form.professorId ? Number(form.professorId) : null,
            capacity: Number(form.capacity),
            startDate: form.startDate,
            endDate: form.endDate,
        };

        try {
            if (isEdit) {
                await axiosClient.put("/CourseFactory", {
                    ...payload,
                    originalCode: initialCourse.courseCode ?? initialCourse.code,
                });
            } else {
                await axiosClient.post("/CourseFactory", payload);
            }

            if (typeof refresh === "function") await refresh();
            onClose();
        } catch (err) {
            setError(getApiError(err));
        } finally {
            setSaving(false);
        }
    };

    const selectedProfessorMissing = form.professorId && !professors.some(
        (professor) => String(professor.id) === String(form.professorId)
    );

    const overlayStyle = {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        zIndex: 1200,
    };

    const modalStyle = {
        width: "100%",
        maxWidth: 620,
        maxHeight: "90vh",
        overflowY: "auto",
        background: "#0f0f10",
        padding: "2rem",
        borderRadius: 12,
        boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
        color: "white",
        boxSizing: "border-box",
    };

    const labelStyle = { display: "block", marginBottom: 6, fontSize: 14, color: "#bbb" };
    const inputStyle = {
        width: "100%",
        padding: "0.65rem 0.75rem",
        borderRadius: 6,
        border: "1px solid #333",
        background: "#1a1a1a",
        color: "white",
        boxSizing: "border-box",
        fontSize: 14,
    };
    const fieldStyle = { marginBottom: 16 };
    const twoColumnStyle = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 };
    const primaryButton = { flex: 1, padding: "0.7rem", borderRadius: 8, border: "none", background: "#2b6cff", color: "white", fontWeight: 600, cursor: "pointer" };
    const neutralButton = { flex: 1, padding: "0.7rem", borderRadius: 8, border: "1px solid #333", background: "#111", color: "white", fontWeight: 600, cursor: "pointer" };

    return (
        <div style={overlayStyle} onClick={onClose} role="presentation">
            <div style={modalStyle} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="course-modal-title">
                <h2 id="course-modal-title" style={{ marginTop: 0, marginBottom: 20 }}>
                    {isEdit ? "Edit Course" : "Create Course"}
                </h2>

                {error && <div style={{ background: "#ffe6e6", color: "#900", padding: "0.7rem", marginBottom: 16, borderRadius: 6 }}>{error}</div>}

                <form onSubmit={submit}>
                    <div style={fieldStyle}>
                        <label htmlFor="course-title" style={labelStyle}>Title</label>
                        <input id="course-title" name="title" value={form.title} onChange={onChange} style={inputStyle} required maxLength={200} />
                    </div>

                    <div style={twoColumnStyle}>
                        <div style={fieldStyle}>
                            <label htmlFor="course-code" style={labelStyle}>Code</label>
                            <input id="course-code" name="code" value={form.code} onChange={onChange} style={inputStyle} required maxLength={30} />
                        </div>
                        <div style={fieldStyle}>
                            <label htmlFor="course-credits" style={labelStyle}>Credit Hours</label>
                            <input id="course-credits" name="creditHours" type="number" min="1" max="12" value={form.creditHours} onChange={onChange} style={inputStyle} required />
                        </div>
                    </div>

                    <div style={twoColumnStyle}>
                        <div style={fieldStyle}>
                            <label htmlFor="course-capacity" style={labelStyle}>Capacity</label>
                            <input id="course-capacity" name="capacity" type="number" min="1" value={form.capacity} onChange={onChange} style={inputStyle} required />
                        </div>
                        <div style={fieldStyle}>
                            <label htmlFor="course-professor" style={labelStyle}>Professor</label>
                            <select id="course-professor" name="professorId" value={form.professorId} onChange={onChange} style={inputStyle} disabled={loadingProfessors}>
                                <option value="">Not assigned</option>
                                {selectedProfessorMissing && (
                                    <option value={form.professorId}>{initialCourse?.professorName ?? `Professor #${form.professorId}`}</option>
                                )}
                                {professors.map((professor) => (
                                    <option key={professor.id} value={professor.id}>
                                        {professor.name}{professor.department ? ` — ${professor.department}` : ""}
                                    </option>
                                ))}
                            </select>
                            {professorError && <div style={{ color: "#f5b942", fontSize: 12, marginTop: 5 }}>{professorError}</div>}
                        </div>
                    </div>

                    <div style={twoColumnStyle}>
                        <div style={fieldStyle}>
                            <label htmlFor="course-start" style={labelStyle}>Start Date</label>
                            <input id="course-start" name="startDate" type="date" value={form.startDate} onChange={onChange} style={inputStyle} required />
                        </div>
                        <div style={fieldStyle}>
                            <label htmlFor="course-end" style={labelStyle}>End Date</label>
                            <input id="course-end" name="endDate" type="date" min={form.startDate || undefined} value={form.endDate} onChange={onChange} style={inputStyle} required />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                        <button type="submit" disabled={saving} style={primaryButton}>
                            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Course"}
                        </button>
                        <button type="button" onClick={onClose} disabled={saving} style={neutralButton}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
