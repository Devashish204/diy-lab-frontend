import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBlogManagment.css";
import { useNavigate } from "react-router-dom";


const API = `${import.meta.env.VITE_API_BASE_URL_PROD}/api/blogs/admin`;

export default function AdminBlogManagement() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [editingBlog, setEditingBlog] = useState(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const res = await axios.get(API, { withCredentials: true });
        setBlogs(res.data);
    };

    const handleSearch = async (value) => {
        setSearch(value);

        if (!value.trim()) {
            fetchBlogs();
            return;
        }

        const res = await axios.get(`${API}/search`, {
            params: { query: value },
            withCredentials: true
        });
        setBlogs(res.data);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this blog?")) return;

        await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL_PROD}/api/blogs/admin/${id}`,
            { withCredentials: true }
        );

        fetchBlogs();
    };


    const handleUpdate = async () => {
        await axios.put(
            `${import.meta.env.VITE_API_BASE_URL_PROD}/api/blogs/admin/${editingBlog.id}`,
            {
                title: editingBlog.title,
                category: editingBlog.category,
                year: editingBlog.year,
                link: editingBlog.link
            },
            { withCredentials: true }
        );
        setEditingBlog(null);
        fetchBlogs();
    };

    return (
        <div className="admin-blogs">

            <button
                className="back-btn"
                onClick={() => navigate("/admin/dashboard")}
            >
                ← Back to Dashboard
            </button>

            <h1>Manage Blogs</h1>

            <input
                type="text"
                placeholder="Search by student name or blog title"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />

            <table>
                <thead>
                <tr>
                    <th>Student</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Year</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {blogs.map(blog => (
                    <tr key={blog.id}>
                        <td>{blog.author}</td>
                        <td>{blog.title}</td>
                        <td>{blog.category}</td>
                        <td>{blog.year}</td>
                        <td>
                            <button onClick={() => setEditingBlog(blog)}>Edit</button>
                            <button onClick={() => handleDelete(blog.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {editingBlog && (
                <div className="modal">
                    <div className="modal-box">

                        <h3>Edit Blog</h3>

                        <input
                            value={editingBlog.title}
                            onChange={e => setEditingBlog({ ...editingBlog, title: e.target.value })}
                        />

                        <input
                            value={editingBlog.category}
                            onChange={e => setEditingBlog({ ...editingBlog, category: e.target.value })}
                        />

                        <input
                            value={editingBlog.year}
                            onChange={e => setEditingBlog({ ...editingBlog, year: e.target.value })}
                        />

                        <input
                            value={editingBlog.link}
                            onChange={e => setEditingBlog({ ...editingBlog, link: e.target.value })}
                        />

                        <div className="modal-actions">
                            <button className="blog-update-btn" onClick={handleUpdate}>
                                Update
                            </button>

                            <button
                                className="blog-delete-btn"
                                onClick={() => handleDelete(editingBlog.id)}
                            >
                                Delete
                            </button>
                        </div>

                        <button
                            className="blog-cancel-btn"
                            onClick={() => setEditingBlog(null)}
                        >
                            Cancel
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
