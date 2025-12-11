import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../components/AuthContext.jsx";

// add baseUrl for consistency
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

const Login = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/users/home");
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!email || !password) {
            setMessage("Please enter both email and password");
            return;
        }

        setLoading(true);
        try {
            const result = await login(email, password);

            if (result.success) {
                setMessage("Login successful! Redirecting...");
                setTimeout(() => navigate("/users/home"), 1000);
            } else {
                setMessage(result.message || "Invalid credentials");
            }
        } catch (error) {
            setMessage("Error connecting to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <img src="/images/diy-lab-logo.png" alt="Logo" className="logo" />
                <h2>Welcome Back Dear User!</h2>

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="email">Email ID</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && <p className="message">{message}</p>}

                <div className="links">
                    <span
                        className="forgot-password-link"
                        onClick={() => navigate("/user-forgot-password")}
                        style={{ color: "#007bff", cursor: "pointer" }}
                    >
                        Forgot Password?
                    </span>
                    <p>
                        Don’t have an account?{" "}
                        <span
                            className="create-account-link"
                            onClick={() => navigate("/user-create-account")}
                            style={{ color: "#007bff", cursor: "pointer" }}
                        >
                            Create one now
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
