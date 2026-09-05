import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const normalizeEnrollment = (enrollment) => ({
    enrollmentId: enrollment.enrollmentId,
    courseId: enrollment.courseId,
    title: enrollment.courseTitle ?? "Untitled course",
    code: enrollment.courseCode ?? "",
    instructor: enrollment.instructorName ?? "TBA",
    startDate: enrollment.startDate ?? null,
    endDate: enrollment.endDate ?? null,
});

const getApiMessage = (error, fallback) => (
    error?.response?.data?.message
    ?? error?.response?.data?.errors?.[0]
    ?? fallback
);

const formatDate = (value) => {
    if (!value || String(value).startsWith("0001-01-01")) return null;
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })
        .format(new Date(value));
};

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState(null);
    const [dropping, setDropping] = useState({});

    useEffect(() => {
        let active = true;

        const loadCourses = async () => {
            try {
                const response = await axiosClient.get("/Student/me/enrollments");
                const enrollments = response.data?.data ?? [];
                if (active) setCourses(enrollments.map(normalizeEnrollment));
            } catch (loadError) {
                if (active) setError(getApiMessage(loadError, "Failed to load enrolled courses."));
            } finally {
                if (active) setLoading(false);
            }
        };

        loadCourses();
        return () => { active = false; };
    }, []);

    const dropCourse = async (course) => {
        if (!window.confirm(`Drop ${course.title}? You will need to register again if you change your mind.`)) return;

        setNotification(null);
        setDropping((current) => ({ ...current, [course.enrollmentId]: true }));

        try {
            await axiosClient.delete(`/Student/me/enrollments/${course.enrollmentId}`);
            setCourses((current) => current.filter((item) => item.enrollmentId !== course.enrollmentId));
            setNotification({ type: "success", message: `${course.title} was dropped.` });
        } catch (dropError) {
            setNotification({
                type: "error",
                message: getApiMessage(dropError, "Could not drop this course."),
            });
        } finally {
            setDropping((current) => ({ ...current, [course.enrollmentId]: false }));
        }
    };

    if (loading) return <div className="profile-state">Loading enrolled courses...</div>;
    if (error) return <div style={{ padding: 24, color: "#ff8080" }}>{error}</div>;

    return (
        <section style={{ color: "#e5e7eb" }}>
            <div style={{ marginBottom: 18 }}>
                <h1 style={{ margin: 0, fontSize: "1.8rem" }}>My Courses</h1>
                <p style={{ margin: "6px 0 0", color: "#9aa6b2" }}>Review your current enrollments or drop a course.</p>
            </div>

            {notification && (
                <div
                    role="status"
                    style={{
                        marginBottom: 14,
                        padding: "10px 14px",
                        borderRadius: 8,
                        background: notification.type === "success" ? "rgba(16,185,129,0.12)" : "rgba(255,77,77,0.1)",
                        color: notification.type === "success" ? "#5ce0ad" : "#ff8b8b",
                    }}
                >
                    {notification.message}
                </div>
            )}

            {courses.length === 0 ? (
                <div style={{ padding: 24, background: "#0f0f10", borderRadius: 10, border: "1px solid rgba(255,255,255,0.06)" }}>
                    You are not currently enrolled in any courses.
                </div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {courses.map((course) => {
                        const startDate = formatDate(course.startDate);
                        const endDate = formatDate(course.endDate);

                        return (
                            <article
                                key={course.enrollmentId}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: 18,
                                    padding: 16,
                                    background: "#0f0f10",
                                    borderRadius: 10,
                                    border: "1px solid rgba(255,255,255,0.06)",
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 750, fontSize: "1.02rem" }}>
                                        {course.title} <span style={{ color: "#9aa6b2", fontWeight: 500 }}>({course.code})</span>
                                    </div>
                                    <div style={{ color: "#9aa6b2", marginTop: 7 }}>Instructor: {course.instructor}</div>
                                    {startDate && endDate && (
                                        <div style={{ color: "#9aa6b2", marginTop: 5 }}>{startDate} – {endDate}</div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => dropCourse(course)}
                                    disabled={dropping[course.enrollmentId]}
                                    style={{
                                        color: "#ff8585",
                                        background: "rgba(255,77,77,0.06)",
                                        border: "1px solid rgba(255,77,77,0.35)",
                                        padding: "0.62rem 0.9rem",
                                        borderRadius: 8,
                                        cursor: "pointer",
                                        fontWeight: 650,
                                    }}
                                >
                                    {dropping[course.enrollmentId] ? "Dropping..." : "Drop course"}
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
