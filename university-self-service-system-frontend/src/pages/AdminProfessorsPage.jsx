import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const emptyForm = {
    username: "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
    department: "",
};

const departments = ["Computer Science", "Engineering", "Business"];

const getApiMessage = (error, fallback) =>
    error?.response?.data?.message
    ?? error?.response?.data?.errors?.[0]
    ?? fallback;

export default function AdminProfessorsPage() {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [notice, setNotice] = useState("");
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const loadProfessors = useCallback(async () => {
        setLoading(true);
        setPageError("");
        try {
            const response = await axiosClient.get("/ProfManagement");
            setProfessors(response.data ?? []);
        } catch (error) {
            console.error(error);
            setPageError(getApiMessage(error, "Failed to load professors."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProfessors();
    }, [loadProfessors]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError("");
        setModalOpen(true);
    };

    const openEdit = (professor) => {
        setEditing(professor);
        setForm({
            username: professor.username ?? "",
            fullName: professor.fullName ?? "",
            email: professor.email ?? "",
            password: "",
            phoneNumber: professor.phoneNumber ?? "",
            department: professor.department ?? "",
        });
        setFormError("");
        setModalOpen(true);
    };

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    };

    const saveProfessor = async (event) => {
        event.preventDefault();
        setSaving(true);
        setFormError("");
        try {
            if (editing) {
                await axiosClient.put("/ProfManagement", {
                    id: editing.id,
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    phoneNumber: form.phoneNumber.trim(),
                    department: form.department,
                });
                setNotice("Professor updated successfully.");
            } else {
                await axiosClient.post("/ProfManagement", {
                    username: form.username.trim(),
                    fullName: form.fullName.trim(),
                    email: form.email.trim(),
                    password: form.password,
                    phoneNumber: form.phoneNumber.trim(),
                    department: form.department,
                });
                setNotice("Professor account created successfully.");
            }
            setModalOpen(false);
            await loadProfessors();
        } catch (error) {
            console.error(error);
            setFormError(getApiMessage(error, "Professor could not be saved."));
        } finally {
            setSaving(false);
        }
    };

    const deleteProfessor = async (professor) => {
        if (!window.confirm(`Delete ${professor.fullName}'s professor account?`)) return;
        setPageError("");
        setNotice("");
        try {
            const response = await axiosClient.delete("/ProfManagement", { data: { id: professor.id } });
            setNotice(response.data?.message ?? "Professor deleted.");
            await loadProfessors();
        } catch (error) {
            console.error(error);
            setPageError(getApiMessage(error, "Professor could not be deleted."));
        }
    };

    return (
        <main style={styles.page}>
            <section style={styles.card}>
                <header style={styles.header}>
                    <div>
                        <Link to="/admin" style={styles.back}>← Back to Dashboard</Link>
                        <h1 style={styles.title}>Professor Management</h1>
                        <p style={styles.subtitle}>Create accounts and maintain professor contact details.</p>
                    </div>
                    <button type="button" onClick={openCreate} style={styles.primary}>+ Add Professor</button>
                </header>

                {notice && <div style={styles.success}>{notice}</div>}
                {pageError && <div style={styles.error}>{pageError}</div>}

                {loading ? (
                    <p style={styles.muted}>Loading professors...</p>
                ) : (
                    <div style={styles.tableWrap}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Professor</th>
                                    <th style={styles.th}>Contact</th>
                                    <th style={styles.th}>Department</th>
                                    <th style={styles.th}>Courses</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professors.length === 0 && (
                                    <tr><td colSpan={5} style={styles.empty}>No professors found. Add one to get started.</td></tr>
                                )}
                                {professors.map((professor) => (
                                    <tr key={professor.id}>
                                        <td style={styles.td}>
                                            <strong>{professor.fullName}</strong>
                                            <div style={styles.muted}>@{professor.username}</div>
                                        </td>
                                        <td style={styles.td}>
                                            <div>{professor.email}</div>
                                            <div style={styles.muted}>{professor.phoneNumber}</div>
                                        </td>
                                        <td style={styles.td}>{professor.department}</td>
                                        <td style={styles.td}>{professor.courseCount}</td>
                                        <td style={styles.td}>
                                            <button type="button" onClick={() => openEdit(professor)} style={styles.secondary}>Edit</button>
                                            <button type="button" onClick={() => deleteProfessor(professor)} style={styles.danger}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {modalOpen && (
                <div style={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="professor-modal-title">
                    <form style={styles.modal} onSubmit={saveProfessor}>
                        <div style={styles.modalHeader}>
                            <h2 id="professor-modal-title" style={{ margin: 0 }}>{editing ? "Edit Professor" : "Add Professor"}</h2>
                            <button type="button" onClick={() => setModalOpen(false)} style={styles.close} aria-label="Close">×</button>
                        </div>
                        {formError && <div style={styles.error}>{formError}</div>}

                        {!editing && (
                            <label style={styles.label}>Username
                                <input name="username" value={form.username} onChange={onChange} style={styles.input} minLength={3} maxLength={50} required />
                            </label>
                        )}
                        <label style={styles.label}>Full Name
                            <input name="fullName" value={form.fullName} onChange={onChange} style={styles.input} minLength={2} maxLength={100} required />
                        </label>
                        <label style={styles.label}>Email
                            <input name="email" type="email" value={form.email} onChange={onChange} style={styles.input} required />
                        </label>
                        {!editing && (
                            <label style={styles.label}>Temporary Password
                                <input name="password" type="password" value={form.password} onChange={onChange} style={styles.input} minLength={6} required />
                            </label>
                        )}
                        <label style={styles.label}>Phone Number
                            <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={onChange} style={styles.input} maxLength={50} required />
                        </label>
                        <label style={styles.label}>Department
                            <select name="department" value={form.department} onChange={onChange} style={styles.input} required>
                                <option value="">Select department</option>
                                {departments.map((department) => <option key={department}>{department}</option>)}
                            </select>
                        </label>

                        <div style={styles.modalActions}>
                            <button type="button" onClick={() => setModalOpen(false)} style={styles.secondary}>Cancel</button>
                            <button type="submit" disabled={saving} style={styles.primary}>{saving ? "Saving..." : "Save Professor"}</button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
}

const styles = {
    page: { position: "fixed", inset: 0, overflowY: "auto", background: "#0b0b0c", color: "white", padding: "2rem", boxSizing: "border-box" },
    card: { width: "100%", maxWidth: 1200, margin: "0 auto", padding: "2rem", boxSizing: "border-box", borderRadius: 12, background: "#0f0f10", boxShadow: "0 12px 32px rgba(0,0,0,.6)" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 },
    title: { margin: "8px 0 0", fontSize: "2rem" },
    subtitle: { margin: "6px 0 0", color: "#999" },
    back: { color: "#4cf", textDecoration: "none", fontSize: 14 },
    primary: { padding: ".7rem 1rem", border: 0, borderRadius: 8, background: "#2b6cff", color: "white", fontWeight: 700, cursor: "pointer" },
    secondary: { padding: ".5rem .8rem", marginRight: 8, border: "1px solid #444", borderRadius: 6, background: "#171719", color: "white", cursor: "pointer" },
    danger: { padding: ".5rem .8rem", border: "1px solid #ff5d5d", borderRadius: 6, background: "transparent", color: "#ff7171", cursor: "pointer" },
    success: { padding: 12, marginBottom: 16, borderRadius: 6, background: "#12351f", color: "#91e6aa" },
    error: { padding: 12, marginBottom: 16, borderRadius: 6, background: "#421b1b", color: "#ffaaaa" },
    tableWrap: { overflowX: "auto" },
    table: { width: "100%", minWidth: 850, borderCollapse: "collapse" },
    th: { padding: 14, textAlign: "left", color: "#aaa", borderBottom: "1px solid #333" },
    td: { padding: 14, textAlign: "left", borderBottom: "1px solid #222" },
    empty: { padding: 30, textAlign: "center", color: "#888" },
    muted: { color: "#888", fontSize: 13, marginTop: 4 },
    overlay: { position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,.72)" },
    modal: { width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", padding: "1.5rem", boxSizing: "border-box", borderRadius: 10, background: "#111113", boxShadow: "0 18px 50px rgba(0,0,0,.75)" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    close: { border: 0, background: "transparent", color: "#aaa", fontSize: 28, cursor: "pointer" },
    label: { display: "block", marginBottom: 14, textAlign: "left", color: "#ddd", fontSize: 14 },
    input: { display: "block", width: "100%", marginTop: 6, padding: ".65rem", boxSizing: "border-box", border: "1px solid #3a3a3d", borderRadius: 6, background: "#222225", color: "white" },
    modalActions: { display: "flex", justifyContent: "flex-end", marginTop: 20 },
};
