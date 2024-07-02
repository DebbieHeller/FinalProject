import { Link } from "react-router-dom";
import "../css/home.css";

function LibraryAdminHome() {

  return (
    <div>
      <nav className="home-header-nav">
        <ul>
          <li>
            <Link to="/library-admin-home/logout">Logout</Link>
          </li>
          <li>
            <Link to="/library-admin-home/inspectors">פקחים</Link>
          </li>
          <li>
            <Link to="/library-admin-home/borrowers">משאילים</Link>
          </li>
          <li>
            <Link to="/library-admin-home/books" >ספרים</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default LibraryAdminHome;
