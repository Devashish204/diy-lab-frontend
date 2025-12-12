import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function AdminProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [allowed, setAllowed] = useState(false);

    useEffect(() => {
        axios.get("https://13.60.198.252.nip.io/api/admin/me", {
            withCredentials: true
        })
            .then(res => {
                if (res.data.authenticated && res.data.role === "ADMIN") {
                    setAllowed(true);
                    localStorage.setItem("user", JSON.stringify({role: "ADMIN"}));
                } else {
                    localStorage.removeItem("user");
                    setAllowed(false);
                }
            })
            .catch(() => {
                localStorage.removeItem("user");
                setAllowed(false);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Checking admin authentication...</div>;

    return allowed ? children : <Navigate to="/admin-login" replace />;
}
