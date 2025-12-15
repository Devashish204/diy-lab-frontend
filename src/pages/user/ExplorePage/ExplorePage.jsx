import React, { useState, useEffect } from "react";
import Header from "../../../components/Header.jsx";
import "./ExplorePage.css";
import { useNavigate } from "react-router-dom";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function ExplorePage() {
    const navigate = useNavigate();
    const [stage, setStage] = useState("loading"); // "loading" -> "success" -> "content"

    useEffect(() => {
        const loaderTimer = setTimeout(() => setStage("success"), 1000);
        const successTimer = setTimeout(() => setStage("content"), 1500);
        return () => {
            clearTimeout(loaderTimer);
            clearTimeout(successTimer);
        };
    }, []);

    return (
        <>
            <Header />
            <div className="explore-page">
                {stage === "loading" && (
                    <div className="buffer-container">
                        <div className="loader"></div>
                        <p>Loading DIY Lab Experience...</p>
                    </div>
                )}

                {stage === "success" && (
                    <div className="success-banner fade-in">
                        <div className="success-icon">✅</div>
                        <h3>All set! Explore DIY Lab below 👇</h3>
                    </div>
                )}

                {stage === "content" && (
                    <div className="page-content fade-in">
                        <section className="section yellow">
                            <div className="section-header">
                                <img src="/images/ExplorePage-images/clock.png" alt="Timings Icon" />
                                <h2>Timings</h2>
                            </div>
                            <p>Monday to Saturday &nbsp;&nbsp; 10:00 am - 6:00 pm</p>
                            <p>Sundays are Closed</p>
                        </section>

                        <section className="section white">
                            <div className="section-header">
                                <h2>Appointment</h2>
                                <img src="/images/ExplorePage-images/appointment.png" alt="Appointment Icon" />
                            </div>
                            <p>Monday to Saturday</p>
                            <p>Morning: 10:30 am - 12:30 pm</p>
                            <p>Afternoon: 2:00 pm - 5:30 pm</p>
                            <button className="explore-btn" onClick={() => navigate("/appointment")}>
                                Book Your Appointment Now
                            </button>
                        </section>

                        <section className="section yellow">
                            <div className="section-header">
                                <img src="/images/ExplorePage-images/online-course.png" alt="Courses Icon" />
                                <h2>Courses</h2>
                            </div>
                            <p>
                                Discover exciting courses at DIY Lab – where learning meets making!
                            </p>
                            <button className="explore-btn" onClick={() => navigate("/courses")}>
                                Explore
                            </button>
                        </section>

                        <section className="section white">
                            <div className="section-header">
                                <img src="/images/ExplorePage-images/internship.png" alt="Internships Icon" />
                                <h2>Internships</h2>
                            </div>
                            <p>Unleash Your Creativity, Build Your Skills..!</p>
                            <p>Embark on a journey of innovation and hands-on learning at DIY Lab</p>
                            <button className="explore-btn" onClick={() => navigate("/internships")}>
                                Apply Now
                            </button>
                        </section>

                        <section className="section yellow">
                            <div className="section-header">
                                <h2>Careers</h2>
                                <img src="/images/ExplorePage-images/career-path.png" alt="Careers Icon" />
                            </div>
                            <p>
                                Join the DIY Lab team and turn your passion for creativity and
                                innovation into a rewarding career.
                            </p>
                            <p>
                                Build your future with DIY Lab – where ideas, skills, and careers grow together.
                            </p>
                            <button className="explore-btn" onClick={() => navigate("/careers")}>
                                Apply Now
                            </button>
                        </section>
                    </div>
                )}
            </div>
        </>
    );
}

export default ExplorePage;
