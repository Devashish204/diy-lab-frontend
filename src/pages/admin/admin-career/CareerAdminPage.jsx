import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CareerAdminPage.css";

export default function CareerAdminPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // baseUrl from Vite
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const BASE_URL = `${baseUrl}/api/careers`;

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
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/all`, { withCredentials: true });
            if (res.status === 401) {
                handleUnauthorized();
                return;
            }
            setApplications(res.data);
            setFilteredApps(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else console.error("Error fetching career applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        const filtered = applications.filter((app) =>
            `${app.firstName} ${app.lastName}`.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredApps(filtered);
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        if (status === "All") {
            setFilteredApps(applications);
        } else {
            const filtered = applications.filter((app) => app.currentStatus === status);
            setFilteredApps(filtered);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${BASE_URL}/approve/${id}`, {}, { withCredentials: true });
            alert(`Application ID ${id} approved successfully`);
            setApplications((prev) =>
                prev.map((app) =>
                    app.applicationId === id ? { ...app, currentStatus: "Approved" } : app
                )
            );
            setFilteredApps((prev) =>
                prev.map((app) =>
                    app.applicationId === id ? { ...app, currentStatus: "Approved" } : app
                )
            );
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Error approving application:", err);
                alert("Failed to approve application");
            }
        }
    };

    const handleViewFile = async (id, type) => {
        try {
            const res = await fetch(`${BASE_URL}/${id}/${type}`, {
                method: "GET",
                credentials: "include",
            });
            if (res.status === 401) {
                handleUnauthorized();
                return;
            }
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
        } catch (err) {
            console.error("Error viewing file:", err);
        }
    };

    const handleDownloadApprovedPDF = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/approved/download`, {
                responseType: "blob",
                withCredentials: true,
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "approved_careers.pdf");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Error downloading PDF:", err);
                alert("Failed to download PDF");
            }
        }
    };

    const handleBack = () => {
        navigate("/admin/dashboard");
    };

    if (loading) return <p className="loading">Loading applications...</p>;

    return (
        <div className="career-admin-container">
            <h1>Career Applications Admin</h1>

            <div className="controls">
                <input
                    type="text"
                    placeholder="🔍 Search by name..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => handleFilterChange(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                </select>
                <button className="download-btn" onClick={handleDownloadApprovedPDF}>
                    📄 Download Approved PDF
                </button>
            </div>

            <div className="table-wrapper">
                <div className="table-container">
                    <table className="career-table">
                        <thead>
                        <tr>
                            {[
                                "ID", "Name", "DOB", "Gender", "Email", "Phone", "Alt Phone",
                                "Address", "City", "State", "Country", "Pin", "LinkedIn",
                                "GitHub", "Qualification", "Degree", "Field", "University",
                                "Passing Year", "CGPA", "Certifications", "Experience",
                                "Current Status", "Previous Company", "Job Title", "Duration",
                                "Responsibilities", "Technical Skills", "Soft Skills",
                                "Languages", "Date Applied", "Resume", "Photo", "ID Proof", "Action"
                            ].map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredApps.map((app) => (
                            <tr
                                key={app.applicationId}
                                className={app.currentStatus === "Approved" ? "approved-row" : ""}
                            >
                                <td>{app.applicationId}</td>
                                <td>{app.firstName} {app.lastName}</td>
                                <td>{app.dateOfBirth}</td>
                                <td>{app.gender}</td>
                                <td>{app.email}</td>
                                <td>{app.phoneNumber}</td>
                                <td>{app.alternatePhoneNumber}</td>
                                <td>{app.address}</td>
                                <td>{app.city}</td>
                                <td>{app.state}</td>
                                <td>{app.country}</td>
                                <td>{app.pinCode}</td>
                                <td>{app.linkedIn}</td>
                                <td>{app.gitHub}</td>
                                <td>{app.qualification}</td>
                                <td>{app.degree}</td>
                                <td>{app.fieldOfStudy}</td>
                                <td>{app.university}</td>
                                <td>{app.passingYear}</td>
                                <td>{app.cgpa}</td>
                                <td>{app.certifications}</td>
                                <td>{app.experience}</td>
                                <td
                                    style={{
                                        color: app.currentStatus === "Approved" ? "green" : "orange",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {app.currentStatus}
                                </td>
                                <td>{app.previousCompany}</td>
                                <td>{app.jobTitle}</td>
                                <td>{app.duration}</td>
                                <td>{app.responsibilities}</td>
                                <td>{app.technicalSkills}</td>
                                <td>{app.softSkills}</td>
                                <td>{app.languagesKnown}</td>
                                <td>{new Date(app.dateOfApplication).toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleViewFile(app.applicationId, "resume")}>
                                        Resume
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleViewFile(app.applicationId, "photo")}>
                                        Photo
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => handleViewFile(app.applicationId, "idproof")}>
                                        ID
                                    </button>
                                </td>
                                <td>
                                    {app.currentStatus !== "Approved" ? (
                                        <button
                                            className="approve-btn"
                                            onClick={() => handleApprove(app.applicationId)}
                                        >
                                            Approve
                                        </button>
                                    ) : (
                                        <span className="approved-text">✔ Approved</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bottom-buttons">
                <button className="career-back-btn" onClick={handleBack}>
                    ← Back to Dashboard
                </button>
            </div>
        </div>
    );
}
