import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    // 🚫 Not logged in OR not admin → go to login
    if (!user || user.role !== "ADMIN") {
        return <Navigate to="/admin-login" replace />;
    }

    // ✅ Logged in as admin → allow access
    return children;
};

export default AdminProtectedRoute;
