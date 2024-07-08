import { Link } from "react-router-dom";
import "../css/home.css";

function InspectorHome() {

  return (
    <div>
      <nav className="home-header-nav">
        <ul>
          <li>
            <Link to="/inspector-home/logout">Logout</Link>
          </li>
          <li>
            <Link to="/inspector-home/not-returned-books">ספרים שלא הוחזרו</Link>
          </li>
          <li>
            <Link to="/inspector-home/returned-books" >ספרים שהוחזרו</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default InspectorHome;
