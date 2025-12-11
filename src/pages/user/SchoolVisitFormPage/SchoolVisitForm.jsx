import React, { useState } from "react";
import "./SchoolVisitForm.css";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function SchoolVisitForm() {
    const [formData, setFormData] = useState({
        schoolName: "",
        schoolAddress: "",
        contactPerson: "",
        contact: "",
        email: "",
        preferredDate: "",
        preferredTimeSlot: "",
        purpose: "",
        numberOfStudents: "",
        ageGroup: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch(`${baseUrl}/api/school-visit/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setTimeout(() => {
                    setLoading(false);
                    setSuccess(true);
                }, 1500);
                setFormData({
                    schoolName: "",
                    schoolAddress: "",
                    contactPerson: "",
                    contact: "",
                    email: "",
                    preferredDate: "",
                    preferredTimeSlot: "",
                    purpose: "",
                    numberOfStudents: "",
                    ageGroup: "",
                });
            } else {
                setLoading(false);
                alert("❌ Failed to submit request.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setLoading(false);
            alert("⚠️ Something went wrong!");
        }
    };

    return (
        <div className="visit-page-bg">
            <div className="visit-form-container">
                <h2 className="form-header">🏫 School Visit Application</h2>
                <p className="form-subtitle">
                    Fill out this form to plan your educational visit to Vigyan Ashram’s DIY Lab.
                </p>

                {loading && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                        <p>Submitting your request...</p>
                    </div>
                )}

                {success && (
                    <div className="success-popup">
                        <div className="success-circle">
                            <span className="tick">✔</span>
                        </div>
                        <h3>Booking Confirmed!</h3>
                        <p>Thank you for applying. Check your email for confirmation 📧</p>
                        <button className="ok-btn" onClick={() => setSuccess(false)}>OK</button>
                    </div>
                )}

                {!loading && !success && (
                    <form className="glass-form" onSubmit={handleSubmit}>
                        {/* School Info */}
                        <div className="form-section">
                            <h3>School Information</h3>
                            <div className="form-grid">
                                <input type="text" name="schoolName" placeholder="School Name" value={formData.schoolName} onChange={handleChange} required />
                                <input type="text" name="schoolAddress" placeholder="School Address" value={formData.schoolAddress} onChange={handleChange} required />
                                <input type="text" name="contactPerson" placeholder="Contact Person" value={formData.contactPerson} onChange={handleChange} required />
                                <input type="tel" name="contact" placeholder="Contact Number" value={formData.contact} onChange={handleChange} required />
                                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                            </div>
                        </div>

                        {/* Visit Details */}
                        <div className="form-section">
                            <h3>Visit Details</h3>
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Preferred Date</label>
                                    <input type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Preferred Time Slot</label>
                                    <select name="preferredTimeSlot" value={formData.preferredTimeSlot} onChange={handleChange} required>
                                        <option value="">Select Time Slot</option>
                                        <option value="Morning">Morning</option>
                                        <option value="Afternoon">Afternoon</option>
                                    </select>
                                </div>

                                <div className="input-group full-width">
                                    <label>Purpose of Visit</label>
                                    <input type="text" name="purpose" placeholder="Purpose" value={formData.purpose} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Participants */}
                        <div className="form-section">
                            <h3>Participants</h3>
                            <div className="form-grid">
                                <input type="number" name="numberOfStudents" placeholder="No. of Students" value={formData.numberOfStudents} onChange={handleChange} required />
                                <input type="text" name="ageGroup" placeholder="Grade Level / Age Group" value={formData.ageGroup} onChange={handleChange} />
                            </div>
                        </div>

                        <button type="submit" className="schoolVisit-submit-btn">Submit Request</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default SchoolVisitForm;
