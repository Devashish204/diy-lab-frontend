import React from "react";
import "./Facilities.css";
import {useNavigate} from "react-router-dom";

export default function Facilities() {
    const navigate = useNavigate();
    const facilities = [
        { title: "Fabrication Tools", image: "/images/ServicesPageImages/DIYTools.jpeg" },
        { title: "Electronics Workstations", image: "/images/ServicesPageImages/ElectronicsWorkstation.jpg" },
        { title: "3D Printing", image: "/images/ServicesPageImages/3d printer image.png" },
        { title: "Laser Cutting", image: "/images/ServicesPageImages/laserCuttingMachine-removebg-preview.png" },
        { title: "Vinyl Cutting", image: "/images/ServicesPageImages/vinylCutingMachine-removebg-preview.png" },
        { title: "Computer Lab", image: "/images/ServicesPageImages/desktopImage-removebg-preview.png" },
    ];

    return (
        <div className="facilities-container">
            <h1 className="facilities-title">Our Facilities</h1>

            <div className="facilities-grid">
                {facilities.map((facility, index) => (
                    <div key={index} className="facility-card">
                        <div className="facility-image">
                            <img src={facility.image} alt={facility.title} />
                        </div>
                        <h3>{facility.title}</h3>
                    </div>
                ))}
            </div>

            <div className="explore-button-container">
                <button className="explore-button" onClick={() => navigate("/users/services")} >Explore Our Services</button>
            </div>
        </div>
    );
}
