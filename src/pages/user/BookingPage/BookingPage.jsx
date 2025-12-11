import React from "react";
import Header from "../../../components/Header.jsx";
import { useNavigate } from "react-router-dom";
import "./BookingPage.css";

const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

function BookingPage() {
  const navigate = useNavigate();

  return (
      <>
        <Header />
        <div className="booking-page">

          {/* 🔹 MEMBERSHIP — MOVED TO TOP */}
          <section className="section yellow">
            <div className="section-header">
              <img src="/images/BookingPage-Images/membership.png" alt="Membership Icon" />
              <h2>DIY Lab Membership</h2>
            </div>
            <p>Join our community of makers and innovators.</p>
            <button className="booking-btn" onClick={() => navigate("/membership?category=Membership")}>
              View Membership Plans
            </button>
          </section>

          {/* Workshops */}
          <section className="section white">
            <div className="section-header">
              <img src="/images/BookingPage-Images/workshops_icon.png" alt="Workshop Icon" />
              <h2>Workshops</h2>
            </div>
            <p>Create. Innovate. Explore – Workshops that turn ideas into reality at DIY Lab!</p>
            <button className="booking-btn" onClick={() => navigate("/learn&engage?category=Workshops")}>
              Explore & Register
            </button>
          </section>

          {/* Services */}
          <section className="section yellow">
            <div className="section-header">
              <img src="/images/BookingPage-Images/digital-services.png" alt="Digital Services" />
              <h2>Services</h2>
            </div>
            <p>Turn your ideas into reality – explore tools, machines, and innovation at DIY Lab!</p>
            <button className="booking-btn" onClick={() => navigate("/users/services?category=Services")}>
              Explore Now
            </button>
          </section>

          {/* Teacher Training */}
          <section className="section white">
            <div className="section-header">
              <img src="/images/BookingPage-Images/teacher-training.png" alt="Teacher Training Icon" />
              <h2>Teacher Training Program</h2>
            </div>
            <p>
              Empowering educators with hands-on skills, innovative tools, and creative teaching methods
              to inspire the next generation of makers.
            </p>
            <button className="booking-btn" onClick={() => navigate("/user/teacher-training")}>
              Explore & Register
            </button>
          </section>

          {/* School Visits */}
          <section className="section yellow">
            <div className="section-header">
              <img src="/images/BookingPage-Images/school-visits.png" alt="School Visits Icon" />
              <h2>School Visits</h2>
            </div>
            <p>
              A fun-filled day at DIY Lab where students explore, create, and discover the joy of making
              through hands-on projects.
            </p>
            <button className="booking-btn" onClick={() => navigate("/school-visit?category=School-Visits")}>
              Apply Now
            </button>
          </section>

          {/* Info Section */}
          <section className="info-section">
            <h3>Things You Must Know</h3>
            <div className="info-grid">
              <button className="info-btn" onClick={() => navigate("/users/explore?category=explore")}>Visiting Hours</button>
              <button className="info-btn" onClick={() => navigate("/user/recommendedAge")}>Recommended Age</button>
              <button className="info-btn" onClick={() => navigate("/facilities")}>Facilities</button>
              <button
                  className="info-btn"
                  onClick={() => window.open("https://maps.app.goo.gl/mY4UWaesD8Rc1JFH9", "_blank")}
              >
                Location
              </button>
              <button className="info-btn" onClick={() => navigate("/user/safety")}>Safety</button>
            </div>
          </section>

        </div>
      </>
  );
}

export default BookingPage;
