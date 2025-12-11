import React, { useEffect, useState } from "react";
import Header from "../../../components/Header.jsx";
import "./CategoryView.css";
import { useLocation } from "react-router-dom";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

const CategoryView = () => {
    const [workshops, setWorkshops] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState(null);

    const [formData, setFormData] = useState({
        userName: "",
        email: "",
        phone: "",
        screenshot: null,
    });

    const slideshowImages = [
        "/images/Learn&Explore-Images/Photo1.jpg",
        "/images/Learn&Explore-Images/Photo2.jpg",
        "/images/Learn&Explore-Images/Photo3.jpg",
        "/images/Learn&Explore-Images/Photo4.jpg",
        "/images/Learn&Explore-Images/Photo5.jpg",
    ];
    const [currentSlide, setCurrentSlide] = useState(0);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const category = params.get("category");
        if (category) setSelectedCategory(category);
    }, [location.search]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideshowImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slideshowImages.length]);

    useEffect(() => {
        fetch(`${baseUrl}/api/workshops`)
            .then((res) => res.json())
            .then((data) => setWorkshops(data))
            .catch((err) => console.error("Error fetching workshops:", err))
            .finally(() => setLoading(false));
    }, []);

    const categories = ["ALL", "Activities", "Workshops", "Camps", "Blogs"];

    const filteredWorkshops =
        selectedCategory === "ALL" || selectedCategory === "Workshops"
            ? workshops
            : workshops.filter(
                (w) => w.category.toLowerCase() === selectedCategory.toLowerCase()
            );

    const handleApplyClick = (workshop) => {
        setSelectedWorkshop(workshop);
        setShowApplyForm(true);
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "screenshot") {
            setFormData((prev) => ({ ...prev, screenshot: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedWorkshop) return;

        setIsSubmitting(true);
        setSubmissionMessage(null);

        const data = new FormData();
        const userRequest = {
            userName: formData.userName,
            emailId: formData.email,
            phoneNumber: formData.phone,
            workshopId: selectedWorkshop.id,
        };

        data.append("data", new Blob([JSON.stringify(userRequest)], { type: "application/json" }));
        data.append("screenshot", formData.screenshot);

        try {
            const response = await fetch(`${baseUrl}/api/apply`, {
                method: "POST",
                body: data,
            });

            if (response.ok) {
                setSubmissionMessage({ type: "success", text: "✅ Application submitted successfully!" });
                setShowApplyForm(false);
                setFormData({ userName: "", email: "", phone: "", screenshot: null });
            } else {
                const text = await response.text();
                setSubmissionMessage({ type: "error", text: "❌ Submission failed! " + text });
            }
        } catch (err) {
            setSubmissionMessage({ type: "error", text: "⚠️ An error occurred. Please try again." });
        } finally {
            setTimeout(() => {
                setIsSubmitting(false);
                setSubmissionMessage(null);
            }, 2500);
        }
    };

    return (
        <div className="category-page">
            <Header />

            <div className="image-section">
                <div className="slideshow-container">
                    <img
                        src={slideshowImages[currentSlide]}
                        alt={`Slide ${currentSlide + 1}`}
                        className="slideshow-image"
                    />
                </div>
            </div>

            <div className="explore-container">
                <h2 className="page-title">What Happens at DIY LAB</h2>

                <div className="category-buttons">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p>Loading workshops...</p>
                ) : filteredWorkshops.length === 0 ? (
                    <p>No workshops available in this category.</p>
                ) : (
                    <div className="workshop-grid">
                        {filteredWorkshops.map((workshop) => (
                            <div key={workshop.id} className="workshop-card">
                                <img
                                    src={`${baseUrl}/api/workshops/${workshop.id}/image`}
                                    alt={workshop.title}
                                    className="workshop-image"
                                    onClick={() => setSelectedImage(`${baseUrl}/api/workshops/${workshop.id}/image`)}
                                />

                                <div className="workshop-info">
                                    <h3>{workshop.title}</h3>
                                    <p>{workshop.description}</p>
                                    <p><strong>Age Group:</strong> {workshop.ageGroup}</p>
                                    <p><strong>Start:</strong> {new Date(workshop.startDateTime).toLocaleString()}</p>
                                    <p><strong>End:</strong> {new Date(workshop.endDateTime).toLocaleString()}</p>
                                    <p><strong>Venue:</strong> {workshop.venue}</p>
                                    <p><strong>Fees:</strong> ₹{workshop.fees}</p>
                                </div>
                                <button className="apply-btn" onClick={() => handleApplyClick(workshop)}>
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {showApplyForm && selectedWorkshop && (
                    <div className="overlay">
                        <form className="apply-form" onSubmit={handleSubmit}>
                            <h3>Apply for: {selectedWorkshop.title}</h3>
                            <input type="text" name="userName" placeholder="Full Name" value={formData.userName} onChange={handleFormChange} required />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleFormChange} required />
                            <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleFormChange} required />
                            <div>
                                <p><strong>Scan QR to Pay:</strong></p>
                                <img src="/images/QRCode.jpg" alt="QR Code" className="qr-code" />
                            </div>

                            <div className="file-upload-wrapper">
                                <p><strong>Attach Payment Screenshot:</strong></p>
                                <label className="file-upload">
                                    {formData.screenshot ? (
                                        <span className="file-name">{formData.screenshot.name}</span>
                                    ) : (
                                        "Click or Drop to Upload Screenshot"
                                    )}
                                    <input type="file" name="screenshot" accept="image/*" onChange={handleFormChange} required />
                                </label>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="category-submit-btn">Submit</button>
                                <button type="button" className="cancel-btn" onClick={() => setShowApplyForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                )}

                {selectedImage && (
                    <div className="overlay" onClick={() => setSelectedImage(null)}>
                        <img src={selectedImage} alt="Full view" className="full-image" />
                    </div>
                )}

                {isSubmitting && (
                    <div className="loading-overlay">
                        {!submissionMessage ? (
                            <>
                                <div className="loader"></div>
                                <p className="loading-text">Saving your record and sending notification...</p>
                            </>
                        ) : (
                            <div className={`submission-popup ${submissionMessage.type}`}>
                                {submissionMessage.text}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryView;
