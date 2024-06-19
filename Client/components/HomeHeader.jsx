import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../src/App";
import "../css/homeHeader.css";

function HomeHeader() {
  const { user } = useContext(userContext);
  return (
    <nav className="home-header-nav">
      <ul>
        <li>
          <Link to="/home/logout">Logout</Link>
        </li>
        <li>
          <Link to="/home/messages">הודעות</Link>
        </li>
        <li>
          <Link to="/home/user-borrows">השאלות קודמות</Link>
        </li>
        <li>
          <Link to="/home/user-books">ספרים בבעלותך</Link>
        </li>
        <li>
          <Link to="/home/new-borrow">השאלה חדשה</Link>
        </li>
      </ul>
    </nav>
  );
}

export default HomeHeader;
