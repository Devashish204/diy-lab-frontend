import React, { useEffect } from "react";
import "./AdminLogin.css";
import diyLabLogo from "../../../../public/images/diy-lab-logo.png";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
    const navigate = useNavigate();
    const baseUrl = "https://13.60.198.252.nip.io";


    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.role === "ADMIN") {
                navigate("/admin/dashboard");
            }
        }
    }, [navigate]);

    const googleLogin = () => {
        window.location.href = "https://13.60.198.252.nip.io/oauth2/authorization/google";

    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-box">
                <img src={diyLabLogo} alt="DIY Lab Logo" className="admin-login-logo" />

                <h2 className="admin-login-title">Admin Login</h2>

                <button className="admin-google-btn" onClick={googleLogin}>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google Logo"
                        className="google-icon"
                    />
                    Login with Google
                </button>

            </div>
        </div>
    );
}
