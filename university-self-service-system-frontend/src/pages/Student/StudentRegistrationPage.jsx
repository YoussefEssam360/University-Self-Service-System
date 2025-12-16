// src/pages/StudentRegistrationPage.jsx
import { useState, useEffect } from 'react';
import axiosClient from "../../api/axiosClient.js";
import { useAuth } from '../../context/AuthContext.jsx';

export default function StudentRegistrationPage() {
    const { user } = useAuth();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notif, setNotif] = useState(null); // { type: 'success'|'error', message }
    const [registering, setRegistering] = useState({}); // map courseId -> boolean

    // Helper: decode JWT to extract numeric sub (user id)
    const getStudentIdFromToken = () => {
        const token = user?.token ?? localStorage.getItem('token');
        if (!token) return null;
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            // sub expected to be string id
            const sub = payload.sub ?? payload.userId ?? payload.id;
            return sub ? parseInt(sub, 10) : null;
        } catch (e) {
            console.error('Failed to decode token', e);
            return null;
        }
    };

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axiosClient.get('/CourseFactory');
                const data = res.data ?? [];

                const normalized = data.map(c => ({
                    // accept many possible property names (Id, id, CourseId ...)
                    id: c.id ?? c.Id ?? c.courseId ?? c.CourseId ?? null,
                    title: c.title ?? c.Title ?? c.Title ?? c.title ?? c.CourseTitle ?? c.courseTitle ?? '',
                    code: c.courseCode ?? c.code ?? c.CourseCode ?? c.Code ?? '',
                    instructor: c.professorName ?? c.instructorName ?? c.instructor ?? 'TBA',
                    capacity: c.capacity ?? c.Capacity ?? 0,
                    enrolledStudents: c.enrolledStudents ?? c.EnrolledStudents ?? c.enrolledStudentsList ?? [],
                    raw: c
                }));

                setCourses(normalized);
            } catch (err) {
                console.error(err);
                setError('Failed to load available courses. Please check the network.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const isStudentEnrolled = (course) => {
        return (course.enrolledStudents && course.enrolledStudents.length > 0) &&
            course.enrolledStudents.some(s => {
                const sid = getStudentIdFromToken();
                if (sid && (s.studentId === sid || s.StudentId === sid)) return true;
                const username = user?.username ?? localStorage.getItem('username');
                if (!username) return false;
                return (s.name === username || s.Name === username || s.name === s.Name);
            });
    };

    const extractNumericCourseId = (course) => {
        // Try normalized id first
        let cid = course.id ?? course.raw?.id ?? course.raw?.Id ?? course.raw?.CourseId ?? course.raw?.courseId ?? null;
        if (cid === null || cid === undefined) return null;
        // If it's a string number, convert
        if (typeof cid === 'string') {
            const n = parseInt(cid, 10);
            return Number.isFinite(n) ? n : null;
        }
        if (typeof cid === 'number') return cid;
        return null;
    };

    const handleRegister = async (course) => {
        setNotif(null);
        // log full course for debugging
        console.log('Attempting register for course object:', course);

        const courseIdRaw = extractNumericCourseId(course);
        console.log('Resolved courseId:', courseIdRaw);

        if (!courseIdRaw) {
            setNotif({ type: 'error', message: 'Course not found (invalid identifier). Please refresh the page.' });
            return;
        }

        const studentId = getStudentIdFromToken();
        if (!studentId) {
            setNotif({ type: 'error', message: 'Student not identified. Please login again.' });
            return;
        }

        setRegistering(prev => ({ ...prev, [courseIdRaw]: true }));

        try {
            const url = `/Student/${studentId}/register`;
            const payload = { CourseId: courseIdRaw };
            console.log('POST', url, payload);

            const res = await axiosClient.post(url, payload);
            console.log('Register response:', res);

            const courseName = course.title || course.raw?.title || course.raw?.CourseTitle || course.code;
            setNotif({ type: 'success', message: `? Successfully registered for ${courseName}!` });

            setCourses(prev => prev.map(c => {
                const cid = extractNumericCourseId(c) ?? null;
                if (cid === courseIdRaw) {
                    const newEnrolled = (c.enrolledStudents || []).concat([{ studentId }]);
                    return { ...c, enrolledStudents: newEnrolled };
                }
                return c;
            }));

        } catch (err) {
            console.error('Register failed', err);
            // show full server response body if available
            const serverBody = err?.response?.data;
            console.error('Server response body:', serverBody);
            let msg = 'Failed to register.';
            if (serverBody) {
                // try multiple common fields
                msg = serverBody.message ?? serverBody.Message ?? serverBody.details ?? JSON.stringify(serverBody);
            } else if (err.message) {
                msg = err.message;
            }
            setNotif({ type: 'error', message: `? ${msg} (status ${err?.response?.status ?? 'unknown'})` });
        } finally {
            setRegistering(prev => ({ ...prev, [courseIdRaw]: false }));
        }
    };

    if (loading) return (
        <div style={{ padding: 24, color: '#e5e7eb' }}>
            <div>Loading courses...</div>
        </div>
    );

    if (error) return (
        <div style={{ padding: 24, color: '#ff8080', textAlign: 'center' }}>
            <div>?? {error}</div>
        </div>
    );

    return (
        <div style={{ color: '#e5e7eb' }}>
            <h2 style={{ marginTop: 0, marginBottom: 16 }}>Course Registration</h2>

            {notif && (
                <div style={{
                    marginBottom: 12,
                    padding: '10px 14px',
                    borderRadius: 8,
                    background: notif.type === 'success' ? 'rgba(16,185,129,0.12)' : 'rgba(255,77,77,0.08)',
                    color: notif.type === 'success' ? '#10b981' : '#ff6b6b'
                }}>{notif.message}</div>
            )

            }
            {courses.length === 0 ? (
                <div style={{ color: '#e5e7eb' }}>No courses available for registration.</div>
            ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {courses.map((course, idx) => {
                        const enrolled = course.enrolledStudents || [];
                        const enrolledCount = enrolled.length;
                        const capacity = course.capacity ?? course.raw?.capacity ?? 0;
                        const seatsLeftText = capacity > 0 ? `${enrolledCount}/${capacity} enrolled` : `${enrolledCount} enrolled`;
                        const cid = extractNumericCourseId(course) ?? idx;
                        const already = isStudentEnrolled(course);
                        return (
                            <div key={cid} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 14,
                                background: '#0f0f10',
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.03)'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>{course.title} <span style={{ color: '#9aa6b2', fontWeight: 500 }}>({course.code})</span></div>
                                    <div style={{ color: '#9aa6b2', marginTop: 6 }}>Instructor: {course.instructor}</div>
                                    <div style={{ color: '#9aa6b2', marginTop: 6 }}>{seatsLeftText}</div>
                                </div>

                                <div>
                                    <button
                                        onClick={() => handleRegister(course)}
                                        disabled={already || registering[cid] || (capacity > 0 && enrolledCount >= capacity)}
                                        style={{
                                            background: already ? 'transparent' : '#2b6cff',
                                            color: already ? '#9aa6b2' : 'white',
                                            border: already ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            padding: '0.6rem 0.9rem',
                                            borderRadius: 8,
                                            cursor: already ? 'default' : 'pointer'
                                        }}
                                    >
                                        {registering[cid] ? 'Registering...' : (already ? 'Registered' : (capacity > 0 && enrolledCount >= capacity ? 'Full' : 'Register'))}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// NOTE: You must also update App.jsx to use this component at the '/student/register' path.