import React, { useState } from "react";
import "./TeacherTrainingForm.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

export default function TeacherTrainingForm() {
    const [formData, setFormData] = useState({
        organizationName: "",
        organizationAddress: "",
        enquirerName: "",
        emailAddress: "",
        phoneNumber: "",
        preferredStartDate: "",
        preferredEndDate: "",
        selectedTrainings: [],
        numberOfTrainees: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const trainingOptions = [
        "Atal tinkering lab training",
        "STEAM lab training",
        "Electronics & Robotics training",
        "3D printing training",
        "2D & 3D Design training",
        "Python programming",
        "CNC Machining & Laser"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (training) => {
        setFormData((prev) => {
            const exists = prev.selectedTrainings.includes(training);
            return {
                ...prev,
                selectedTrainings: exists
                    ? prev.selectedTrainings.filter((t) => t !== training)
                    : [...prev.selectedTrainings, training],
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            const response = await fetch(`${baseUrl}/api/apply-teacher-training`, {
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
                    organizationName: "",
                    organizationAddress: "",
                    enquirerName: "",
                    emailAddress: "",
                    phoneNumber: "",
                    preferredStartDate: "",
                    preferredEndDate: "",
                    selectedTrainings: [],
                    numberOfTrainees: "",
                });
            } else {
                setLoading(false);
                alert("❌ Failed to submit teacher training request.");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setLoading(false);
            alert("⚠️ Something went wrong!");
        }
    };

    return (
        <div className="training-page-bg">
            <div className="training-form-container">
                <h2 className="form-header">👩‍🏫 Teacher Training Program Application</h2>
                <p className="form-subtitle">
                    Apply for hands-on training programs offered by Vigyan Ashram’s DIY Lab.
                </p>

                {loading && (
                    <div className="loader-overlay">
                        <div className="loader"></div>
                        <p>Submitting your application...</p>
                    </div>
                )}

                {success && (
                    <div className="success-popup">
                        <div className="success-circle">
                            <span className="tick">✔</span>
                        </div>
                        <h3>Application Submitted!</h3>
                        <p>We will contact you shortly 📧</p>
                        <button className="ok-btn" onClick={() => setSuccess(false)}>OK</button>
                    </div>
                )}

                {!loading && !success && (
                    <form className="glass-form" onSubmit={handleSubmit}>

                        {/* Organisation Info */}
                        <div className="form-section">
                            <h3>Organisation Information</h3>
                            <div className="form-grid">
                                <input
                                    type="text"
                                    name="organizationName"
                                    placeholder="Organisation Name"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="organizationAddress"
                                    placeholder="Organisation Address"
                                    value={formData.organizationAddress}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Enquirer Info */}
                        <div className="form-section">
                            <h3>Enquirer Details</h3>
                            <div className="form-grid">
                                <input
                                    type="text"
                                    name="enquirerName"
                                    placeholder="Enquirer Name"
                                    value={formData.enquirerName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="emailAddress"
                                    placeholder="Email Address"
                                    value={formData.emailAddress}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Training Selection */}
                        <div className="form-section">
                            <h3>Select Training Program(s)</h3>

                            <div className="checkbox-grid">
                                {trainingOptions.map((training, index) => (
                                    <label key={index} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedTrainings.includes(training)}
                                            onChange={() => handleCheckboxChange(training)}
                                        />
                                        {training}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="form-section">
                            <h3>Training Schedule Preference</h3>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Preferred Start Date</label>
                                    <input
                                        type="date"
                                        name="preferredStartDate"
                                        value={formData.preferredStartDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Preferred End Date</label>
                                    <input
                                        type="date"
                                        name="preferredEndDate"
                                        value={formData.preferredEndDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trainees */}
                        <div className="form-section">
                            <h3>Trainee Information</h3>
                            <div className="form-grid">
                                <input
                                    type="number"
                                    name="numberOfTrainees"
                                    placeholder="Number of Trainees"
                                    value={formData.numberOfTrainees}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="training-submit-btn">
                            Submit Training Application
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
