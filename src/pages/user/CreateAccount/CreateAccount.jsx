import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

const CreateAccount = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const sendVerificationCode = async () => {
        if (!email || !password || !confirmPassword) {
            setMessage("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/send-verification`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
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
        }
        setLoading(false);
    };

    const verifyCode = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${baseUrl}/api/verify-code`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: verificationCode })
            });
            const data = await res.json();

            setMessage(data.message);
            if (data.success) {
                setTimeout(() => {
                    navigate("/user-login");
                }, 1500);
            }
        } catch {
            setMessage("Error verifying code");
        }
        setLoading(false);
    };

    return (
        <div className="account-container">
            <div className="account-box">
                <img src="/images/diy-lab-logo.png" alt="DIY Lab Logo" className="logo" />
                <h2>Create Account</h2>

                <div className="input-group">
                    <label>Email ID</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Create Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <div className="input-group">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                </div>

                {isCodeSent && (
                    <div className="input-group">
                        <label>Verification Code</label>
                        <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
                    </div>
                )}

                {loading ? (
                    <div className="loader"></div>
                ) : !isCodeSent ? (
                    <button className="account-button" onClick={sendVerificationCode}>Send Verification Code</button>
                ) : (
                    <button className="account-button" onClick={verifyCode}>Verify Code</button>
                )}

                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default CreateAccount;
