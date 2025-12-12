import React from "react";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    const hasSession = document.cookie.includes("JSESSIONID");

    if (!hasSession || !user || user.role !== "ADMIN") {
        return <Navigate to="/admin-login" replace />;
    }

    return children;
};

export default AdminProtectedRoute;
