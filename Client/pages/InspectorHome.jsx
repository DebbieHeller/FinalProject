import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../src/App";
import "../css/home.css";

function InspectorHome() {
  const { user } = useContext(userContext);

  return (
    <div>
      <nav className="home-header-nav">
        <ul>
          <li>
            <Link to="/inspector-home/logout">Logout</Link>
          </li>
          <li>
            <Link to="/inspector-home/view-borrows" >צפייה בהשאלות</Link>
          </li>
          <li>
            <Link to="/inspector-home/returned-books">ספרים שהוחזרו</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default InspectorHome;
