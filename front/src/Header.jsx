import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
    const user = JSON.parse(localStorage.getItem('user'));
    const [userId, setUserId] = useState(user?.user_id);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <header>
            <a href="/">
                <p>Mewtopia</p>
            </a>
            <nav>

                {/* <div className="nav-center">
                    <input type="text" placeholder="Search..." className="search-input" />
                </div> */}
                <div className="nav-right">
                    <Link to="/cats">Cats</Link>
                    {!userId && <Link to="/login">Login</Link>}
                    {!userId && <Link to="/register">Register</Link>}
                    {userId && <Link to="/profile">Profile</Link>}
                    <img
                        id="themeToggle"
                        src={theme === 'light' ? '/images/moon.png' : '/images/sun.png'}
                        className="theme-icon"
                        alt="Toggle theme"
                        onClick={toggleTheme}
                    />
                </div>
            </nav>
        </header>
    );
};

export default Header;
