import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageAppointments.css";
import Modal from "../../../components/Modal";
import { useNavigate } from "react-router-dom";

const prod = import.meta.env.VITE_API_BASE_URL_PROD;
const baseUrl = prod || import.meta.env.VITE_API_BASE_URL || "";
const API_BASE_URL = `${baseUrl}/api`;

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [scheduleForm, setScheduleForm] = useState({
        appointmentDate: "",
        appointmentTime: "",
        venue: "",
        mode: "In-person",
        meetingLink: ""
    });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState("");

    const navigate = useNavigate();
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
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/admin/appointments`, {
                credentials: "include"
            });
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            if (!response.ok) throw new Error("Failed to fetch appointments");
            const data = await response.json();
            setAppointments(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openScheduleModal = (appointment) => {
        if (!appointment) return;
        setCurrentAppointment(appointment);
        setScheduleForm({
            appointmentDate: String(appointment.appointmentDate || ""),
            appointmentTime: String(appointment.appointmentTime || ""),
            venue: String(appointment.venue || ""),
            mode: String(appointment.mode || "In-person"),
            meetingLink: String(appointment.meetingLink || "")
        });
        setShowScheduleModal(true);
    };

    const closeScheduleModal = () => {
        setShowScheduleModal(false);
        setCurrentAppointment(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setScheduleForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleScheduleSubmit = async (e) => {
        e.preventDefault();
        if (!currentAppointment) return;
        const payload = { ...scheduleForm };
        if (payload.mode !== "Virtual") payload.meetingLink = null;

        setActionMessage("Scheduling appointment...");
        setActionLoading(true);

        try {
            const response = await fetch(
                `${baseUrl}/api/appointments/${currentAppointment.id}/schedule`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    credentials: "include"
                }
            );
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            if (!response.ok) throw new Error("Failed to schedule appointment");

            const updatedAppointment = await response.json();
            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === updatedAppointment.id ? updatedAppointment : app
                )
            );
            closeScheduleModal();
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setActionMessage("");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this appointment?")) return;
        setActionMessage("Rejecting appointment...");
        setActionLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/appointments/${id}/reject`, {
                method: "PUT",
                credentials: "include"
            });
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            if (!response.ok) throw new Error("Failed to reject appointment");
            setAppointments((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status: "Rejected", scheduled: false } : app
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setActionMessage("");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this record?")) return;
        setActionMessage("Deleting appointment...");
        setActionLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/appointments/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            if (!response.ok) throw new Error("Failed to delete appointment");
            setAppointments((prev) => prev.filter((app) => app.id !== id));
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
            setActionMessage("");
        }
    };

    if (loading) return <div className="loading">Loading appointments...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;

    return (
        <div className="admin-appointments-container">

            <div className="appointments-header">
                <h1>Manage Appointments</h1>
                <button className="back-btn" onClick={() => navigate("/admin/dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="table-responsive">
                <table>
                    <thead>
                    <tr>
                        <th>Applicant</th>
                        <th>Contact</th>
                        <th>Requested Date/Time</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {appointments.map((app) => (
                        <tr key={app.id}>
                            <td>{app.firstName} {app.lastName}</td>
                            <td>{app.email}<br />{app.phoneNumber}</td>
                            <td>
                                {app.preferredDate ? new Date(app.preferredDate).toLocaleDateString("en-IN") : "—"}
                                <br />
                                {app.preferredTime ? app.preferredTime : "—"}
                            </td>
                            <td>{app.reason}</td>
                            <td>
                                <span className={`status-badge status-${app.status?.toLowerCase()}`}>
                                    {app.status}
                                </span>
                            </td>
                            <td className="action-buttons">
                                {app.status === "Pending" && (
                                    <>
                                        <button
                                            className="appointment-btn-schedule"
                                            onClick={() => openScheduleModal(app)}
                                            disabled={actionLoading}
                                        >
                                            Schedule
                                        </button>
                                        <button
                                            className="appointment-btn-reject"
                                            onClick={() => handleReject(app.id)}
                                            disabled={actionLoading}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                <button
                                    className="appointment-btn-delete"
                                    onClick={() => handleDelete(app.id)}
                                    disabled={actionLoading}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showScheduleModal && currentAppointment && (
                <Modal open={showScheduleModal} onClose={closeScheduleModal} title="Schedule Appointment">
                    <p>For: {currentAppointment.firstName} {currentAppointment.lastName}</p>
                    <form onSubmit={handleScheduleSubmit}>
                        <div className="form-group">
                            <label>Date</label>
                            <input type="date" name="appointmentDate" value={scheduleForm.appointmentDate} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Time</label>
                            <input type="time" name="appointmentTime" value={scheduleForm.appointmentTime} onChange={handleFormChange} required />
                        </div>
                        <div className="form-group">
                            <label>Mode</label>
                            <select name="mode" value={scheduleForm.mode} onChange={handleFormChange}>
                                <option value="In-person">In-person</option>
                                <option value="Virtual">Virtual</option>
                            </select>
                        </div>
                        {scheduleForm.mode === "Virtual" && (
                            <div className="form-group">
                                <label>Meeting Link</label>
                                <input type="text" name="meetingLink" value={scheduleForm.meetingLink} onChange={handleFormChange} required />
                            </div>
                        )}
                        <div className="form-group">
                            <label>Venue</label>
                            <input type="text" name="venue" value={scheduleForm.venue} onChange={handleFormChange} required />
                        </div>
                        <div className="modal-actions">
                            <button type="submit" className="appointment-confirm-btn" disabled={actionLoading}>Confirm</button>
                            <button type="button" className="appointment-cancel-btn" onClick={closeScheduleModal}>Cancel</button>
                        </div>
                    </form>
                </Modal>
            )}

        </div>
    );
};

export default ManageAppointments;
