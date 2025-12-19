import { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function StudentCoursesPage() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getStudentIdFromToken = () => {
        const token = user?.token ?? localStorage.getItem('token');
        if (!token) return null;
        try {
            const parts = token.split('.');
            if (parts.length < 2) return null;
            const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            const sub = payload.sub ?? payload.userId ?? payload.id;
            return sub ? parseInt(sub, 10) : null;
        } catch (e) {
            console.error('Failed to decode token', e);
            return null;
        }
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            const studentId = getStudentIdFromToken();
            if (!studentId) {
                setError('Student not identified. Please login again.');
                setLoading(false);
                return;
            }

            try {
                const res = await axiosClient.get(`/Student/${studentId}/enrollments`);
                const payload = res.data?.data ?? res.data?.Data ?? res.data ?? [];
                const list = Array.isArray(payload) ? payload : (payload?.Data ?? payload);
                const normalized = (Array.isArray(payload) ? payload : (Array.isArray(list) ? list : [])).map(c => ({
                    enrollmentId: c.enrollmentId ?? c.EnrollmentId ?? c.enrollmentID ?? c.enrollmentId,
                    courseId: c.courseId ?? c.CourseId ?? c.courseID ?? c.CourseID ?? c.courseId,
                    title: c.courseTitle ?? c.CourseTitle ?? c.title ?? c.Title ?? 'Untitled',
                    code: c.courseCode ?? c.CourseCode ?? c.code ?? c.Code ?? '',
                    instructor: c.instructorName ?? c.InstructorName ?? c.instructor ?? 'TBA',
                    // keep dates in data model but do not display them in UI
                    startDate: c.startDate ?? c.StartDate ?? null,
                    endDate: c.endDate ?? c.EndDate ?? null
                }));

                setCourses(normalized);
            } catch (err) {
                console.error(err);
                setError('Failed to load enrolled courses.');
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    if (loading) return <div style={{ padding: 24, color: '#e5e7eb' }}>Loading enrolled courses...</div>;
    if (error) return <div style={{ padding: 24, color: '#ff8080' }}>{error}</div>;

    if (!courses || courses.length === 0) {
        return <div style={{ padding: 24, color: '#e5e7eb' }}>No current enrolled courses.</div>;
    }

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ color: '#e5e7eb', marginTop: 0 }}>My Courses</h2>
            <div style={{ display: 'grid', gap: 12 }}>
                {courses.map(c => (
                    <div key={c.enrollmentId ?? c.courseId} style={{ background: '#0f0f10', padding: 14, borderRadius: 8, border: '1px solid rgba(255,255,255,0.03)', color: '#e5e7eb' }}>
                        <div style={{ fontWeight: 700 }}>{c.title} <span style={{ color: '#9aa6b2', fontWeight: 500 }}>({c.code})</span></div>
                        <div style={{ color: '#9aa6b2', marginTop: 6 }}>Instructor: {c.instructor}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
