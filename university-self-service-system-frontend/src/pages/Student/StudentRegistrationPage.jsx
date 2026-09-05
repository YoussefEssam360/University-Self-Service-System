import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient.js";

const normalizeCourse = (course) => ({
    id: course.id ?? course.courseId ?? null,
    title: course.title ?? course.courseTitle ?? "Untitled course",
    code: course.courseCode ?? course.code ?? "",
    instructor: course.professorName ?? course.instructorName ?? "TBA",
    capacity: course.capacity ?? 0,
    enrolledCount: course.enrolledStudents?.length ?? 0,
    startDate: course.startDate ?? null,
    endDate: course.endDate ?? null,
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

export default function StudentRegistrationPage() {
    const [courses, setCourses] = useState([]);
    const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notification, setNotification] = useState(null);
    const [registering, setRegistering] = useState({});

    useEffect(() => {
        let active = true;

        const loadRegistrationData = async () => {
            try {
                const [courseResponse, enrollmentResponse] = await Promise.all([
                    axiosClient.get("/CourseFactory"),
                    axiosClient.get("/Student/me/enrollments"),
                ]);

                if (!active) return;

                const courseList = Array.isArray(courseResponse.data) ? courseResponse.data : [];
                const enrollmentList = enrollmentResponse.data?.data ?? [];
                setCourses(courseList.map(normalizeCourse));
                setEnrolledCourseIds(new Set(enrollmentList.map((item) => item.courseId)));
            } catch (loadError) {
                if (active) setError(getApiMessage(loadError, "Failed to load available courses."));
            } finally {
                if (active) setLoading(false);
            }
        };

        loadRegistrationData();
        return () => { active = false; };
    }, []);

    const handleRegister = async (course) => {
        if (!course.id) {
            setNotification({ type: "error", message: "This course has an invalid identifier." });
            return;
        }

        setNotification(null);
        setRegistering((current) => ({ ...current, [course.id]: true }));

        try {
            await axiosClient.post("/Student/me/enrollments", { courseId: course.id });
            setEnrolledCourseIds((current) => new Set([...current, course.id]));
            setCourses((current) => current.map((item) => (
                item.id === course.id ? { ...item, enrolledCount: item.enrolledCount + 1 } : item
            )));
            setNotification({ type: "success", message: `Registered for ${course.title}.` });
        } catch (registerError) {
            setNotification({
                type: "error",
                message: getApiMessage(registerError, "Could not register for this course."),
            });
        } finally {
            setRegistering((current) => ({ ...current, [course.id]: false }));
        }
    };

    if (loading) return <div className="profile-state">Loading available courses...</div>;
    if (error) return <div style={{ padding: 24, color: "#ff8080", textAlign: "center" }}>{error}</div>;

    return (
        <section style={{ color: "#e5e7eb" }}>
            <div style={{ marginBottom: 18 }}>
                <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Course Registration</h1>
                <p style={{ margin: "6px 0 0", color: "#9aa6b2" }}>Choose from the courses with available seats.</p>
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
                <div>No courses are currently available.</div>
            ) : (
                <div style={{ display: "grid", gap: 12 }}>
                    {courses.map((course) => {
                        const alreadyEnrolled = enrolledCourseIds.has(course.id);
                        const isFull = course.capacity > 0 && course.enrolledCount >= course.capacity;
                        const startDate = formatDate(course.startDate);
                        const endDate = formatDate(course.endDate);

                        return (
                            <article
                                key={course.id}
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
                                    <div style={{ color: "#9aa6b2", marginTop: 5 }}>
                                        {course.enrolledCount}{course.capacity > 0 ? ` / ${course.capacity}` : ""} enrolled
                                        {startDate && endDate ? ` · ${startDate} – ${endDate}` : ""}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRegister(course)}
                                    disabled={alreadyEnrolled || isFull || registering[course.id]}
                                    style={{
                                        minWidth: 105,
                                        background: alreadyEnrolled ? "transparent" : "#2b6cff",
                                        color: alreadyEnrolled ? "#9aa6b2" : "white",
                                        border: alreadyEnrolled ? "1px solid #333" : "none",
                                        padding: "0.65rem 0.9rem",
                                        borderRadius: 8,
                                        cursor: alreadyEnrolled || isFull ? "default" : "pointer",
                                        fontWeight: 650,
                                    }}
                                >
                                    {registering[course.id] ? "Registering..." : alreadyEnrolled ? "Registered" : isFull ? "Full" : "Register"}
                                </button>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
