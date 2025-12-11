import React from "react";
import Header from "../../../components/Header.jsx";
import "./About.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function About() {
    return (
        <>
            <Header />

            <div className="page-background">
                <div className="page-container">

                    <section id="about" className="ticket about-section">
                        <h2>
                            <img src="/images/about.png" alt="mission" className="heading-icon" />
                            About DIY Lab – Vigyan Ashram, Pune
                        </h2>
                        <p>
                            The Do-It-Yourself (DIY) Lab is a dynamic satellite initiative by Vigyan Ashram,
                            located in Pune, Maharashtra. Established to promote hands-on learning and
                            innovation, the lab offers a collaborative environment where students, educators,
                            and makers can explore and create.
                        </p>
                    </section>

                    <section id="mission" className="ticket mission-section">
                        <h2>
                            <img src="/images/mission.png" alt="mission" className="heading-icon" />
                            Our Mission
                        </h2>
                        <p>
                            At DIY Lab, we embrace the philosophy of “learning by doing.” Our mission is to
                            empower individuals by providing access to tools, resources, and mentorship,
                            enabling them to transform ideas into tangible solutions.
                        </p>
                    </section>

                    <section id="legacy" className="ticket legacy-section">
                        <h2>
                            <img src="/images/legacy.png" alt="legacy" className="heading-icon" />
                            Our Legacy
                        </h2>
                        <p>
                            Vigyan Ashram, the parent organization of DIY Lab, was established in 1983 by
                            Dr. S. S. Kalbag. Recognized as “Fab Lab” by Dr. Neil Gershenfeld of MIT,
                            Vigyan Ashram has been a pioneer in integrating technology with rural development.
                            The DIY Lab in Pune continues this legacy, bridging the gap between traditional
                            knowledge and modern innovation.
                        </p>
                    </section>

                </div>
            </div>
        </>
    );
}

export default About;
