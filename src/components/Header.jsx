import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../components/AuthContext.jsx';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/user-login');
        setMenuOpen(false);
    };

    // AUTO-CLOSE menu when switching pages
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="header">
            <div className="left-section">
                <img src="/images/diy-lab-logo.png" alt="logo" className="logo-img2" />
            </div>

            <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
                <Link to="/users/home" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/about" className="nav-link" onClick={() => setMenuOpen(false)}>About</Link>
                <Link to="/users/booking" className="nav-link" onClick={() => setMenuOpen(false)}>Book Slot</Link>
                <Link to="/learn&engage" className="nav-link" onClick={() => setMenuOpen(false)}>Learn & Engage</Link>
                <Link to="/users/explore" className="nav-link" onClick={() => setMenuOpen(false)}>Explore</Link>
                <Link to="/user/visits" className="nav-link" onClick={() => setMenuOpen(false)}>Visit</Link>
                <Link to="/users/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</Link>

                {user ? (
                    <>
                        <button
                            className="nav-link account-button"
                            onClick={() => {
                                navigate('/user-myaccount');
                                setMenuOpen(false);
                            }}
                        >
                            My Account
                        </button>

                        <button
                            className="nav-link logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/user-login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</Link>
                )}
            </nav>

            <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} color="white" /> : <Menu size={28} color="white" />}
            </div>
        </header>
    );
}

export default Header;
