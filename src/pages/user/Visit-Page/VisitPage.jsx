import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./VisitPage.css";



// build image URLs from the public folder (no static import from public)
const images = [
    "/images/visit-page/img1.jpg",
    "/images/visit-page/img2.jpg",
    "/images/visit-page/img3.jpg",
    "/images/visit-page/img4.jpg",
    "/images/visit-page/img5.jpg",
    "/images/visit-page/img6.jpg",
    "/images/visit-page/img7.jpg",
    "/images/visit-page/img8.jpg",
    "/images/visit-page/img9.jpg",
];

function AdminSlideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="slideshow-container">
            <h2 className="slideshow-title">Moments from School and DIY Team Visits</h2>

            <div className="slideshow">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className="slide-image"
                />
                <button className="prev-btn" onClick={prevSlide}>❮</button>
                <button className="next-btn" onClick={nextSlide}>❯</button>
            </div>

            <div className="dots">
                {images.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? "active" : ""}`}
                        onClick={() => setCurrentIndex(index)}
                    ></span>
                ))}
            </div>

            <div className="visit-actions">
                <p className="visit-text">
                    Want to book a <strong>school visit at the DIY Lab</strong> or invite our
                    <strong> DIY Team to your school</strong>?
                </p>
                <div className="visit-buttons">
                    <button
                        className="visit-btn"
                        onClick={() => navigate("/school-visit")}
                    >
                        Book DIY Lab Visit
                    </button>
                    <button
                        className="visit-btn outline"
                        onClick={() => navigate("/appointment")}
                    >
                        Invite DIY Team
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminSlideshow;
