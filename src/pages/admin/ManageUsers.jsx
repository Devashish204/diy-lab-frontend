import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
    const navigate = useNavigate();

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

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Manage Users</h2>
            <p>This page will allow the admin to manage user accounts.</p>
        </div>
    );
};

export default ManageUsers;
