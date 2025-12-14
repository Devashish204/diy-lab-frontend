import { useEffect, useState } from "react";
import axios from "axios";
import "./BlogPage.css";
import {useAuth} from "../../../components/AuthContext.jsx";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL_PROD}/api/blogs`;

export default function BlogPage() {
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const [newBlog, setNewBlog] = useState({
        author: "",
        category: "",
        title: "",
        year: "",
        link: "",
    });

    useEffect(() => {
        fetchRecentBlogs();
    }, []);

    const fetchRecentBlogs = async () => {
        const res = await axios.get(`${BASE_URL}/recent`);
        setBlogs(res.data);
    };
    const { user } = useAuth();

    const handlePublish = async () => {
        if (
            !newBlog.author ||
            !newBlog.category ||
            !newBlog.title ||
            !newBlog.year ||
            !newBlog.link
        ) {
            alert("Please fill all fields");
            return;
        }

        await axios.post(BASE_URL, {
            ...newBlog,
            ownerEmail: user.email
        });

        setNewBlog({
            author: "",
            category: "",
            title: "",
            year: "",
            link: "",
        });

        fetchRecentBlogs();
    };

        const handleSearch = async (value) => {
        setSearch(value);

        if (!value.trim()) {
            fetchRecentBlogs();
            return;
        }

        const res = await axios.get(`${BASE_URL}/search`, {
            params: { query: value },
        });
        setBlogs(res.data);
    };

    const handleCategoryFilter = async (category) => {
        setFilter(category);

        if (category === "All") {
            fetchRecentBlogs();
            return;
        }

        const res = await axios.get(`${BASE_URL}/category`, {
            params: { category },
        });
        setBlogs(res.data);
    };

    return (
        <div className="blog-page">
            <div className="blog-list">
                <h1>Blogs</h1>

                <input
                    type="text"
                    placeholder="Search by blog title or author"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />

                <div className="category-filter">
                    {[
                        "All",
                        "Design & Thinking Projects",
                        "Technologies Skill",
                        "Environment",
                        "Others",
                    ].map((cat) => (
                        <button
                            key={cat}
                            className={filter === cat ? "active" : ""}
                            onClick={() => handleCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="blogs">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="blog-card">
                            <h3>{blog.title}</h3>
                            <p><strong>Author:</strong> {blog.author}</p>
                            <p><strong>Category:</strong> {blog.category}</p>
                            <p><strong>Year:</strong> {blog.year}</p>
                            <a
                                href={blog.link}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Blog
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <div className="create-blog">
                <h2>Create New Blog</h2>

                <input
                    type="text"
                    placeholder="Author Name"
                    value={newBlog.author}
                    onChange={(e) =>
                        setNewBlog({ ...newBlog, author: e.target.value })
                    }
                />

                <select
                    value={newBlog.category}
                    onChange={(e) =>
                        setNewBlog({ ...newBlog, category: e.target.value })
                    }
                >
                    <option value="">Select Category</option>
                    <option>Design & Thinking Projects</option>
                    <option>Technologies Skill</option>
                    <option>Environment</option>
                    <option>Others</option>
                </select>

                <input
                    type="text"
                    placeholder="Blog Title"
                    value={newBlog.title}
                    onChange={(e) =>
                        setNewBlog({ ...newBlog, title: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Year"
                    value={newBlog.year}
                    onChange={(e) =>
                        setNewBlog({ ...newBlog, year: e.target.value })
                    }
                />

                <input
                    type="url"
                    placeholder="Blog Upload Link"
                    value={newBlog.link}
                    onChange={(e) =>
                        setNewBlog({ ...newBlog, link: e.target.value })
                    }
                />

                <button onClick={handlePublish} className="publish-btn">
                    Publish Blog
                </button>
            </div>
        </div>
    );
}
