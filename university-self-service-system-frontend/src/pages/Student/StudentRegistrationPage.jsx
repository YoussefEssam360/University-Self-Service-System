// src/pages/StudentRegistrationPage.jsx
import { useState, useEffect } from 'react';
import axiosClient from "../../api/axiosClient.js"; // For talking to the .NET backend
// import { useAuth } from '../context/AuthContext'; // Might need this later for user details

export default function StudentRegistrationPage() {

    // State to hold the list of courses retrieved from the backend
    const [availableCourses, setAvailableCourses] = useState([]);

    // State to track which courses the student has selected to enroll in
    const [selectedCourses, setSelectedCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Placeholder data fetching function
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // 1. Set loading state
                setLoading(true);

                // 2. Call the .NET backend API endpoint to get courses
                // NOTE: You will need to create this endpoint in your .NET project (e.g., /Courses/Available)
                const response = await axiosClient.get("/Courses/Available");

                // Assuming your backend returns an array of course objects
                setAvailableCourses(response.data);

            } catch (err) {
                setError("Failed to load available courses. Please check the network.");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []); // Run only once on component mount


    // Function to handle toggling course selection
    const handleCourseSelection = (courseId) => {
        setSelectedCourses(prevSelected =>
            prevSelected.includes(courseId)
                ? prevSelected.filter(id => id !== courseId) // Remove if already selected
                : [...prevSelected, courseId]                // Add if not selected
        );
    };


    // Function to handle the final registration submission
    const handleRegister = async () => {
        // ... Logic to send 'selectedCourses' array to the .NET backend ...
        console.log("Attempting to register for courses:", selectedCourses);
        // ... (This logic will be more detailed later)
    };


    if (loading) return <div style={{ color: '#cccccc' }}>Loading courses...</div>;
    if (error) return <div style={{ color: '#ff8080' }}>Error: {error}</div>;

    return (
        <div>
            <h2>Course Registration - Available Semester Courses</h2>

            <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #333333' }}>
                <h3>Selected Courses ({selectedCourses.length})</h3>
                {/* Placeholder to show selected courses summary */}
                <p>{selectedCourses.length > 0 ? selectedCourses.join(', ') : 'No courses selected yet.'}</p>
                <button
                    onClick={handleRegister}
                    disabled={selectedCourses.length === 0}
                    style={{
                        backgroundColor: selectedCourses.length > 0 ? '#007bff' : '#333333',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        cursor: selectedCourses.length > 0 ? 'pointer' : 'not-allowed'
                    }}
                >
                    Submit Registration
                </button>
            </div>

            <div className="course-list">
                {/* This is where the list of courses will be mapped */}
                {availableCourses.length === 0 ? (
                    <p>No courses are currently available for registration.</p>
                ) : (
                    availableCourses.map(course => (
                        <div key={course.id} style={{
                            backgroundColor: '#333333',
                            padding: '1rem',
                            marginBottom: '1rem',
                            borderRadius: '4px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h4>{course.name} ({course.code})</h4>
                                <p>Instructor: {course.instructor}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => handleCourseSelection(course.id)}
                                style={{ width: '20px', height: '20px' }} // Simple checkbox style
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// NOTE: You must also update App.jsx to use this component at the '/student/register' path.