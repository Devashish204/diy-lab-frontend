import React from "react";
import "./RecommendedAge.css";
import { useNavigate } from "react-router-dom";

export default function RecommendedAge() {
    const navigate = useNavigate();

    const ageGroups = [
        { title: "Grade 3 to 12", description: "Students from elementary to high school can explore hands-on learning and creativity at DIY Lab." },
        { title: "UG and PG Students", description: "University and postgraduate students can access advanced tools and resources for innovation and research." },
    ];

    return (
        <div className="recommended-age-container">
            <h1 className="recommended-age-title">Recommended Age</h1>

            <div className="recommended-age-grid">
                {ageGroups.map((group, index) => (
                    <div key={index} className="age-card">
                        <h2>{group.title}</h2>
                        <p>{group.description}</p>
                    </div>
                ))}
            </div>

            <div className="age-button-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
            </div>
        </div>
    );
}
