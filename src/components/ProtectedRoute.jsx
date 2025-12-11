import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx ";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/account" replace />;
    }

    return children;
};

export default ProtectedRoute;
