import React, { useState } from "react";
import "./ServicesPage.css";
import Header from "../../../components/Header.jsx";
import BookingForm from "../../../components/BookingForm.jsx";

// add baseUrl for consistency
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function ServicesPage() {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            title: "3D Printers",
            desc: "Bring your designs to life with our advanced 3D printers — Julia Advanced and Julia Extended — ideal for rapid prototyping, product development, and creative experimentation.",
            img: "/images/ServicesPageImages/3d%20printer%20image.png",
            fees: "Rs 10/gm (Students), Rs 12/gm (Others)",
        },
        {
            title: "Laser Cutting Machine",
            desc: "High-precision laser cutting for wood, acrylic, and fabrics — engrave intricate designs effortlessly, perfect for both creative and professional projects.",
            img: "/images/ServicesPageImages/laserCuttingMachine-removebg-preview.png",
            fees: "Rs 8/min (Students), Rs 12/min (Others)",
        },
        {
            title: "Vinyl Cutting Machine",
            desc: "Design and cut stickers, decals, and graphics with precision — ideal for branding, customization, and professional-quality results.",
            img: "/images/ServicesPageImages/vinylCutingMachine-removebg-preview.png",
            fees: "Rs 8/min (Students), Rs 12/min (Others)",
        },
        {
            title: "Laboratory Tools",
            desc: "Well-equipped laboratory with drills, grinders, hand tools, and precision instruments — supporting accurate fabrication and hands-on project work.",
            img: "/images/ServicesPageImages/DIYTools.jpeg",
            fees: "Rs 200/hr | Rs 750/ 4hr",
        },
        {
            title: "3D and 2D Software with Internet Access",
            desc: "Work with powerful platforms like SolidWorks, Fusion 360, FreeCAD, and Autodesk Fusion — design, simulate, and refine your projects seamlessly with full internet access for research and collaboration.",
            img: "/images/ServicesPageImages/desktopImage-removebg-preview.png",
            fees: "Rs 200/hr | Rs 750/ 4hr",
        },
    ];

    return (
        <>
            <Header />
            <div className="services-page">
                <section className="services-header">
                    <img
                        src="/images/ServicesPageImages/digital-services.png"
                        alt="services-logo"
                        className="services-logo"
                    />
                    <h2>Our Services</h2>
                    <p>
                        At Vigyan Ashram’s DIY Lab, we offer state-of-the-art tools,
                        machines, and resources that empower students, makers, and
                        entrepreneurs to transform their ideas into reality. Our lab is
                        designed to spark creativity, foster innovation, and support every
                        step of your journey from concept to creation.
                    </p>
                </section>

                {services.map((service, index) => (
                    <div key={index} className="service-card">
                        <div className="service-image-container">
                            <img src={service.img} alt={service.title} />
                        </div>
                        <div className="service-info">
                            <h3>{service.title}</h3>
                            <p>{service.desc}</p>
                            <p className="service-fees">
                                <strong>Fees:</strong> {service.fees}
                            </p>
                            <div className="service-buttons">
                                <button onClick={() => setSelectedService(service.title)}>
                                    Book Service
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="charges-note">
                    <p>💡 Note: Instructor Guidance: Rs 200/hr</p>
                </div>
            </div>

            {selectedService && (
                <BookingForm
                    serviceName={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </>
    );
}

export default ServicesPage;
