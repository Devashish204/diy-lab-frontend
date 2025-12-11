import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { FaTools, FaUsersCog, FaLightbulb, FaChalkboardTeacher, FaCogs } from "react-icons/fa";
import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// add baseUrl for consistency (not used for local public images here)
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

export default function Home() {
    const publicFolder = "/images/Final-Home-photos";
    const [slides, setSlides] = useState([]);

    useEffect(() => {
        const totalPhotos = 16;
        for (let i = 1; i <= totalPhotos; i++) {
            const url = `${publicFolder}/Photo${i}.jpg`;
            const img = new Image();
            img.onload = () => setSlides((prev) => [...prev, url]);
            img.onerror = () => {};
            img.src = url;
        }
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
    };

    return (
        <div className="home-container">
            <section className="welcome-section">
                <h1>Welcome to DIY Lab, Vigyan Ashram</h1>
                <p>Where Ideas Spark, Skills Grow & Dreams Take Shape</p>
            </section>

            <section className="about-section">
                <h2>About the DIY Lab</h2>
                <p className="intro">
                    The <b>DIY (Do-It-Yourself) Lab</b> at <b>Vigyan Ashram</b> is a hands-on innovation hub promoting creativity and problem-solving through a
                    <b> “Learn-by-Doing”</b> approach. It empowers students and makers to explore Science, Technology, Engineering, Arts, and Mathematics (STEAM)
                    using real tools and projects.
                </p>

                <div className="points-grid">
                    <div className="point">
                        <FaLightbulb className="icon" />
                        <h3>Learning by Doing</h3>
                        <p>
                            From ideas to prototypes — students solve real-world problems and build tangible solutions.
                        </p>
                    </div>

                    <div className="point">
                        <FaTools className="icon" />
                        <h3>Tools for Creation</h3>
                        <p>
                            Access to 3D printers, electronics kits, fabrication tools, and software for design & innovation.
                        </p>
                    </div>

                    <div className="point">
                        <FaUsersCog className="icon" />
                        <h3>Community Impact</h3>
                        <p>
                            Focused on rural challenges — like renewable energy, affordable tech, and sustainable farming.
                        </p>
                    </div>

                    <div className="point">
                        <FaChalkboardTeacher className="icon" />
                        <h3>Workshops & Programs</h3>
                        <p>
                            Regular sessions in Pune: 3D Designing, DIY Electronics, Model Airplanes, and more.
                        </p>
                    </div>

                    <div className="point">
                        <FaCogs className="icon" />
                        <h3>Fab Lab Connection</h3>
                        <p>
                            A satellite center of <b>Vigyan Ashram, Pabal</b> — home to India’s first <b>Fab Lab</b>.
                        </p>
                    </div>
                </div>

                <p className="home-cta-text">
                    💡 Want to explore our <b>Courses</b> or <b>Membership Plans</b>? Join us to learn, innovate, and create!
                </p>
            </section>

            <section className="slider-section">
                {slides.length > 0 ? (
                    <div className="slider-container">
                        <Slider {...settings}>
                            {slides.map((src, i) => (
                                <div key={i} className="slide">
                                    <img src={src} alt={`photo${i + 1}`} />
                                </div>
                            ))}
                        </Slider>
                    </div>
                ) : (
                    <div className="loading">
                        Loading images from <code>{publicFolder}</code>...
                    </div>
                )}
            </section>


        </div>
    );
}
