import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminWorkshopView = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [workshops, setWorkshops] = useState([]);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const navigate = useNavigate();

    // add baseUrl
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

    // ✅ Redirect unauthorized users
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
        fetch(`${baseUrl}/api/admin/categories`, {
            credentials: "include", // ✅ send session cookie
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("user");
                    navigate("/admin-login");
                    return [];
                }
                return res.json();
            })
            .then((data) => setCategories(data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, [navigate]);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedWorkshop(null);
        setRegistrations([]);

        fetch(`${baseUrl}/api/admin/workshops?category=${category}`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("user");
                    navigate("/admin-login");
                    return [];
                }
                return res.json();
            })
            .then((data) => setWorkshops(data))
            .catch((err) => console.error("Error fetching workshops:", err));
    };

    const handleWorkshopSelect = (workshop) => {
        setSelectedWorkshop(workshop);

        fetch(
            `${baseUrl}/api/admin/registrations?workshopId=${workshop.id}`,
            { credentials: "include" }
        )
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("user");
                    navigate("/admin-login");
                    return [];
                }
                return res.json();
            })
            .then((data) => setRegistrations(data))
            .catch((err) => console.error("Error fetching registrations:", err));
    };

    const handleApprove = async (userId) => {
        try {
            const res = await fetch(
                `${baseUrl}/api/admin/approve-user/${userId}`,
                { method: "POST", credentials: "include" }
            );

            if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }

            if (res.ok) {
                alert("User approved and email sent!");
                setRegistrations((prev) =>
                    prev.map((user) =>
                        user.id === userId ? { ...user, approved: true } : user
                    )
                );
            } else {
                alert("Failed to approve user");
            }
        } catch (err) {
            console.error("Error approving user:", err);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await fetch(
                `${baseUrl}/api/admin/workshops/${selectedWorkshop.id}/approved-users/pdf`,
                { method: "GET", credentials: "include" }
            );

            if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
                return;
            }

            if (!res.ok) {
                alert("Failed to download approved users PDF.");
                return;
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${selectedWorkshop.title.replace(/\s+/g, "_")}_approved_users.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading PDF:", err);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Admin Workshop Viewer</h2>

            <div>
                <h4>Select Category:</h4>
                <select
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    value={selectedCategory}
                >
                    <option value="">-- Select Category --</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {workshops.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <h4>Workshops under "{selectedCategory}":</h4>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "1rem",
                            marginTop: "1rem",
                        }}
                    >
                        {workshops.map((workshop) => (
                            <button
                                key={workshop.id}
                                onClick={() => handleWorkshopSelect(workshop)}
                                style={{
                                    padding: "10px 20px",
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedWorkshop?.id === workshop.id
                                            ? "#4CAF50"
                                            : "#008CBA",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                }}
                            >
                                {workshop.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedWorkshop && (
                <div style={{ marginTop: "2rem" }}>
                    <h4>
                        Registrations for:{" "}
                        <span style={{ color: "#333" }}>
                            {selectedWorkshop.title}
                        </span>
                    </h4>

                    {registrations.length > 0 ? (
                        <>
                            <table
                                border="1"
                                cellPadding="8"
                                style={{ width: "100%", marginTop: "1rem" }}
                            >
                                <thead>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Action</th>
                                    <th>Evidence</th>
                                </tr>
                                </thead>
                                <tbody>
                                {registrations.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.userName}</td>
                                        <td>{user.emailId}</td>
                                        <td>{user.phoneNumber}</td>
                                        <td>
                                            <button
                                                disabled={user.approved}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: user.approved
                                                        ? "gray"
                                                        : "orange",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: user.approved
                                                        ? "not-allowed"
                                                        : "pointer",
                                                }}
                                                onClick={() => handleApprove(user.id)}
                                            >
                                                {user.approved
                                                    ? "Approved"
                                                    : "Approve"}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "green",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "4px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() =>
                                                    window.open(
                                                        `${baseUrl}/api/admin/payment-evidence/${user.id}`,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                View Image
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div style={{ marginTop: "1.5rem" }}>
                                <button
                                    onClick={handleDownloadPDF}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#673ab7",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Download Approved Users PDF
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ marginTop: "1rem", color: "#888" }}>
                            <h4>
                                No registrations found for "
                                {selectedWorkshop.title}".
                            </h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminWorkshopView;
