import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./InternshipAdminPage.css";

export default function InternshipAdminPage() {
    const [applications, setApplications] = useState([]);
    const [filteredApps, setFilteredApps] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const BASE_URL = `${baseUrl}/api`;

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
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/internships`, { withCredentials: true });
            if (res.status === 401) {
                handleUnauthorized();
                return;
            }
            const data = Array.isArray(res.data) ? res.data : [];
            setApplications(data);
            setFilteredApps(data);
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else console.error("Error fetching internships:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        filterData(term, statusFilter);
    };

    const handleFilterChange = (status) => {
        setStatusFilter(status);
        filterData(searchTerm, status);
    };

    const filterData = (term, status) => {
        let filtered = applications.filter(
            (app) =>
                (app.firstName + " " + app.lastName)
                    .toLowerCase()
                    .includes(term.toLowerCase()) ||
                app.email.toLowerCase().includes(term.toLowerCase())
        );

        if (status !== "All") {
            filtered = filtered.filter(
                (a) => (a.status || "").toLowerCase() === status.toLowerCase()
            );
        }

        setFilteredApps(filtered);
    };

    const handleViewResume = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/internships/${id}/resume`, {
                credentials: "include"
            });
            if (response.status === 401) {
                handleUnauthorized();
                return;
            }
            const blob = await response.blob();
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL);
        } catch (error) {
            console.error("Error viewing resume:", error);
        }
    };

    const handleApprove = async (id) => {
        try {
            await axios.put(`${BASE_URL}/approve/${id}`, {}, { withCredentials: true });
            alert("Applicant approved! Mail will be sent automatically.");
            fetchApplications();
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Approval failed:", err);
                alert("Failed to approve. Try again.");
            }
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this application?")) return;
        try {
            await axios.put(`${BASE_URL}/internships/${id}/reject`, {}, { withCredentials: true });
            alert("Applicant rejected.");
            fetchApplications();
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Rejection failed:", err);
                alert("Failed to reject. Try again.");
            }
        }
    };

    const handleDownloadApproved = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/download`, {
                responseType: "blob",
                withCredentials: true
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "approved_internships.pdf");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            if (err.response && err.response.status === 401) handleUnauthorized();
            else {
                console.error("Error downloading approved list:", err);
                alert("Failed to download document.");
            }
        }
    };

    const handleBack = () => navigate("/admin/dashboard");

    return (
        <div className="internship-admin-container">
            <h1>Internship Applications</h1>

            <div className="filter-section">
                <input
                    type="text"
                    placeholder="Search by name or email..."
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
                    <option value="Rejected">Rejected</option>
                </select>
                <button onClick={handleDownloadApproved}>Download Approved List</button>
            </div>

            {loading ? (
                <p className="loading-text">Loading applications...</p>
            ) : filteredApps.length === 0 ? (
                <p className="no-data">No applications found.</p>
            ) : (
                <>
                    <div className="table-container">
                        <table className="internship-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Middle Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Age</th>
                                <th>City</th>
                                <th>Pin Code</th>
                                <th>State</th>
                                <th>Country</th>
                                <th>College Name</th>
                                <th>College City</th>
                                <th>Course</th>
                                <th>Current Year</th>
                                <th>CGPA</th>
                                <th>Applied Date</th>
                                <th>Status</th>
                                <th>Resume</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredApps.map((app) => (
                                <tr key={app.applicationId}>
                                    <td>{app.applicationId}</td>
                                    <td>{app.firstName}</td>
                                    <td>{app.middleName}</td>
                                    <td>{app.lastName}</td>
                                    <td>{app.email}</td>
                                    <td>{app.phoneNumber}</td>
                                    <td>{app.age}</td>
                                    <td>{app.city}</td>
                                    <td>{app.pinCode}</td>
                                    <td>{app.state}</td>
                                    <td>{app.country}</td>
                                    <td>{app.collegeName}</td>
                                    <td>{app.collegeCity}</td>
                                    <td>{app.courseName}</td>
                                    <td>{app.currYear}</td>
                                    <td>{app.cgpa}</td>
                                    <td>
                                        {app.dateOfApplication
                                            ? new Date(app.dateOfApplication).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>
                                        <span
                                            className={
                                                app.status === "Approved"
                                                    ? "status-badge approved"
                                                    : app.status === "Rejected"
                                                        ? "status-badge rejected"
                                                        : "status-badge pending"
                                            }
                                        >
                                            {app.status || "Pending"}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleViewResume(app.applicationId)}
                                        >
                                            View Resume
                                        </button>
                                    </td>
                                    <td>
                                        {app.status === "Pending" && (
                                            <>
                                                <button
                                                    className="approve-btn"
                                                    onClick={() => handleApprove(app.applicationId)}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="reject-btn"
                                                    onClick={() => handleReject(app.applicationId)}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="internship-bottom-buttons">
                        <button className="internship-back-btn" onClick={handleBack}>
                            ← Back to Dashboard
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
