import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminServices.css";

const AdminServices = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loadingIds, setLoadingIds] = useState([]);
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        serviceName: ""
    });

    // use Vite env
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const API_BASE = `${baseUrl}/api/bookings`;

    const services = [
        "3D printers",
        "Laser cutting machine",
        "Vinyl cutting machine",
        "Laboratory tools",
        "3D and 2D Software with Internet Access"
    ];

    axios.defaults.withCredentials = true;

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
        }
    }, [navigate]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleUnauthorized = () => {
        localStorage.removeItem("user");
        navigate("/admin-login");
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get(API_BASE, { withCredentials: true });
            setBookings(
                res.data.map((b) => ({ ...b, approved: b.approved || false }))
            );
        } catch (error) {
            if (error.response && error.response.status === 401) handleUnauthorized();
            else console.error(error);
        }
    };

    const fetchFilteredBookings = async () => {
        try {
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.serviceName) params.serviceName = filters.serviceName;

            const res = await axios.get(`${API_BASE}/filter`, {
                params,
                withCredentials: true
            });
            setBookings(
                res.data.map((b) => ({ ...b, approved: b.approved || false }))
            );
        } catch (error) {
            if (error.response && error.response.status === 401) handleUnauthorized();
            else console.error(error);
        }
    };

    const handleApprove = async (bookingId) => {
        setLoadingIds((prev) => [...prev, bookingId]);
        try {
            await axios.post(`${API_BASE}/${bookingId}/approve`, {}, { withCredentials: true });
            setBookings((prev) =>
                prev.map((b) =>
                    b.bookingId === bookingId ? { ...b, approved: true } : b
                )
            );
        } catch (error) {
            if (error.response && error.response.status === 401) handleUnauthorized();
            else console.error(error);
        } finally {
            setLoadingIds((prev) => prev.filter((id) => id !== bookingId));
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleResetFilters = () => {
        setFilters({ startDate: "", endDate: "", serviceName: "" });
        fetchBookings();
    };

    const handleDownloadReport = async () => {
        try {
            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;
            if (filters.serviceName) params.serviceName = filters.serviceName;

            const res = await axios.get(`${API_BASE}/export`, {
                params,
                responseType: "blob",
                withCredentials: true
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "bookings_report.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            if (error.response && error.response.status === 401) handleUnauthorized();
            else console.error("Error downloading report:", error);
        }
    };

    return (
        <div className="admin-bookings">
            <h1>Service Bookings</h1>

            <div className="filter-section">
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                />
                <select
                    name="serviceName"
                    value={filters.serviceName}
                    onChange={handleFilterChange}
                >
                    <option value="">All Services</option>
                    {services.map((service, index) => (
                        <option key={index} value={service}>
                            {service}
                        </option>
                    ))}
                </select>
                <button className="filter-btn" onClick={fetchFilteredBookings}>
                    Apply Filters
                </button>
                <button className="reset-btn" onClick={handleResetFilters}>
                    Reset
                </button>
                <button className="download-btn" onClick={handleDownloadReport}>
                    Download Report
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Booking Date</th>
                        <th>Service Name</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {bookings.map((booking) => {
                        const isLoading = loadingIds.includes(booking.bookingId);
                        return (
                            <tr key={booking.bookingId}>
                                <td>{booking.bookingId}</td>
                                <td>{booking.firstName}</td>
                                <td>{booking.lastName}</td>
                                <td>{booking.email}</td>
                                <td>{booking.phone}</td>
                                <td>
                                    {booking.bookingDate
                                        ? new Date(booking.bookingDate).toLocaleString()
                                        : "N/A"}
                                </td>
                                <td>{booking.serviceName}</td>
                                <td>
                                    <button
                                        disabled={booking.approved || isLoading}
                                        className={booking.approved ? "approved" : ""}
                                        onClick={() => handleApprove(booking.bookingId)}
                                    >
                                        {isLoading
                                            ? "Approving..."
                                            : booking.approved
                                                ? "Approved"
                                                : "Approve"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
                <button
                    className="service-back-btn"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default AdminServices;
