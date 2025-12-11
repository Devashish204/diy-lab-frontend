import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const sendVerificationCode = async () => {
        if (!email) {
            setMessage("Please enter your email");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/forgot-password/send-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (data.success) {
                setIsCodeSent(true);
                setMessage("Verification code sent to your email");
            } else {
                setMessage(data.message);
            }
        } catch {
            setMessage("Error sending verification code");
        } finally {
            setLoading(false);
        }
    };

    const verifyCode = async () => {
        if (!verificationCode) {
            setMessage("Please enter the verification code");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/forgot-password/verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode }),
            });
            const data = await res.json();
            if (data.success) {
                setIsVerified(true);
                setMessage("Code verified! You can set a new password now.");
            } else {
                setMessage(data.message);
            }
        } catch {
            setMessage("Error verifying code");
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async () => {
        if (!newPassword || !confirmPassword) {
            setMessage("Please enter all password fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/forgot-password/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password: newPassword }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage("Password reset successfully! Redirecting to login...");
                setEmail("");
                setVerificationCode("");
                setNewPassword("");
                setConfirmPassword("");
                setIsCodeSent(false);
                setIsVerified(false);

                setTimeout(() => {
                    navigate("/user-login");
                }, 2000);
            } else {
                setMessage(data.message);
            }
        } catch {
            setMessage("Error resetting password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <img src="/images/diy-lab-logo.png" alt="DIY Lab Logo" className="logo" />
                <h2>Forgot Password</h2>
                <p>Enter your email to reset your password</p>

                {!isCodeSent && (
                    <div className="input-group">
                        <label>Email ID</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className="forgot-button"
                            onClick={sendVerificationCode}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Verification Code"}
                        </button>
                    </div>
                )}

                {isCodeSent && !isVerified && (
                    <div className="input-group">
                        <label>Verification Code</label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                        <button
                            className="forgot-button"
                            onClick={verifyCode}
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Verify Code"}
                        </button>
                    </div>
                )}

                {isVerified && (
                    <>
                        <div className="input-group">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            className="forgot-button"
                            onClick={resetPassword}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </>
                )}

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default ForgotPassword;
