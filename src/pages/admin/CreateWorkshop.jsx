import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateWorkshop = () => {
    const [form, setForm] = useState({
        title: '',
        category: '',
        description: '',
        ageGroup: '',
        startDateTime: '',
        endDateTime: '',
        venue: '',
        fees: '',
        totalInTake: '',
        image: null,
    });

    const navigate = useNavigate();

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
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in form) {
            formData.append(key, form[key]);
        }

        try {
            const res = await fetch(`${baseUrl}/api/admin/workshops`, {
                method: 'POST',
                body: formData,
                credentials: "include",
            });

            if (res.ok) {
                alert('Workshop Created Successfully!');
                setForm({
                    title: '',
                    category: '',
                    description: '',
                    ageGroup: '',
                    startDateTime: '',
                    endDateTime: '',
                    venue: '',
                    fees: '',
                    totalInTake: '',
                    image: null
                });
            } else if (res.status === 401) {
                localStorage.removeItem("user");
                navigate("/admin-login");
            } else {
                alert("Failed to create Workshop.");
            }
        } catch (err) {
            console.error(err);
            alert('Server error. Try again later.');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '1rem',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create New Workshop</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label style={labelStyle}>Workshop Title</label>
                <input name="title" value={form.title} onChange={handleChange} style={inputStyle} required />

                <label style={labelStyle}>Workshop Category</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                >
                    <option value="">Select Workshop Category</option>
                    <option value="Robotics">Robotics</option>
                    <option value="Electronics & IoT">Electronics & IoT</option>
                    <option value="Art & Craft">Art & Craft</option>
                    <option value="3D Design & Printing">3D Design & Printing</option>
                    <option value="Coding and Programming">Coding and Programming</option>
                    <option value="Science">Science</option>
                    <option value="CNC-Laser Cutting">CNC-Laser Cutting</option>
                    <option value="Carpentry">Carpentry</option>
                    <option value="Others">Others</option>
                </select>

                <label style={labelStyle}>Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    style={inputStyle}
                    rows="4"
                    required
                />

                <label style={labelStyle}>Age Group</label>
                <input
                    name="ageGroup"
                    value={form.ageGroup}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>Start Date & Time</label>
                <input
                    name="startDateTime"
                    type="datetime-local"
                    value={form.startDateTime}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>End Date & Time</label>
                <input
                    name="endDateTime"
                    type="datetime-local"
                    value={form.endDateTime}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>Venue</label>
                <textarea
                    name="venue"
                    value={form.venue}
                    onChange={handleChange}
                    style={inputStyle}
                    rows="1"
                    required
                />

                <label style={labelStyle}>Fees (₹)</label>
                <input
                    name="fees"
                    type="number"
                    value={form.fees}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                />

                <label style={labelStyle}>Total In Take</label>
                <textarea
                    name="totalInTake"
                    value={form.totalInTake}
                    onChange={handleChange}
                    style={inputStyle}
                    rows="1"
                    required
                />

                <label style={labelStyle}>Upload Image</label>
                <input
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button type="submit" style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                }}>
                    Create Workshop
                </button>
            </form>
        </div>
    );
};

export default CreateWorkshop;
