import React from "react";
import Header from "../../../components/Header.jsx";
import "./ContactPage.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function ContactPage() {
    return (
        <>
            <Header />
            <div className="contact-page">
                <h2>Get in touch with DIY Lab, Pune</h2>

                <div className="sticky-notes">
                    <div className="note yellow">
                        <h3>Office Timings</h3>
                        <p>Mondays to Saturday 10:00 am to 6:00 pm</p>
                        <p>Sunday - closed</p>
                    </div>

                    <div className="note pink">
                        <h3>Call us on</h3>
                        <p>+91 7498 285 349</p>
                    </div>

                    <div className="note blue">
                        <h3>Email us on</h3>
                        <p>diy.vigyanashram@gmail.com</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ContactPage;
