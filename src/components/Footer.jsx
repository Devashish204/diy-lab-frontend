import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Footer.css';

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function Footer() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(`${baseUrl}/api/register/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
                credentials: "include"
            });

            if (response.ok) {
                setMessage("✅ Registration successful!");
                setEmail("");
            } else {
                const errorData = await response.json().catch(() => ({}));
                setMessage(errorData.message || "❌ Failed to register or User Already Registered. Try again.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Error connecting to the server.");
        }
    };

    return (
        <footer className="footer">
            <div className="footer-top">
                <div className="footer-section left">
                    <div className="logo-row">
                        <img src="/images/VA_Logo-removebg-preview.png" alt="Vigyan Ashram Logo" className="footer-logo"/>
                        <h1 className="footer-title">Vigyan Ashram</h1>
                        <img src="/images/diy-lab-logo.png" alt="DIY Lab Logo" className="footer-logo" />
                    </div>

                    <div className="social-icons">
                        <a href="https://www.facebook.com/DIYCommunityCentre/" target="_blank" rel="noopener noreferrer">
                            <img src="/images/facebook.png" alt="Facebook" />
                        </a>
                        <a href="https://www.instagram.com/diy.vigyanashram?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                            <img src="/images/instagram.png" alt="Instagram" />
                        </a>
                        <a href="https://chat.whatsapp.com/EAp5xxMHrwIFgSmuEdmWwX" target="_blank" rel="noopener noreferrer">
                            <img src="/images/whatsapp.png" alt="WhatsApp" />
                        </a>
                        <a href="https://www.youtube.com/@vigyanashram773" target="_blank" rel="noopener noreferrer">
                            <img src="/images/youtube-logo.png" alt="YouTube" />
                        </a>
                    </div>
                </div>

                <div className="footer-section middle">
                    <h2>Register to DIY LAB</h2>
                    <form className="subscribe-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                    {message && <p className="status-message">{message}</p>}
                </div>

                <div className="footer-section right">
                    <ul>
                        <li><Link to="/user/visits">Visit</Link></li>
                        <li><Link to="/users/explore">Explore</Link></li>
                        <li><Link to="/learn&engage">Learn & Engage</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/team">Team</Link></li>
                        <li><Link to="/users/contact">Contact</Link></li>
                        <li><Link to="/user/feedback">Feedback</Link></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <h2>© 2025 DIY LAB, Vigyan Ashram. All rights reserved</h2>
            </div>
        </footer>
    );
}

export default Footer;
