import { Link } from "react-router-dom";
import "../css/home.css";

function AdminHome() {

  return (
    <div>
      <nav className="home-header-nav">
        <ul>
          <li>
            <Link to="/admin-home/logout">Logout</Link>
          </li>
          <li>
            <Link to="/admin-home/books" >מאגר ספרים</Link>
          </li>
          <li>
            <Link to="/admin-home/libraries">ספריות</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminHome;
