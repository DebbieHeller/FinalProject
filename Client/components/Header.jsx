import React from "react";
import { NavLink } from "react-router-dom";
import "../css/header.css"; 

function Header() {
    return (
        <header className="main-header">
            <div className="header-left">
                <nav className="nav-header">
                    <NavLink
                        to="/login"
                        className="nav-link"
                        activeclassname="active-link"
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/sign-up"
                        className="nav-link"
                        activeclassname="active-link"
                    >
                        Sign-up
                    </NavLink>
                </nav>
            </div>
            <div className="header-right">
                <NavLink to="/" className="site-logo">
                    <img className="logo" src="https://www.jerusalem.muni.il/media/41271/library_wp.png" alt="עמוד הבית" />
                </NavLink>
            </div>
        </header>
    );
}

export default Header;
