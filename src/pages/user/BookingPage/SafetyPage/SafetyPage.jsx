import React from "react";
import "./SafetyPage.css";
import { useNavigate } from "react-router-dom";

export default function SafetyPage() {
    const navigate = useNavigate();

    const safetyData = [
        {
            title: "Fabrication Tools",
            items: [
                "Safety goggles",
                "Gloves (heat and cut-resistant)",
                "Apron or protective clothing",
                "Ear protection (if power tools used)",
                "Proper ventilation",
            ],
            icon: "🧰",
        },
        {
            title: "Electronics Workstations",
            items: [
                "Anti-static wrist strap",
                "Insulated gloves",
                "Safety glasses",
                "Fire extinguisher nearby",
                "Well-ventilated workspace",
            ],
            icon: "⚡",
        },
        {
            title: "3D Printing",
            items: [
                "Safety glasses",
                "Heat-resistant gloves (for heated bed)",
                "Mask (for fumes in enclosed areas)",
                "Proper ventilation",
                "Avoid touching moving parts",
            ],
            icon: "🖨️",
        },
        {
            title: "Laser Cutting",
            items: [
                "Laser safety glasses (correct wavelength)",
                "Fire-resistant gloves",
                "Avoid reflective materials",
                "Keep fire extinguisher nearby",
                "Operate in supervised environment",
            ],
            icon: "🔦",
        },
        {
            title: "Vinyl Cutting",
            items: [
                "Safety glasses",
                "Avoid loose clothing",
                "Use sharp blades carefully",
                "Keep fingers away from moving carriage",
                "Ensure machine is powered off before maintenance",
            ],
            icon: "✂️",
        },
        {
            title: "Computer Lab",
            items: [
                "Maintain good posture",
                "Avoid food or liquids near computers",
                "Cable management to prevent tripping",
                "Use surge protectors",
                "Regular breaks to reduce eye strain",
            ],
            icon: "💻",
        },
    ];

    return (
        <div className="safety-container">
            <h1 className="safety-title">Safety Guidelines</h1>
            <p className="safety-subtitle">
                Ensure you follow these safety measures while using our lab facilities.
            </p>

            <div className="safety-grid">
                {safetyData.map((section, index) => (
                    <div key={index} className="safety-card">
                        <div className="safety-icon">{section.icon}</div>
                        <h2>{section.title}</h2>
                        <ul>
                            {section.items.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="safety-button-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    ← Back
                </button>
            </div>
        </div>
    );
}
