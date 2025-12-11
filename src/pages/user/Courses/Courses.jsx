import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Header.jsx";
import "./Courses.css";
import coursesLogo from "../../../../public/images/Courses-Images/online-course.png";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
const apiBase = `${baseUrl}/api`;

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await axios.get(`${apiBase}/courses`);
            setCourses(res.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        } finally {
            setLoading(false);
        }
    }

    function getEmbedUrl(url) {
        try {
            const u = new URL(url);
            const v = u.searchParams.get("v");
            if (v) return `https://www.youtube.com/embed/${v}`;
            const path = u.pathname.split("/").pop();
            if (path) return `https://www.youtube.com/embed/${path}`;
        } catch {
            return "";
        }
    }

    return (
        <>
            <Header />
            <div className="courses-page">
                <section className="section yellow">
                    <div className="section-header">
                        <img src={coursesLogo} alt="Courses Logo" />
                        <h2>Available Courses</h2>
                    </div>
                    <p>Explore our workshops and start your learning journey today!</p>
                </section>

                <div className="courses-grid">
                    {loading && <p className="loading-text">Loading courses...</p>}
                    {!loading && courses.length === 0 && (
                        <p className="no-courses">No courses available yet.</p>
                    )}

                    {courses.map((course) => (
                        <div className="course-card" key={course.id}>
                            <div className="course-content">
                                <div className="course-text">
                                    <h3>{course.title}</h3>
                                    <p><strong>Grade:</strong> {course.grade}</p>
                                    <p>
                                        <strong>Duration:</strong> {course.durationMin} - {course.durationMax} Days
                                    </p>
                                </div>
                                <div className="course-video">
                                    <iframe
                                        src={getEmbedUrl(course.youtubeUrl)}
                                        title={course.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
