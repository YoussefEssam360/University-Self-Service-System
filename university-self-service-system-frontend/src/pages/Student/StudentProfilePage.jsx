import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const emptyProfile = {
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    major: "",
};

const normalizeProfile = (profile = {}) => ({
    fullName: profile.fullName ?? "",
    email: profile.email ?? "",
    phoneNumber: profile.phoneNumber ?? "",
    dateOfBirth: profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : "",
    major: profile.major ?? "",
});

const getApiError = (error) => {
    const body = error?.response?.data;
    if (body?.message) return body.message;
    if (body?.errors) {
        const messages = Array.isArray(body.errors)
            ? body.errors
            : Object.values(body.errors).flat();
        if (messages.length) return messages.join(" ");
    }
    return "Could not save your profile. Please try again.";
};

export default function StudentProfilePage() {
    const [form, setForm] = useState(emptyProfile);
    const [savedForm, setSavedForm] = useState(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        let active = true;

        const loadProfile = async () => {
            try {
                const response = await axiosClient.get("/Student/me/profile");
                const profile = normalizeProfile(response.data?.data);
                if (active) {
                    setForm(profile);
                    setSavedForm(profile);
                }
            } catch (loadError) {
                if (active) setError(getApiError(loadError));
            } finally {
                if (active) setLoading(false);
            }
        };

        loadProfile();
        return () => { active = false; };
    }, []);

    const onChange = (event) => {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setError("");
        setSuccess("");
    };

    const validate = () => {
        if (form.fullName.trim().length < 2) return "Please enter your full name.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Please enter a valid email address.";
        if (!/^[0-9+()\-\s]{7,50}$/.test(form.phoneNumber)) return "Please enter a valid phone number.";
        if (!form.dateOfBirth) return "Please enter your date of birth.";
        if (form.dateOfBirth >= new Date().toISOString().slice(0, 10)) return "Date of birth must be in the past.";
        if (form.major.trim().length < 2) return "Please enter your major.";
        return "";
    };

    const saveProfile = async (event) => {
        event.preventDefault();
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await axiosClient.put("/Student/me/profile", {
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                phoneNumber: form.phoneNumber.trim(),
                dateOfBirth: form.dateOfBirth,
                major: form.major.trim(),
            });
            const updatedProfile = normalizeProfile(response.data?.data);
            setForm(updatedProfile);
            setSavedForm(updatedProfile);
            setSuccess(response.data?.message ?? "Profile saved successfully.");
        } catch (saveError) {
            setError(getApiError(saveError));
        } finally {
            setSaving(false);
        }
    };

    const resetForm = () => {
        setForm(savedForm);
        setError("");
        setSuccess("");
    };

    if (loading) return <div className="profile-state">Loading your profile...</div>;

    return (
        <section className="profile-page">
            <div className="profile-heading">
                <div>
                    <h1>My Profile</h1>
                    <p>Keep your personal and academic information up to date.</p>
                </div>
                <div className="profile-avatar" aria-hidden="true">
                    {(form.fullName.trim()[0] ?? "S").toUpperCase()}
                </div>
            </div>

            <div className="profile-card">
                {(error || success) && (
                    <div className={`profile-message ${error ? "error" : "success"}`} role="status" aria-live="polite">
                        {error || success}
                    </div>
                )}

                <form onSubmit={saveProfile}>
                    <div className="profile-grid">
                        <label className="profile-field">
                            <span>Full name</span>
                            <input name="fullName" value={form.fullName} onChange={onChange} required maxLength={200} autoComplete="name" />
                        </label>

                        <label className="profile-field">
                            <span>Email address</span>
                            <input name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" />
                        </label>

                        <label className="profile-field">
                            <span>Phone number</span>
                            <input name="phoneNumber" type="tel" value={form.phoneNumber} onChange={onChange} required maxLength={50} autoComplete="tel" />
                        </label>

                        <label className="profile-field">
                            <span>Date of birth</span>
                            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={onChange} required max={new Date().toISOString().slice(0, 10)} />
                        </label>

                        <label className="profile-field profile-field-wide">
                            <span>Major</span>
                            <input name="major" value={form.major} onChange={onChange} required maxLength={100} />
                        </label>
                    </div>

                    <div className="profile-actions">
                        <button type="button" className="profile-button secondary" onClick={resetForm} disabled={saving || JSON.stringify(form) === JSON.stringify(savedForm)}>
                            Undo changes
                        </button>
                        <button type="submit" className="profile-button primary" disabled={saving}>
                            {saving ? "Saving..." : "Save profile"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
