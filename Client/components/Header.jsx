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
                    Our Library
                </NavLink>
            </div>
        </header>
    );
}

export default Header;
