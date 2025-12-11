import React, { useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "";

function Account() {
    const { user, login, logout } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate("/account");
        } else {
            setError(res.message || "Login failed");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
            {!user ? (
                <>
                    <h2>Login to Your Account</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: "100%", padding: "8px", marginBottom: "1rem" }}
                        />
                        {error && <p style={{ color: "red" }}>{error}</p>}
                        <button type="submit" style={{ padding: "8px 16px" }}>
                            Login
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h2>Welcome, {user.email}</h2>
                    <p>User ID: {user.id}</p>
                    <button onClick={handleLogout} style={{ marginTop: "1rem" }}>
                        Logout
                    </button>
                </>
            )}
        </div>
    );
}

export default Account;
