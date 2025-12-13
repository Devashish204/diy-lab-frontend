import React from "react";
import "./TeamPage.css";

const members = [
    {
        id: 1,
        name: "Dr. Yogesh Kulkarni",
        role: "Director, Vigyan Ashram",
        image: "/images/TeamImages/YogeshSirPhoto.jpg",
    },
    {
        id: 2,
        name: "Mr. Ranjeet Shanbag",
        role: "Deputy Director",
        image: "/images/TeamImages/Mr.-Ranjeet-Shanbag.webp",
    },
    {
        id: 3,
        name: "Mr. Kishor Gaikwad",
        role: "Program Manager",
        image: "/images/TeamImages/KishorSirPhoto.jpg",
    },
    {
        id: 4,
        name: "Mr. Sakib Ahamad",
        role: "DIY-LAB Incharge",
        image: "/images/TeamImages/SakibPhoto.jpg",
    },
];

export default function TeamSection() {
    return (
        <section className="team-section">
            <h2 className="team-title">Team @DIY Lab</h2>
            <div className="team-grid">
                {members.map((member) => (
                    <div key={member.id} className="team-card">
                        <div className="member-image">
                            <img src={member.image} alt={member.name} />
                        </div>
                        <div className="member-info">
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
