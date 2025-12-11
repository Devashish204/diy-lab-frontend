import React from "react";
import './Dashboard.css';

function Dashboard(){
    return(
        <div className="dashboard">
            {/*Section 1: Live Workshops */}
                <section className = "section live-workshops">
                    <h2>Live Workshops</h2>
                    <p>No live workshops currently running.</p>
                </section>

                {/*Section 2: Register for a New Workshop*/}

            <section className = "section register-workshop">
                <h2>Register for a new Workshop</h2>
                <button className = "register-btn">Register Now</button>
            </section>

            {/* Section 3: Upcoming Workshops*/}

            <section className = "section upcoming-workshops">
                <h2>Upcoming Workshops</h2>
                <ul>
                    <li>DIY Paper Making – 10 Aug 2025</li>
                    <li>RC Robot Build – 15 Aug 2025</li>
                    <li>Smart Bot Programming – 20 Aug 2025</li>
                </ul>
            </section>
        </div>
    );
}

export default Dashboard;

