import React, { useState } from "react";
import "./AppointmentForm.css";
import appointmentLogo from "../../../../public/images/Appointment-Images/appointment.png";
import Header from "../../../components/Header.jsx";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

export default function AppointmentForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        preferredDate: "",
        preferredTime: "",
        reason: "",
        meetingMode: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showNotice, setShowNotice] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch(`${baseUrl}/api/appointments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                setFormData({
                    firstName: "",
                    lastName: "",
                    phoneNumber: "",
                    email: "",
                    preferredDate: "",
                    preferredTime: "",
                    reason: "",
                    meetingMode: "",
                });
                setTimeout(() => setSuccess(false), 2500);
            } else {
                alert("Failed to submit appointment.");
            }
        } catch (error) {
            console.error("Error submitting appointment:", error);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <section className="section yellow appointment-header">
                <div className="section-header">
                    <img src={appointmentLogo} alt="Appointment Icon" />
                    <h2>Book Your Appointment</h2>
                </div>
                <p>Schedule your session with our experts and get personalized guidance.</p>
            </section>

            {showNotice && (
                <div className="notice-box">
                    <p>
                        ⚠ Before applying for an appointment, please check the available days and timing with
                        the DIY Lab office to avoid rejection due to invalid schedule.
                    </p>
                    <button onClick={() => setShowNotice(false)} className="close-btn">×</button>
                </div>
            )}

            <div className="appointment-form-container">
                <h2>Apply for an Appointment</h2>
                <form className="appointment-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group half">
                            <label>First Name</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Last Name</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Preferred Date</label>
                            <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group half">
                            <label>Preferred Time</label>
                            <input type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Reason for Appointment</label>
                        <textarea name="reason" placeholder="Briefly describe your purpose..." value={formData.reason} onChange={handleChange} required></textarea>
                    </div>

                    <div className="form-group">
                        <label>Preferred Meeting Mode</label>
                        <select name="meetingMode" value={formData.meetingMode} onChange={handleChange} required>
                            <option value="">Select Mode</option>
                            <option value="Offline">Offline</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>

                    <button type="submit" className="appointment-submit-btn" disabled={loading}>
                        {loading ? <span className="loader"></span> : "Submit Appointment"}
                    </button>
                </form>
            </div>

            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <div>Submitting...</div>
                </div>
            )}

            {success && (
                <div className="loading-overlay">
                    <div className="success-tick">✔</div>
                    <div className="status-text">Appointment Submitted Successfully</div>
                </div>
            )}
        </>
    );
}
