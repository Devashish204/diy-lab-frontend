import React, { useEffect, useState } from "react";
import "./AdminTeacherTraining.css";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

export default function AdminTeacherTraining() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const response = await fetch(`${baseUrl}/api/teacher-training/all`);
            const data = await response.json();
            setApplications(data);
        } catch (err) {
            console.error("Failed to fetch applications:", err);
        } finally {
            setLoading(false);
        }
    };

    const deleteApplication = async (id) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;

        try {
            const response = await fetch(`${baseUrl}/api/teacher-training/delete/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setApplications(applications.filter(app => app.applicationId !== id));
                alert("Application deleted successfully");
            } else {
                alert("Failed to delete application");
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    return (
        <div className="admin-training-container">

            {/* Back Button */}
            <button className="back-btn" onClick={() => navigate("/admin")}>
                ← Back to Dashboard
            </button>

            <h2 className="admin-title">Teacher Training Applications</h2>

            {loading ? (
                <p className="loading-text">Loading applications...</p>
            ) : (
                <div className="table-wrapper">
                    <table className="training-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th className="wide-col">Organisation Name</th>
                            <th>Address</th>
                            <th className="wide-col">Enquirer Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th className="training-col">Trainings Selected</th>
                            <th className="medium-col">Start Date</th>
                            <th className="medium-col">End Date</th>
                            <th className="small-col">Trainees</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {applications.map((app) => (
                            <tr key={app.applicationId}>
                                <td>{app.applicationId}</td>
                                <td className="wide-col">{app.organizationName}</td>
                                <td>{app.organizationAddress}</td>
                                <td className="wide-col">{app.enquirerName}</td>
                                <td>{app.emailAddress}</td>
                                <td>{app.phoneNumber}</td>

                                <td className="training-col">
                                    <ul className="training-list">
                                        {app.selectedTrainings?.map((t, index) => (
                                            <li key={index}>{t}</li>
                                        ))}
                                    </ul>
                                </td>

                                <td className="medium-col">{app.preferredStartDate}</td>
                                <td className="medium-col">{app.preferredEndDate}</td>
                                <td className="small-col">{app.numberOfTrainees}</td>

                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteApplication(app.applicationId)}
                                    >
                                        Delete
                                    </button>
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
