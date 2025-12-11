import React, { useState } from "react";
import axios from "axios";
import "./Feedback.css";
import { FaStar } from "react-icons/fa";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        rating: 0,
        comments: "",
    });
    const [hover, setHover] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, date: new Date().toISOString().split("T")[0] };
            await axios.post(`${baseUrl}/api/feedback/submitFeedback`, payload);
            setMessage("Thanks for your feedback!");
            setFormData({ name: "", email: "", rating: 0, comments: "" });
            setHover(null);
        } catch (error) {
            setMessage("Error submitting feedback. Please try again later.");
        }
    };

    return (
        <div className="feedback-page">
        <div className="feedback-container">
            <h2 className="feedback-title">We Value Your Feedback!</h2>
            <p className="feedback-subtitle">
                Your thoughts help us improve our services and provide better experiences.
            </p>

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Rate Your Experience</label>
                    <div className="star-rating">
                        {[...Array(5)].map((star, index) => {
                            const ratingValue = index + 1;
                            return (
                                <FaStar
                                    key={index}
                                    size={30}
                                    className="star"
                                    color={
                                        ratingValue <= (hover || formData.rating)
                                            ? "#FFD700"
                                            : "#ccc"
                                    }
                                    onClick={() =>
                                        setFormData({ ...formData, rating: ratingValue })
                                    }
                                    onMouseEnter={() => setHover(ratingValue)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            );
                        })}
                    </div>
                </div>

                <div className="form-group">
                    <label>Comments</label>
                    <textarea
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        placeholder="Share your thoughts or suggestions..."
                        required
                    ></textarea>
                </div>

                <button type="submit" className="feedback-submit-btn">
                    Submit Feedback
                </button>
            </form>

            {message && <p className="feedback-message">{message}</p>}
        </div>
        </div>
    );
}
