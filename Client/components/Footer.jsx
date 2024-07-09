import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi"; // Import icons from react-icons library
import "../css/footer.css"; // Assuming you have a CSS file for Footer styling

function Footer() {
    return (
        <ul className="footer-list">
            <li className="footer-item">
                <FiMail className="footer-icon" />
                info@example.com
            </li>
            <li className="footer-item">
                <FiPhone className="footer-icon" />
                02-5871274
            </li>
            <li className="footer-item">
                <FiMapPin className="footer-icon" />
                123 Library St, City
            </li>
        </ul>
    );
}

export default Footer;
