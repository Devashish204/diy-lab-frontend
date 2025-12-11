import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminFeedback.css";

export default function AdminFeedback() {
    const [feedbacks, setFeedbacks] = useState([]);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    // Vite env base
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const API_BASE = `${baseUrl}/api`;
    axios.defaults.withCredentials = true;

    // ✅ Protect this page — only logged-in ADMIN can access
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
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get(`${API_BASE}/feedback/all`, {
                withCredentials: true,
            });
            setFeedbacks(res.data);
            setFilteredFeedbacks(res.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                console.error("Error fetching feedbacks:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        try {
            await axios.delete(`${API_BASE}/feedback/${id}`, { withCredentials: true });
            setFeedbacks((prev) => prev.filter((f) => f.id !== id));
            setFilteredFeedbacks((prev) => prev.filter((f) => f.id !== id));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                handleUnauthorized();
            } else {
                console.error("Error deleting feedback:", error);
                alert("Failed to delete feedback");
            }
        }
    };

    const handleFilter = () => {
        if (!fromDate || !toDate) {
            setFilteredFeedbacks(feedbacks);
            return;
        }
        const filtered = feedbacks.filter((f) => {
            const feedbackDate = new Date(f.date);
            return feedbackDate >= new Date(fromDate) && feedbackDate <= new Date(toDate);
        });
        setFilteredFeedbacks(filtered);
    };

    const handleClearFilter = () => {
        setFromDate("");
        setToDate("");
        setFilteredFeedbacks(feedbacks);
    };

    return (
        <div className="admin-feedback-container">
            <div className="header-section">
                <h2 className="admin-feedback-title">User Feedbacks</h2>
                <button
                    className="feedback-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="filter-container">
                <div className="date-filter">
                    <label>From:</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                </div>
                <div className="date-filter">
                    <label>To:</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                </div>
                <button className="filter-btn" onClick={handleFilter}>
                    Filter
                </button>
                <button className="clear-btn" onClick={handleClearFilter}>
                    Clear
                </button>
            </div>

            {loading ? (
                <p>Loading feedbacks...</p>
            ) : filteredFeedbacks.length === 0 ? (
                <p>No feedbacks found.</p>
            ) : (
                <table className="feedback-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating</th>
                        <th>Comments</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredFeedbacks.map((f) => (
                        <tr key={f.id}>
                            <td>{f.id}</td>
                            <td>{f.name}</td>
                            <td>{f.email}</td>
                            <td>{f.rating}</td>
                            <td>{f.comments}</td>
                            <td>{new Date(f.date).toLocaleString()}</td>
                            <td>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(f.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
