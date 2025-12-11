import React, { useState, useEffect } from "react";
import "./BookingForm.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function BookingForm({ serviceName, onClose }) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        date: "",
        time: "",
    });

    const [status, setStatus] = useState("idle");
    const isBusy = status === "loading" || status === "success";

    useEffect(() => {
        document.body.classList.add("booking-modal-open");
        return () => {
            document.body.classList.remove("booking-modal-open");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");

        const dateTime = `${formData.date}T${formData.time}`;
        const dto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            serviceName: serviceName,
            bookingDate: dateTime,
        };

        try {
            const response = await fetch(`${baseUrl}/api/bookings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });

            if (response.ok) {
                setStatus("success");
                setTimeout(() => onClose(), 2500);
            } else {
                const text = await response.text();
                alert("Failed to submit booking: " + text);
                setStatus("idle");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
            setStatus("idle");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                {/* ✖ Cross Button */}
                <button
                    className="close-btn"
                    onClick={onClose}
                    disabled={isBusy}
                    aria-label="Close booking form"
                >
                    ✖
                </button>

                <h2 className="modal-title">
                    Book Slot: <span>{serviceName}</span>
                </h2>

                {isBusy && (
                    <div className="status-anim-wrapper">
                        {status === "loading" ? (
                            <>
                                <div className="loader"></div>
                                <p className="status-text">Processing your booking...</p>
                            </>
                        ) : (
                            <div className="success-message">
                                ✅ Booking Successful!<br />Check your email 📧
                            </div>
                        )}
                    </div>
                )}

                {status === "idle" && (
                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="form-row">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

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

                        <div className="form-row">
                            <div>
                                <label htmlFor="date">Select Preferred Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="time">Select Preferred Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    id="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <p className="payment-note">
                            💡 Note: Bill will need to be paid <strong>after use at DIY Lab only.</strong>
                        </p>

                        <button type="submit" className="service-submit-btn" disabled={isBusy}>
                            Submit Booking
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default BookingForm;
