import React, { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthContext.jsx";
import "./AccountPage.css";

export default function AccountPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("profile");
    const [subTab, setSubTab] = useState("workshops");
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [workshops, setWorkshops] = useState([]);
    const [services, setServices] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedMembership, setSelectedMembership] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const fileInputRef = React.useRef(null);
    const [myBlogs, setMyBlogs] = useState([]);
    const [editingBlog, setEditingBlog] = useState(null);

    const API = import.meta.env.VITE_API_BASE_URL_PROD || "";

    useEffect(() => {
        if (user?.email) {
            fetchUserWorkshops();
            fetchUserServices();
            fetchUserMemberships();
            fetchMyBlogs();
        }
    }, [user]);

    const fetchUserWorkshops = async () => {
        try {
            const res = await fetch(
                `${API}/api/users/workshops?email=${encodeURIComponent(user.email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error();
            setWorkshops(await res.json());
        } catch {
            console.error();
        }
    };

    const fetchUserServices = async () => {
        try {
            const res = await fetch(
                `${API}/api/bookings/services/${encodeURIComponent(user.email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error();
            setServices(await res.json());
        } catch {
            console.error();
        }
    };

    const fetchUserMemberships = async () => {
        try {
            const res = await fetch(
                `${API}/api/users/memberships?email=${encodeURIComponent(user.email)}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            if (!res.ok) throw new Error();
            const data = await res.json();
            const normalized = (Array.isArray(data) ? data : [data]).map((m) => ({
                ...m,
                id: m.applicationId || m.id,
            }));
            setMemberships(normalized);
        } catch {
            console.error();
        }
    };

    const handlePasswordChange = async () => {
        if (!oldPass || !newPass) {
            setMessage({ text: "Please fill all fields", type: "error" });
            return;
        }
        try {
            const res = await fetch(`${API}/account/change-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user?.email,
                    oldPassword: oldPass,
                    newPassword: newPass,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setMessage({ text: data.message || "", type: "error" });
                return;
            }
            setMessage({ text: data.message || "", type: "success" });
            setOldPass("");
            setNewPass("");
        } catch {
            setMessage({ text: "", type: "error" });
        }
    };

    const handleUploadPaymentProof = async () => {
        if (!paymentProof || !selectedMembership) {
            alert("");
            return;
        }
        const form = new FormData();
        form.append("file", paymentProof);
        try {
            const res = await fetch(`${API}/api/upload-payment/${selectedMembership.id}`, {
                method: "POST",
                body: form,
            });
            if (!res.ok) throw new Error();
            alert("");
            setPaymentProof(null);
            setShowPaymentModal(false);
            fetchUserMemberships();
        } catch {
            alert("");
        }
    };

    const fetchMyBlogs = async () => {
        const res = await fetch(
            `${API}/api/blogs/my?email=${encodeURIComponent(user.email)}`,
            {
                method: "GET",
            }
        );

        if (!res.ok) throw new Error();
        setMyBlogs(await res.json());
    };



    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(
                `${API}/api/blogs/${blogId}?email=${encodeURIComponent(user.email)}`,
                {
                    method: "DELETE",
                }
            );

            if (!res.ok) throw new Error();
            fetchMyBlogs();
        } catch {
            alert("Failed to delete blog");
        }
    };

    const handleUpdateBlog = async () => {
        try {
            const res = await fetch(`${API}/api/blogs/${editingBlog.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    title: editingBlog.title,
                    category: editingBlog.category,
                    year: editingBlog.year,
                    link: editingBlog.link,
                }),
            });
            if (!res.ok) throw new Error();
            setEditingBlog(null);
            fetchMyBlogs();
        } catch {
            alert("Failed to update blog");
        }
    };


    return (
        <div className="account-container">
            <div className="account-card wide">
                <h1 className="account-title">My DIY Account</h1>

                <div className="tab-buttons">
                    {["profile", "password", "activities"].map((t) => (
                        <button
                            key={t}
                            className={activeTab === t ? "active" : ""}
                            onClick={() => setActiveTab(t)}
                        >
                            {t === "profile" ? "Profile" : t === "password" ? "Password" : "Activities"}
                        </button>
                    ))}
                </div>

                <div className="tab-content">
                    {activeTab === "profile" && (
                        <div className="profile-section">
                            <h2>Profile Details</h2>
                            <label>User ID</label>
                            <input value={user?.id || ""} disabled />
                            <label>Email</label>
                            <input value={user?.email || ""} disabled />
                        </div>
                    )}

                    {activeTab === "password" && (
                        <div className="password-section">
                            <h2>Change Password</h2>
                            <label>Old Password</label>
                            <input type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
                            <label>New Password</label>
                            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                            <button className="update-btn" onClick={handlePasswordChange}>
                                Update Password
                            </button>
                            {message.text && <p className={`message ${message.type}`}>{message.text}</p>}
                        </div>
                    )}

                    {activeTab === "activities" && (
                        <div className="activities-section">
                            <div className="sub-tab-buttons">
                                {["workshops", "services", "membership", "blogs"].map((s) => (
                                    <button
                                        key={s}
                                        className={subTab === s ? "active" : ""}
                                        onClick={() => setSubTab(s)}
                                    >
                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {subTab === "workshops" && (
                                workshops.length > 0 ? (
                                    <div className="table-container">
                                        <table className="workshop-table">
                                            <thead>
                                            <tr><th>Name</th><th>Status</th><th>Applied</th><th>Evidence</th></tr>
                                            </thead>
                                            <tbody>
                                            {workshops.map((w) => (
                                                <tr key={w.id}>
                                                    <td>{w.workshopName}</td>
                                                    <td><span className={w.approved ? "approved" : "pending"}>
                                                            {w.approved ? "Approved" : "Pending"}
                                                        </span></td>
                                                    <td>{new Date(w.appliedAt).toLocaleString()}</td>
                                                    <td>
                                                        {w.paymentEvidenceBase64 ? (
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        "data:image/jpeg;base64," + w.paymentEvidenceBase64
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>
                                                        ) : "—"}
                                                    </td>

                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="no-workshops">No workshops applied yet.</p>
                            )}

                            {subTab === "services" && (
                                services.length > 0 ? (
                                    <div className="table-container">
                                        <table className="workshop-table">
                                            <thead>
                                            <tr><th>Name</th><th>Date</th><th>Status</th><th>Evidence</th></tr>
                                            </thead>
                                            <tbody>
                                            {services.map((sv) => (
                                                <tr key={sv.bookingId}>
                                                    <td>{sv.serviceName}</td>
                                                    <td>{new Date(sv.bookingDate).toLocaleString()}</td>
                                                    <td><span className={sv.approved ? "approved" : "pending"}>
                                                            {sv.approved ? "Approved" : "Pending"}
                                                        </span></td>
                                                    <td>{sv.paymentProof ?
                                                        <button onClick={() => setSelectedImage(`data:image/jpeg;base64,${sv.paymentProof}`)}>View</button> : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="no-workshops">No service bookings yet.</p>
                            )}

                            {subTab === "membership" && (
                                memberships.length > 0 ? (
                                    <div className="table-container">
                                        <table className="workshop-table">
                                            <thead>
                                            <tr><th>Student</th><th>Level</th><th>Status</th><th>Applied</th><th>Approved</th><th>Expires</th><th>Pay</th></tr>
                                            </thead>
                                            <tbody>
                                            {memberships.map((m) => (
                                                <tr key={m.id}>
                                                    <td>{m.studentName}</td>
                                                    <td>{m.level}</td>
                                                    <td><span className={m.expired ? "expired" : m.paymentApproved ? "approved" : "verifying"}>
                                                            {m.expired ? "Expired" : m.paymentApproved ? "Active" : m.paymentUploaded ? "Verifying" : "Pending"}
                                                        </span></td>
                                                    <td>{m.appliedAt ? new Date(m.appliedAt).toLocaleDateString() : "—"}</td>
                                                    <td>{m.approvedAt ? new Date(m.approvedAt).toLocaleDateString() : "—"}</td>
                                                    <td>{m.expiryDate ? new Date(m.expiryDate).toLocaleDateString() : "—"}</td>
                                                    <td>{!m.expired && m.approved && !m.paymentApproved && !m.paymentUploaded ? (
                                                        <button
                                                            onClick={() => {
                                                                setSelectedMembership(m);
                                                                setShowPaymentModal(true);
                                                            }}
                                                        > Pay Now
                                                        </button>
                                                    ) : "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : <p className="no-workshops">No membership applications yet.</p>
                            )}

                            {subTab === "blogs" && (
                                myBlogs.length > 0 ? (
                                    <div className="table-container">
                                        <table className="workshop-table blogs-table">
                                            <thead>
                                            <tr>
                                                <th>Year</th>
                                                <th>Title</th>
                                                <th>Category</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {myBlogs.map((blog) => (
                                                <tr key={blog.id}>
                                                    <td>{blog.year}</td>
                                                    <td>{blog.title}</td>
                                                    <td>{blog.category}</td>
                                                    <td>
                                                        <button
                                                            onClick={() => setEditingBlog(blog)}
                                                            style={{ marginRight: "8px" }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBlog(blog.id)}
                                                            style={{ color: "white" }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>


                                        </table>
                                    </div>
                                ) : (
                                    <p className="no-workshops">You haven’t published any blogs yet.</p>
                                )
                            )}

                            {editingBlog && (
                                <div className="image-modal" onClick={() => setEditingBlog(null)}>
                                    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                                        <button className="membershipModal_closeBtn_unique"
                                                onClick={() => setEditingBlog(null)}>✖</button>

                                        <h2>Edit Blog</h2>

                                        <input
                                            type="text"
                                            value={editingBlog.title}
                                            onChange={(e) =>
                                                setEditingBlog({ ...editingBlog, title: e.target.value })
                                            }
                                        />

                                        <input
                                            type="text"
                                            value={editingBlog.category}
                                            onChange={(e) =>
                                                setEditingBlog({ ...editingBlog, category: e.target.value })
                                            }
                                        />

                                        <input
                                            type="text"
                                            value={editingBlog.year}
                                            onChange={(e) =>
                                                setEditingBlog({ ...editingBlog, year: e.target.value })
                                            }
                                        />

                                        <input
                                            type="url"
                                            value={editingBlog.link}
                                            onChange={(e) =>
                                                setEditingBlog({ ...editingBlog, link: e.target.value })
                                            }
                                        />

                                        <button
                                            className="membershipModal_uploadBtn_unique"
                                            onClick={handleUpdateBlog}
                                        >
                                            Update Blog
                                        </button>
                                    </div>
                                </div>
                            )}


                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="image-wrapper" onClick={(e) => e.stopPropagation()}>
                        <img src={selectedImage} />
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>✖</button>
                    </div>
                </div>
            )}

            {showPaymentModal && (
                <div className="image-modal" onClick={() => setShowPaymentModal(false)}>
                    <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="membershipModal_closeBtn_unique" onClick={() => setShowPaymentModal(false)}>✖</button>
                        <h2>Membership Payment</h2>
                        <img src="/images/QRCode.jpg" className="qr-image" />
                        <p>Scan to Pay</p>

                        <label onClick={() => fileInputRef.current.click()} style={{ cursor: "pointer" }}>
                            {paymentProof?.name || "Click to choose file"}
                        </label>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => setPaymentProof(e.target.files[0])}
                        />

                        <button className="membershipModal_chooseBtn_unique" onClick={() => fileInputRef.current.click()}>Choose File</button>
                        <button className="membershipModal_uploadBtn_unique" onClick={handleUploadPaymentProof} disabled={!paymentProof}>Upload</button>
                    </div>
                </div>
            )}

        </div>
    );
}
