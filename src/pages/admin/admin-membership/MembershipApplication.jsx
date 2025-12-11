import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MembershipApplication.css";

const MembershipApplications = () => {
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

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

    const fetchApplications = () => {
        fetch(`${baseUrl}/api/fetch-membership-applications`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) {
                    handleUnauthorized();
                    return [];
                }
                if (!res.ok) throw new Error("Failed to fetch applications");
                return res.json();
            })
            .then((data) => {
                setApplications(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching applications:", err);
                setLoading(false);
            });
    };

    const updateApplicationStatus = (applicationId, endpoint) => {
        if (!applicationId) return;
        setProcessingId(applicationId);

        fetch(`${baseUrl}/api/${endpoint}/${applicationId}`, {
            method: "POST",
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) {
                    handleUnauthorized();
                    return null;
                }
                if (!res.ok) throw new Error(`Failed to ${endpoint}`);
                return res.json();
            })
            .then((updatedApp) => {
                if (!updatedApp) return;
                setApplications((prev) =>
                    prev.map((app) =>
                        app.applicationId === updatedApp.applicationId ? { ...updatedApp } : app
                    )
                );
            })
            .catch((err) => console.error(`Error during ${endpoint}:`, err))
            .finally(() => setProcessingId(null));
    };

    const handleApprove = (applicationId) =>
        updateApplicationStatus(applicationId, "approve-member");

    const handleReject = (applicationId) => {
        if (window.confirm("Are you sure you want to reject this member?")) {
            updateApplicationStatus(applicationId, "reject-member");
        }
    };

    const handleApprovePayment = (applicationId) =>
        updateApplicationStatus(applicationId, "approve-payment");

    const handleDownloadActiveMembers = async () => {
        try {
            const response = await fetch(
                `${baseUrl}/api/admin/members/active/pdf`,
                { method: "GET", credentials: "include" }
            );

            if (response.status === 401) {
                handleUnauthorized();
                return;
            }

            if (!response.ok) {
                alert("No active members found or failed to generate PDF.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "active_members.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading active members PDF:", error);
            alert("Error downloading the list of active members.");
        }
    };

    if (loading) return <div className="loading">Loading applications...</div>;

    return (
        <div className="membership-container">
            <div className="top-header">
                <h1>Membership Applications</h1>
                <button
                    className="back-dashboard-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Back to Dashboard
                </button>
            </div>

            <div className="download-section">
                <button
                    className="membership-primary-btn"
                    onClick={handleDownloadActiveMembers}
                >
                    ⬇ Download Active Members PDF
                </button>
            </div>

            {applications.length === 0 ? (
                <p>No applications found.</p>
            ) : (
                <table className="applications-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Enquirer</th>
                        <th>Student</th>
                        <th>School</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Level</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {applications.map((app) => (
                        <tr key={app.applicationId}>
                            <td>{app.applicationId}</td>
                            <td>{app.enquirerName}</td>
                            <td>{app.studentName}</td>
                            <td>{app.schoolName}</td>
                            <td>{app.email}</td>
                            <td>{app.phoneNumber}</td>
                            <td>{app.level}</td>
                            <td>
                                {app.paymentVerified ? (
                                    <span className="approved">Active</span>
                                ) : app.paymentUploaded ? (
                                    <span className="verifying">Awaiting Verification</span>
                                ) : app.approved ? (
                                    <span className="pending">Awaiting Payment</span>
                                ) : app.rejected ? (
                                    <span className="rejected">Rejected</span>
                                ) : (
                                    <span className="pending">Pending</span>
                                )}
                            </td>
                            <td>
                                {app.paymentUploaded && app.paymentProof ? (
                                    <button
                                        className="view-btn"
                                        onClick={() =>
                                            setSelectedImage(`data:image/jpeg;base64,${app.paymentProof}`)
                                        }
                                    >
                                        View Evidence
                                    </button>
                                ) : (
                                    "—"
                                )}

                                {app.paymentUploaded && !app.paymentVerified && (
                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            handleApprovePayment(app.applicationId)
                                        }
                                        disabled={processingId === app.applicationId}
                                    >
                                        {processingId === app.applicationId
                                            ? "Processing..."
                                            : "Approve Payment"}
                                    </button>
                                )}

                                {!app.approved &&
                                    !app.rejected &&
                                    !app.paymentUploaded && (
                                        <>
                                            <button
                                                className="approve-btn"
                                                onClick={() =>
                                                    handleApprove(app.applicationId)
                                                }
                                                disabled={processingId === app.applicationId}
                                            >
                                                {processingId === app.applicationId
                                                    ? "Processing..."
                                                    : "Approve"}
                                            </button>
                                            <button
                                                className="reject-btn"
                                                onClick={() =>
                                                    handleReject(app.applicationId)
                                                }
                                                disabled={processingId === app.applicationId}
                                            >
                                                {processingId === app.applicationId
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>
                                        </>
                                    )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedImage && (
                <div
                    className="image-modal"
                    onClick={() => setSelectedImage(null)}
                >
                    <div
                        className="image-wrapper"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={selectedImage} alt="Payment Proof" />
                        <button
                            className="close-btn"
                            onClick={() => setSelectedImage(null)}
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MembershipApplications;
