import React, { useEffect, useState } from 'react';

const UserWorkshops = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // for modal preview

    useEffect(() => {
        fetch("${process.env.REACT_APP_API_BASE_URL}/api/workshops")
            .then(res => res.json())
            .then(data => {
                console.log("Fetched workshops:", data);
                setWorkshops(data);
            })
            .catch(err => {
                console.error("Error fetching workshops:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Available Workshops</h2>

            {loading ? (
                <p>Loading workshops...</p>
            ) : workshops.length === 0 ? (
                <p>No workshops available.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '1rem'
                }}>
                    {workshops.map((workshop) => (
                        <div key={workshop.id} style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '1rem',
                            backgroundColor: '#f9f9f9'
                        }}>
                            <h3>{workshop.title}</h3>
                            <p><strong>Objectives:</strong> {workshop.objectives}</p>
                            <p><strong>Description:</strong> {workshop.description}</p>
                            <p><strong>Age Group:</strong> {workshop.ageGroup}</p>
                            <p><strong>Date & Time:</strong> {new Date(workshop.dateAndTime).toLocaleString()}</p>
                            <p><strong>Fees:</strong> ₹{workshop.fees}</p>

                            <img
                                src={`http://localhost:8080/api/admin/workshops/image/${workshop.id}`}
                                alt={workshop.title}
                                style={{
                                    width: '100%',
                                    marginTop: '10px',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setSelectedImage(`${process.env.REACT_APP_API_BASE_URL}/api/admin/workshops/image/${workshop.id}`)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Image modal preview */}
            {selectedImage && (
                <div
                    onClick={() => setSelectedImage(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                        cursor: 'zoom-out'
                    }}
                >
                    <img
                        src={selectedImage}
                        alt="Full view"
                        style={{
                            maxWidth: '95vw',
                            maxHeight: '90vh',
                            width: 'auto',
                            height: 'auto',
                            objectFit: 'contain',
                            borderRadius: '12px',
                            boxShadow: '0 0 12px rgba(0, 0, 0, 0.6)',
                            backgroundColor: '#fff',
                            padding: '8px'
                        }}
                    />

                </div>
            )}
        </div>
    );
};

export default UserWorkshops;
