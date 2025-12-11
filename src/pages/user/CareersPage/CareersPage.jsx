import React, { useState } from "react";
import Header from "../../../components/Header.jsx";
import "./CareersPage.css";
import careerLogo from "../../../../public/images/CareersPage-Images/career-path.png";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function CareerPage() {
    const [formData, setFormData] = useState({
        firstName: "", middleName: "", lastName: "",
        dateOfBirth: "", gender: "", nationality: "",
        email: "", phoneNumber: "", alternatePhoneNumber: "",
        address: "", city: "", state: "", country: "", pinCode: "",
        linkedIn: "", gitHub: "",
        qualification: "", degree: "", fieldOfStudy: "", university: "",
        passingYear: "", cgpa: "", certifications: "",
        experience: 0, currentStatus: "", previousCompany: "", jobTitle: "",
        duration: 0, responsibilities: "",
        technicalSkills: "", softSkills: "", languagesKnown: ""
    });

    const [files, setFiles] = useState({
        resumePdf: null,
        passportSizePhoto: null,
        idProof: null
    });

    const [status, setStatus] = useState("idle");

    const handleChange = (e) => {
        const { name, value, files: fileInput } = e.target;
        if (fileInput) {
            setFiles({ ...files, [name]: fileInput[0] });
        } else if (name === "experience" || name === "duration" || name === "passingYear") {
            setFormData({ ...formData, [name]: value ? parseInt(value, 10) : 0 });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        const data = new FormData();
        data.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));

        if (files.resumePdf) data.append("resumePdf", files.resumePdf);
        if (files.passportSizePhoto) data.append("passportSizePhoto", files.passportSizePhoto);
        if (files.idProof) data.append("idProof", files.idProof);

        try {
            const response = await fetch(`${baseUrl}/api/careers`, {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setStatus("success");
                setTimeout(() => setStatus("idle"), 2500);
                setFormData({
                    firstName: "", middleName: "", lastName: "",
                    dateOfBirth: "", gender: "", nationality: "",
                    email: "", phoneNumber: "", alternatePhoneNumber: "",
                    address: "", city: "", state: "", country: "", pinCode: "",
                    linkedIn: "", gitHub: "",
                    qualification: "", degree: "", fieldOfStudy: "", university: "",
                    passingYear: "", cgpa: "", certifications: "",
                    experience: 0, currentStatus: "", previousCompany: "", jobTitle: "",
                    duration: 0, responsibilities: "",
                    technicalSkills: "", softSkills: "", languagesKnown: ""
                });
                setFiles({ resumePdf: null, passportSizePhoto: null, idProof: null });
            } else {
                setStatus("error");
                const errorText = await response.text();
                alert("Failed to submit application: " + errorText);
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
            <div className="career-page">
                <section className="section yellow">
                    <div className="section-header">
                        <img src={careerLogo} alt="Career Logo" />
                        <h2>Career Application</h2>
                    </div>
                    <p>Apply for a career opportunity at DIY Lab and shape the future with us!</p>
                </section>

                <form className="application-form section white" onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Personal Information */}
                    <h3 className="form-section-title">Personal Information</h3>
                    <div className="form-grid">
                        {["firstName", "middleName", "lastName", "dateOfBirth", "gender", "nationality", "email", "phoneNumber", "alternatePhoneNumber", "address", "city", "state", "country", "pinCode"].map((field, i) => (
                            <div className="form-group" key={i}>
                                <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                                <input
                                    type={field === "email" ? "email" : field === "dateOfBirth" ? "date" : field === "phoneNumber" || field === "alternatePhoneNumber" || field === "pinCode" ? "tel" : "text"}
                                    name={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                            </div>
                        ))}
                    </div>

                    <h3 className="form-section-title">Professional Links</h3>
                    <div className="form-grid">
                        <div className="form-group"><label>LinkedIn</label><input type="url" name="linkedIn" value={formData.linkedIn} onChange={handleChange} /></div>
                        <div className="form-group"><label>GitHub</label><input type="url" name="gitHub" value={formData.gitHub} onChange={handleChange} /></div>
                    </div>

                    <h3 className="form-section-title">Education</h3>
                    <div className="form-grid">
                        {["qualification", "degree", "fieldOfStudy", "university", "passingYear", "cgpa", "certifications"].map((field, i) => (
                            <div className="form-group" key={i}>
                                <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                                <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                            </div>
                        ))}
                    </div>

                    <h3 className="form-section-title">Work Experience</h3>
                    <div className="form-grid">
                        {["experience", "currentStatus", "previousCompany", "jobTitle", "duration", "responsibilities"].map((field, i) => (
                            <div className="form-group" key={i}>
                                <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                                <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                            </div>
                        ))}
                    </div>

                    <h3 className="form-section-title">Skills</h3>
                    <div className="form-grid">
                        {["technicalSkills", "softSkills", "languagesKnown"].map((field, i) => (
                            <div className="form-group" key={i}>
                                <label>{field.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</label>
                                <input type="text" name={field} value={formData[field]} onChange={handleChange} />
                            </div>
                        ))}
                    </div>

                    <h3 className="form-section-title">Uploads</h3>
                    <div className="form-grid">
                        <div className="form-group resume-upload">
                            <label>Upload Resume (PDF) *</label>
                            <div className="file-upload-wrapper">
                                <label htmlFor="resumePdf" className="upload-btn">📁 Choose File</label>
                                <span className="file-name">{files.resumePdf ? files.resumePdf.name : "No file chosen"}</span>
                                <input type="file" id="resumePdf" name="resumePdf" accept="application/pdf" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="form-group resume-upload">
                            <label>Passport Size Photo</label>
                            <div className="file-upload-wrapper">
                                <label htmlFor="passportSizePhoto" className="upload-btn">📷 Choose Photo</label>
                                <span className="file-name">{files.passportSizePhoto ? files.passportSizePhoto.name : "No file chosen"}</span>
                                <input type="file" id="passportSizePhoto" name="passportSizePhoto" accept="image/*" onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-group resume-upload">
                            <label>ID Proof</label>
                            <div className="file-upload-wrapper">
                                <label htmlFor="idProof" className="upload-btn">🪪 Choose File</label>
                                <span className="file-name">{files.idProof ? files.idProof.name : "No file chosen"}</span>
                                <input type="file" id="idProof" name="idProof" accept="image/*,application/pdf" onChange={handleChange} />
                            </div>
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

export default CareerPage;
