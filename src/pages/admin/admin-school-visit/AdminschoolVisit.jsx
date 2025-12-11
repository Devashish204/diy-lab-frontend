import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminSchoolVisit.css";

export default function AdminSchoolVisits() {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // add baseUrl and API_BASE
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const API_BASE = `${baseUrl}/api`;
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

    const fetchVisits = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/school-visits`, {
                withCredentials: true,
            });
            setVisits(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            } else {
                console.error("Error fetching school visits:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.post(
                `${API_BASE}/admin/school-visit/${id}/status?status=${status}`,
                {},
                { withCredentials: true }
            );
            fetchVisits();
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleUnauthorized();
            } else {
                console.error("Error updating status:", err);
                alert("Failed to update status");
            }
        }
    };

    return (
        <div className="admin-school-visits-container">
            <div className="header-section">
                <h2 className="page-title">School Visit Requests</h2>
                <button
                    className="schoolVisit-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            {loading ? (
                <p className="loading-text">Loading requests...</p>
            ) : visits.length === 0 ? (
                <p className="no-data">No school visit requests found.</p>
            ) : (
                <div className="table-wrapper">
                    <table className="visit-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>School Name</th>
                            <th>Contact Person</th>
                            <th>Email</th>
                            <th>From</th>
                            <th>Time Slot</th>
                            <th>Purpose</th>
                            <th>Students</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {visits.map((v) => (
                            <tr key={v.requestId}>
                                <td>{v.requestId}</td>
                                <td>{v.schoolName}</td>
                                <td>{v.contactPerson}</td>
                                <td>{v.email}</td>
                                <td>{v.preferredDate || "—"}</td>
                                <td>{v.preferredTimeSlot || "—"}</td>
                                <td>{v.purpose}</td>
                                <td>{v.numberOfStudents}</td>
                                <td>
        <span className={`status-badge ${
            v.status === "ACCEPTED" ? "accepted" :
                v.status === "REJECTED" ? "rejected" : "pending"
        }`}>
            {v.status}
        </span>
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button
                                            className="accept-btn"
                                            onClick={() => updateStatus(v.requestId, "ACCEPTED")}
                                            disabled={v.status !== "PENDING"}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() => updateStatus(v.requestId, "REJECTED")}
                                            disabled={v.status !== "PENDING"}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
