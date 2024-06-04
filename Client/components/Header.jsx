import React from "react"
import { Link, NavLink } from "react-router-dom"

function Header() {

    const activeStyles = {
        fontWeight: "bold",
        textDecoration: "underline",
        color: "#161616",
        textDecorationColor: "rgb(127, 205, 179)",
    };

    return (
        <header className="main-header">
            <Link className="site-logo" to="/">Our Website📸</Link>
            <nav className="nav-header">
                <NavLink
                    to="/login"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Login
                </NavLink>
                <NavLink
                    to="/register"
                    style={({ isActive }) => isActive ? activeStyles : null}
                >
                    Register
                </NavLink>
            </nav>
        </header>
    )
}

export default Header