import React, {useState} from "react";
import "./MemberShip.css";
import {Link} from "react-router-dom";

// add baseUrl
const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function MembershipPage() {
    const [showForm, setShowForm] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const [formData, setFormData] = useState({
        enquirerName: "",
        studentName: "",
        schoolName: "",
        email: "",
        phone: "",
    });

    const plans = [
        {
            level: "Level 1",
            grade: "Grade: 3 to 5",
            features: [
                "Fundamentals of Science",
                "Introduction to various lab tools",
                "Development of motor skills",
            ],
        },
        {
            level: "Level 2",
            grade: "Grade: 6 to 7",
            features: [
                "Learning while Doing methodology",
                "Design thinking",
                "Project based learning",
            ],
        },
        {
            level: "Level 3",
            grade: "Grade: 8 to 10",
            features: [
                "IoT based actual projects",
                "Project documentation",
                "Actual Problem Solving methods",
            ],
        },
    ];

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const response = await fetch(`${baseUrl}/api/apply-membership`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    enquirerName: formData.enquirerName,
                    studentName: formData.studentName,
                    schoolName: formData.schoolName,
                    email: formData.email,
                    phoneNumber: formData.phone,
                    level: selectedLevel
                })
            });

            if (response.ok) {
                setStatus("success");
                setFormData({
                    enquirerName: "",
                    studentName: "",
                    schoolName: "",
                    email: "",
                    phone: "",
                });
                setTimeout(() => {
                    setShowForm(false);
                    setStatus(null);
                }, 2500);
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error(err);
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="membership-page">
            {/* Hero Section */}
            <section className="membership-hero">
                <div className="hero-content">
                    <img
                        src="/images/MembershipPage-Images/membership.png"
                        alt="Membership Icon"
                        className="membership-icon"
                    />
                    <h1>DIY Lab Membership</h1>
                    <p>
                        Your journey of learning, experimenting, and creating begins here.
                        Choose a membership plan that empowers your skills and ideas at
                        every level.
                    </p>
                </div>
            </section>

            {/* Plans Section */}
            <section className="membership-plans">
                <h2>Our Membership Plans</h2>
                <div className="plans-container">
                    {plans.map((plan, index) => (
                        <div key={index} className="plan-card">
                            <h3>{plan.level}</h3>
                            <p className="grade">{plan.grade}</p>
                            <ul>
                                {plan.features.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                            <div className="card-buttons">
                                <button className="btn-outline">Learn More</button>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setSelectedLevel(plan.level);
                                        setShowForm(true);
                                    }}
                                >
                                    Apply Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Popup Form */}
            {showForm && (
                <div className="popup-overlay">
                    <div className="popup-form">
                        <h3>Applying for {selectedLevel}</h3>

                        {loading ? (
                            <div className="loader"></div>
                        ) : status === "success" ? (
                            <div className="status success">✔ Application Submitted!</div>
                        ) : status === "error" ? (
                            <div className="status error">✖ Submission Failed</div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="enquirerName"
                                    placeholder="Enquirer Name"
                                    value={formData.enquirerName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="studentName"
                                    placeholder="Student Name"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="text"
                                    name="schoolName"
                                    placeholder="School/College Name"
                                    value={formData.schoolName}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-outline"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Contact Section */}
            <section className="membership-contact">
                <p>
                    For more inquiries please contact <strong>DIY LAB</strong> Now
                </p>
                <Link to="/users/contact" className="contact-link">
                    Contact us
                </Link>
            </section>
        </div>
    );
}

export default MembershipPage;