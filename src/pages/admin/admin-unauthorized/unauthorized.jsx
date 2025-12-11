import React from "react";
import { useNavigate } from "react-router-dom";
import "./UnAuthorized.css";

export default function Unauthorized() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/admin-login");
    };

    return (
        <div className="unauth-container">
            <div className="unauth-card">
                <h1 className="unauth-title">Access Denied</h1>
                <p className="unauth-text">
                    You are not authorized to access this page.
                </p>

                <button className="unauth-button" onClick={handleGoBack}>
                    Go Back to Login
                </button>
            </div>
        </div>
    );
}
