import { Link } from "react-router-dom";
import "../css/home.css";

function Home() {
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
          <Link to="/home/user-books">ספרים בהשאלה</Link>
        </li>
        <li>
          <Link to="/home/new-borrow">השאלה חדשה</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Home;
