import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminAnnouncement.css";
import { FiUploadCloud, FiMail, FiSend, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const devUrl = import.meta.env.VITE_API_BASE_URL || "";
const prodUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
const baseUrl = prodUrl || devUrl;

export default function AdminAnnouncementPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    const handleSend = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus("");

        const formData = new FormData();
        formData.append("subject", subject);
        formData.append("message", message);
        if (file) formData.append("attachment", file);

        try {
            const res = await axios.post(
                `${baseUrl}/api/admin/announcement`,
                formData,
                {
                    withCredentials: true,
                }
            );

            setStatus("✅ Announcement sent successfully to all users!");
            setSubject("");
            setMessage("");
            setFile(null);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                handleLogout();
                return;
            }
            setStatus("❌ Failed to send announcement. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="announcement-page">
            <div className="announcement-card">
                <button className="announcement-back-btn" onClick={() => navigate(-1)} disabled={loading}>
                    <FiArrowLeft /> Back
                </button>

                <div className="header">
                    <FiMail className="mail-icon" />
                    <h2>Send Announcement</h2>
                    <p>Broadcast important updates to all registered users.</p>
                </div>

                <form onSubmit={handleSend} className="announcement-form">
                    <input
                        type="text"
                        placeholder="Enter Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <textarea
                        placeholder="Write your announcement message..."
                        rows="6"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={loading}
                    ></textarea>

                    <div className="file-upload">
                        <label htmlFor="file-upload" className="file-label">
                            <FiUploadCloud className="upload-icon" />
                            {file ? "Change Attachment" : "Add Attachment (optional)"}
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={(e) => setFile(e.target.files[0])}
                            disabled={loading}
                        />
                        {file && <p className="file-name">📎 {file.name}</p>}
                    </div>

                    <button type="submit" disabled={loading} className="send-btn">
                        {loading ? "Sending..." : (
                            <>
                                <FiSend className="send-icon" /> Send
                            </>
                        )}
                    </button>
                </form>

                {status && <p className={`status-msg ${status.startsWith("✅") ? "success" : "error"}`}>{status}</p>}
            </div>
        </div>
    );
}
