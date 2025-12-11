import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWorkshop.css";

export default function AdminWorkshop() {
    const navigate = useNavigate();
    const [workshops, setWorkshops] = useState([]);
    const [activeSection, setActiveSection] = useState(null);
    const [currentWorkshop, setCurrentWorkshop] = useState({
        id: null,
        title: "",
        category: "",
        description: "",
        ageGroup: "",
        startDateTime: "",
        endDateTime: "",
        venue: "",
        fees: "",
        image: null,
        previewUrl: null,
    });
    const [bookings, setBookings] = useState([]);
    const [loadingApprovals, setLoadingApprovals] = useState({});
    const [creatingWorkshop, setCreatingWorkshop] = useState(false);

    const categories = [
        "Robotics",
        "Coding",
        "Art and Craft",
        "Carpentry",
        "3D Printing",
        "Laser Cutting",
        "Other",
    ];

    // add baseUrl
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

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

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const res = await fetch(`${baseUrl}/api/workshops`, {
                credentials: "include",
            });
            if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }
            setWorkshops(await res.json());
        } catch (err) {
            console.error("Error fetching workshops:", err);
        }
    };

    const fetchBookings = async (workshopId) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        try {
            const response = await fetch(
                `${baseUrl}/api/admin/workshops/${workshopId}/users`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }
            const data = await response.json();
            setBookings(data);
            const workshop = workshops.find((w) => w.id === workshopId);
            if (workshop) setCurrentWorkshop(workshop);
            setActiveSection("bookings");
        } catch (error) {
            console.error(error);
        }
    };


    const handleToggle = (section) => {
        setActiveSection(activeSection === section ? null : section);
        resetForm();
    };

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setCurrentWorkshop((prev) => ({
                        ...prev,
                        image: file,
                        previewUrl: event.target.result,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setCurrentWorkshop({ ...currentWorkshop, [name]: value });
        }
    };

    const resetForm = () => {
        setCurrentWorkshop({
            id: null,
            title: "",
            category: "",
            description: "",
            ageGroup: "",
            startDateTime: "",
            endDateTime: "",
            venue: "",
            fees: "",
            image: null,
            previewUrl: null,
        });
        setBookings([]);
    };

    const handleSave = async () => {
        setCreatingWorkshop(true);
        const formData = new FormData();
        const workshopDto = { ...currentWorkshop };
        delete workshopDto.image;
        delete workshopDto.previewUrl;
        formData.append(
            "workshop",
            new Blob([JSON.stringify(workshopDto)], { type: "application/json" })
        );
        if (currentWorkshop.image)
            formData.append("image", currentWorkshop.image);

        try {
            const url = currentWorkshop.id
                ? `${baseUrl}/api/admin/workshops/${currentWorkshop.id}`
                : `${baseUrl}/api/admin/workshops`;
            const method = currentWorkshop.id ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            });

            if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }

            await fetchWorkshops();
            resetForm();
            setActiveSection("manage");
        } catch (err) {
            console.error("Error saving workshop:", err);
        } finally {
            setCreatingWorkshop(false);
        }
    };

    const handleEdit = (workshop) => {
        setCurrentWorkshop({ ...workshop, image: null, previewUrl: null });
        setActiveSection("create");
    };

    const handleDelete = async (id) => {
        const res = await fetch(`${baseUrl}/api/admin/workshops/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        if (res.status === 401) {
            localStorage.removeItem("user");
            navigate("/admin-login");
            return;
        }
        fetchWorkshops();
    };

    const handleApprove = async (bookingId, workshopId) => {
        setLoadingApprovals((prev) => ({ ...prev, [bookingId]: "loading" }));
        try {
            const res = await fetch(
                `${baseUrl}/api/admin/approve-user/${bookingId}`,
                { method: "POST", credentials: "include" }
            );
            if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }
            setLoadingApprovals((prev) => ({ ...prev, [bookingId]: "approved" }));
            fetchBookings(workshopId);
        } catch (err) {
            console.error("Error approving user:", err);
            setLoadingApprovals((prev) => {
                const copy = { ...prev };
                delete copy[bookingId];
                return copy;
            });
        }
    };

    const handleViewEvidence = (b) => {
        if (!b.paymentEvidenceBase64) return;
        const dataUrl = b.paymentEvidenceBase64.startsWith("data:")
            ? b.paymentEvidenceBase64
            : "data:image/png;base64," + b.paymentEvidenceBase64;
        const newWindow = window.open();
        if (newWindow) {
            newWindow.document.write(`
            <html>
                <head>
                    <title>Payment Evidence</title>
                    <style>
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background: #f0f0f0;
                        }
                        img {
                            max-width: 90vw;
                            max-height: 90vh;
                            object-fit: contain;
                        }
                    </style>
                </head>
                <body>
                    <img src="${dataUrl}" />
                </body>
            </html>
        `);
        }
    };

    const handleDownloadApprovedUsers = async (workshopId, workshopTitle) => {
        try {
            const response = await fetch(
                `${baseUrl}/api/admin/workshops/${workshopId}/approved-users/pdf`,
                { method: "GET", credentials: "include" }
            );
            if (response.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }
            if (!response.ok) {
                alert("No approved users or failed to generate PDF.");
                return;
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${workshopTitle.replace(/\s+/g, "_")}_approved_users.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Error downloading approved users list.");
        }
    };

    return (
        <div className="admin-workshop-page">
            <div className="top-header">
                <h1>Workshop Admin</h1>
                <button className="back-dashboard-btn" onClick={() => navigate("/admin/dashboard")}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="button-group center">
                <button className="primary-btn" onClick={() => handleToggle("create")}>
                    {activeSection === "create" ? "Hide Create Workshop" : "Create New Workshop"}
                </button>
                <button className="primary-btn" onClick={() => handleToggle("manage")}>
                    {activeSection === "manage" ? "Hide Manage Workshops" : "Manage Existing Workshops"}
                </button>
            </div>

            {creatingWorkshop && (
                <div className="overlay">
                    <div className="spinner"></div>
                    <div>{currentWorkshop.id ? "Updating Workshop..." : "Creating Workshop..."}</div>
                </div>
            )}

            {activeSection === "create" && (
                <div className="create-section">
                    <div className="section-header">
                        <h2>{currentWorkshop.id ? "Update Workshop" : "Create Workshop"}</h2>
                    </div>

                    <div className="form-grid">
                        <input type="text" name="title" placeholder="Title" value={currentWorkshop.title} onChange={handleInputChange} />
                        <select name="category" value={currentWorkshop.category} onChange={handleInputChange}>
                            <option value="">Select Category</option>
                            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <textarea name="description" placeholder="Description" value={currentWorkshop.description} onChange={handleInputChange} />
                        <input type="text" name="ageGroup" placeholder="Age Group" value={currentWorkshop.ageGroup} onChange={handleInputChange} />
                        <input type="datetime-local" name="startDateTime" value={currentWorkshop.startDateTime} onChange={handleInputChange} />
                        <input type="datetime-local" name="endDateTime" value={currentWorkshop.endDateTime} onChange={handleInputChange} />
                        <input type="text" name="venue" placeholder="Venue" value={currentWorkshop.venue} onChange={handleInputChange} />
                        <input type="number" name="fees" placeholder="Fees" value={currentWorkshop.fees} onChange={handleInputChange} />

                        <div className="image-upload-field">
                            <label>Upload Workshop Image</label>
                            <label htmlFor="image-upload" className="upload-label">Choose File</label>
                            <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleInputChange} style={{ display: "none" }} />
                            {currentWorkshop.previewUrl && (
                                <div className="image-preview">
                                    <img src={currentWorkshop.previewUrl} alt="Workshop Preview" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="actions center">
                        <button className="primary-btn" onClick={handleSave}>{currentWorkshop.id ? "Update" : "Create"}</button>
                        <button className="secondary-btn" onClick={resetForm}>Clear</button>
                    </div>
                </div>
            )}

            {/* --- MANAGE WORKSHOPS --- */}
            {activeSection === "manage" && (
                <div className="manage-section wide">
                    <h2>Existing Workshops</h2>
                    {workshops.length === 0 ? (
                        <p>No workshops available.</p>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Age Group</th>
                                <th>From</th>
                                <th>To</th>
                                <th>Venue</th>
                                <th>Fees</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {workshops.map((w) => (
                                <tr key={w.id}>
                                    <td>{w.id}</td>
                                    <td>{w.title}</td>
                                    <td>{w.category}</td>
                                    <td>{w.ageGroup}</td>
                                    <td>{new Date(w.startDateTime).toLocaleString()}</td>
                                    <td>{new Date(w.endDateTime).toLocaleString()}</td>
                                    <td>{w.venue}</td>
                                    <td>{w.fees}</td>
                                    <td>
                                        <button className="edit-btn" onClick={() => handleEdit(w)}>Edit</button>
                                        <button className="danger-btn" onClick={() => handleDelete(w.id)}>Delete</button>
                                        <button className="primary-btn" onClick={() => fetchBookings(w.id)}>Bookings</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeSection === "bookings" && (
                <div className="manage-section wide">
                    <div className="section-header bookings-header">
                        <h2>Bookings for {currentWorkshop.title}</h2>
                        <button className="primary-btn" onClick={() => handleDownloadApprovedUsers(currentWorkshop.id, currentWorkshop.title)}>
                            ⬇ Download Approved Users PDF
                        </button>
                    </div>

                    {bookings.length === 0 ? (
                        <p>No bookings yet.</p>
                    ) : (
                        <table>
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Applied At</th>
                                <th>Evidence</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookings.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.id}</td>
                                    <td>{b.userName}</td>
                                    <td>{b.email}</td>
                                    <td>{b.phoneNumber}</td>
                                    <td>{b.appliedAt ? new Date(b.appliedAt).toLocaleString() : "N/A"}</td>
                                    <td>
                                        {b.paymentEvidenceBase64 ? (
                                            <button className="view-btn" onClick={() => handleViewEvidence(b)}>View</button>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td>
                                        {b.approved ? (
                                            "✅ Approved"
                                        ) : loadingApprovals[b.id] === "loading" ? (
                                            "⏳ Approving..."
                                        ) : (
                                            "Pending"
                                        )}
                                    </td>
                                    <td>
                                        {!b.approved && (
                                            <button
                                                className="approve-btn"
                                                onClick={() => handleApprove(b.id, currentWorkshop.id)}
                                                disabled={loadingApprovals[b.id] === "loading"}
                                            >
                                                {loadingApprovals[b.id] === "loading" ? "Approving..." : "Approve"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}