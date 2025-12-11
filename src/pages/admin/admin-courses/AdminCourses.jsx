import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminCourses.css";

export default function AdminCourses() {
    const [courses, setCourses] = useState([]);
    const [form, setForm] = useState({
        title: "",
        grade: "",
        durationMin: "",
        durationMax: "",
        youtubeUrl: "",
    });
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const apiBase = `${baseUrl}/api`;

    axios.defaults.withCredentials = true;

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/admin-login");
            return;
        }
        const user = JSON.parse(storedUser);
        if (user.role !== "ADMIN") {
            localStorage.removeItem("user");
            navigate("/admin-login");
        }
    }, [navigate]);

    const handleUnauthorized = () => {
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    async function fetchCourses() {
        try {
            setLoading(true);
            const res = await axios.get(`${apiBase}/courses`, { withCredentials: true });
            setCourses(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            } else {
                console.error("Error fetching courses:", err);
            }
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const payload = {
            title: form.title,
            grade: form.grade,
            durationMin: Number(form.durationMin),
            durationMax: Number(form.durationMax),
            youtubeUrl: form.youtubeUrl,
        };

        try {
            setLoading(true);
            if (editingId) {
                await axios.put(`${apiBase}/admin/courses/${editingId}`, payload, {
                    withCredentials: true,
                });
            } else {
                await axios.post(`${apiBase}/admin/courses`, payload, {
                    withCredentials: true,
                });
            }
            resetForm();
            fetchCourses();
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Save failed:", err);
                alert("Save failed. Check console for details.");
            }
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setForm({
            title: "",
            grade: "",
            durationMin: "",
            durationMax: "",
            youtubeUrl: "",
        });
        setEditingId(null);
    }

    async function handleDelete(id) {
        if (!window.confirm("Delete this course?")) return;
        try {
            setLoading(true);
            await axios.delete(`${apiBase}/admin/courses/${id}`, { withCredentials: true });
            fetchCourses();
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Delete failed:", err);
                alert("Delete failed");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(course) {
        setEditingId(course.id);
        setForm({
            title: course.title,
            grade: course.grade,
            durationMin: course.durationMin,
            durationMax: course.durationMax,
            youtubeUrl: course.youtubeUrl,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleBack() {
        navigate("/admin/dashboard");
    }

    return (
        <div className="admin-courses-container">
            <button className="course-back-btn" onClick={handleBack}>← Back</button>
            <h1 className="page-title">🎓 Admin — Manage Courses</h1>

            <form className="course-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>Course Title</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter course title"
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Grade / Level</label>
                    <input
                        name="grade"
                        value={form.grade}
                        onChange={handleChange}
                        placeholder="Enter grade or level (e.g. Beginner, Class 10, etc.)"
                        required
                    />
                </div>

                <div className="form-row">
                    <label>Duration (Days)</label>
                    <input
                        type="number"
                        name="durationMin"
                        value={form.durationMin}
                        onChange={handleChange}
                        min="1"
                        placeholder="Min days"
                        required
                    />
                    <input
                        type="number"
                        name="durationMax"
                        value={form.durationMax}
                        onChange={handleChange}
                        min="1"
                        placeholder="Max days"
                        required
                    />
                </div>

                <div className="form-row">
                    <label>YouTube URL</label>
                    <input
                        name="youtubeUrl"
                        value={form.youtubeUrl}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=..."
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading}>
                        {editingId ? "Update Course" : "Add Course"}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="cancel-btn">
                            Cancel
                        </button>
                    )}
                </div>
            </form>

            <section className="courses-section">
                <h2>📚 Existing Courses</h2>
                {loading && <p className="loading-text">Loading...</p>}
                {!loading && courses.length === 0 && (
                    <p className="no-courses">No courses available yet.</p>
                )}

                <div className="course-grid">
                    {courses.map((c) => (
                        <div className="course-card" key={c.id}>
                            <div className="card-header">
                                <h3>{c.title}</h3>
                                <p>Grade: {c.grade}</p>
                            </div>
                            <div className="card-body">
                                <p>
                                    Duration: {c.durationMin} - {c.durationMax} days
                                </p>
                                <div className="video-frame">
                                    <iframe
                                        src={getEmbedUrl(c.youtubeUrl)}
                                        title={c.title}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                            <div className="card-actions">
                                <button onClick={() => handleEdit(c)}>Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(c.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
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
