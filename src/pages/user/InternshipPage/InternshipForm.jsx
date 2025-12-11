import React, { useState } from "react";
import Header from "../../../components/Header.jsx";
import "./InternshipForm.css";
import internshipLogo from "../../../../public/images/InternshipPage/internship.png";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function InternshipPage() {
    const [formData, setFormData] = useState({
        firstName: "", middleName: "", lastName: "", email: "",
        phoneNumber: "", age: "", city: "", pinCode: "", state: "",
        country: "", collegeName: "", collegeCity: "", courseName: "",
        currYear: "", cgpa: "", resumePdf: null,
    });

    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "resumePdf") {
            setFormData({ ...formData, resumePdf: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        const payload = { ...formData };
        delete payload.resumePdf;

        const data = new FormData();
        data.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
        if (formData.resumePdf) data.append("resumePdf", formData.resumePdf);

        try {
            const response = await fetch(`${baseUrl}/api/student/internships`, {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 2500);
                setFormData({
                    firstName: "", middleName: "", lastName: "", email: "",
                    phoneNumber: "", age: "", city: "", pinCode: "", state: "",
                    country: "", collegeName: "", collegeCity: "", courseName: "",
                    currYear: "", cgpa: "", resumePdf: null,
                });
            } else {
                setStatus("error");
                alert("Failed to submit application.");
            }
        } catch (error) {
            console.error(error);
            setStatus("error");
            alert("Something went wrong!");
        }
    };

    return (
        <>
            <Header />
            <div className="internship-page">

                <section className="section yellow">
                    <div className="section-header">
                        <img src={internshipLogo} alt="Internship Logo" />
                        <h2>Internship Application</h2>
                    </div>
                    <p>Apply for a hands-on internship at DIY Lab and turn your ideas into reality!</p>
                </section>

                <form className="application-form section white" onSubmit={handleSubmit} encType="multipart/form-data">
                    <h3 className="form-section-title">Personal Information</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>First Name *</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Middle Name</label><input type="text" name="middleName" value={formData.middleName} onChange={handleChange} /></div>
                        <div className="form-group"><label>Last Name *</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Email *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Phone *</label><input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Age</label><input type="number" name="age" value={formData.age} onChange={handleChange} /></div>
                    </div>

                    <h3 className="form-section-title">Address Details</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>City *</label><input type="text" name="city" value={formData.city} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Pin Code</label><input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} /></div>
                        <div className="form-group"><label>State</label><input type="text" name="state" value={formData.state} onChange={handleChange} /></div>
                        <div className="form-group"><label>Country</label><input type="text" name="country" value={formData.country} onChange={handleChange} /></div>
                    </div>

                    <h3 className="form-section-title">Education</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>College Name</label><input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} /></div>
                        <div className="form-group"><label>College City</label><input type="text" name="collegeCity" value={formData.collegeCity} onChange={handleChange} /></div>
                        <div className="form-group"><label>Course Name</label><input type="text" name="courseName" value={formData.courseName} onChange={handleChange} /></div>
                        <div className="form-group"><label>Current Year</label><input type="text" name="currYear" value={formData.currYear} onChange={handleChange} /></div>
                        <div className="form-group"><label>CGPA</label><input type="text" name="cgpa" value={formData.cgpa} onChange={handleChange} /></div>
                    </div>

                    <h3 className="form-section-title">Resume Upload</h3>
                    <div className="form-group resume-upload">
                        <label>Upload Resume (PDF) *</label>
                        <div className="file-upload-wrapper">
                            <label htmlFor="resumePdf" className="upload-btn">📁 Choose File</label>
                            <span className="file-name">{formData.resumePdf ? formData.resumePdf.name : "No file chosen"}</span>
                            <input type="file" id="resumePdf" name="resumePdf" accept="application/pdf" onChange={handleChange} required />
                        </div>
                    </div>

                    <button type="submit" className="btn" disabled={status === "loading"}>
                        {status === "loading" ? "Submitting..." : "Submit Application"}
                    </button>
                </form>

                {status === "loading" && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <div className="status-text">Your application is being processed...</div>
                    </div>
                )}

                {status === "success" && (
                    <div className="success-popup">
                        <div className="success-tick">✔</div>
                        <div className="status-text">Application submitted successfully!</div>
                    </div>
                )}
            </div>
        </>
    );
}

export default InternshipPage;
