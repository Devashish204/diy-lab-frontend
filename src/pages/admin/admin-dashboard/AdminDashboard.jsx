import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        workshops: 0,
        users: 0,
        appointments: 0,
        internships: 0,
        services: 0,
        memberships: 0,
        careers: 0,
        courses: 0,
    });

    const navigate = useNavigate();

    // add baseUrl
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/admin-login");
            return;
        }

        const user = JSON.parse(storedUser);
        if (user.role !== "ADMIN") {
            localStorage.removeItem("user");
            navigate("/admin-login");
            return;
        }
    }, [navigate]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${baseUrl}/api/admin/stats`, {
                    withCredentials: true,
                });
                setStats(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem("user");
                    navigate("/admin-login");
                } else {
                    console.error("Error fetching stats:", err);
                }
            }
        };
        fetchStats();
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <aside className="sidebar">
                <h2>Admin Panel</h2>
                <nav>
                    <ul>
                        <li><Link to="/admin/workshops">Workshops</Link></li>
                        <li><Link to="/admin/services">Services</Link></li>
                        <li><Link to="/admin/teacher-training">Teacher Training</Link></li>
                        <li><Link to="/admin/school-visits">School Visits</Link></li>
                        <li><Link to="/admin/memberships">DIY-LAB Membership</Link></li>
                        <li><Link to="/admin/blogs">Blogs</Link></li>
                        <li><Link to="/admin/appointments">Appointments</Link></li>
                        <li><Link to="/admin/internships">Internships</Link></li>
                        <li><Link to="/admin/careers">Careers</Link></li>
                        <li><Link to="/admin/courses">Courses</Link></li>
                        <li><Link to="/admin/announcement">Announcements</Link></li>
                        <li><Link to="/admin/feedbacks">Feedbacks</Link></li>
                    </ul>
                </nav>
            </aside>

            <main className="dashboard-content">
                <h1>Welcome to Admin Dashboard 🎉</h1>
                <p>Select a section from the sidebar to manage your application.</p>

                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Workshops</h3>
                        <p>{stats.workshops}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p>{stats.users}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Appointments</h3>
                        <p>{stats.appointments}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Internship Applications</h3>
                        <p>{stats.internships}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Services</h3>
                        <p>{stats.services}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Memberships</h3>
                        <p>{stats.memberships}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Career Applications</h3>
                        <p>{stats.careers}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Courses</h3>
                        <p>{stats.courses}</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
