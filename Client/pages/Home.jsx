import { Link } from "react-router-dom";
import "../css/home.css";
import React, { useContext, useEffect, useState } from 'react';
import { FaEnvelope } from 'react-icons/fa';
import { userContext } from '../src/App';

function Home() {
  const { user } = useContext(userContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showBlockedMessage, setShowBlockedMessage] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3000/messages?count=1`, {
        method: 'GET',
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(response => response.json())
        .then(data => {
          setUnreadCount(data.unreadCount);
          console.log(unreadCount)
        })
        .catch(error => console.error('Error fetching unread messages count:', error));
    }
  }, [user]);

  const handleNewBorrowClick = () => {
    if (user.isWarned) {
      setShowBlockedMessage(true);
    } else {
      // Navigate to "/home/new-borrow" if user is not warned
      // Example: window.location.href = "/home/new-borrow";
    }
  };

  const handleCloseMessage = () => {
    setShowBlockedMessage(false);
  };
  

  return (
    <div className="home-container">
      <nav className="home-header-nav">
        <ul>
          <li>
            <Link to="/home/logout">Logout</Link>
          </li>
          <li>
            <Link to="/home/messages">
            הודעות 
            {unreadCount > 0 && (
              <span className="unread-count">
                <FaEnvelope className="envelope-icon" /> {unreadCount}
              </span>
            )}
          </Link>
          </li>
          <li>
            <Link to="/home/user-borrows">השאלות קודמות</Link>
          </li>
          <li>
            <Link to="/home/user-books">ספרים בהשאלה</Link>
          </li>
          <li>
            {user.isWarned ? (
              <span className="disabled-link" onClick={handleNewBorrowClick}>השאלה חדשה</span>
            ) : (
              <Link to="/home/new-borrow">השאלה חדשה</Link>
            )}
          </li>
        </ul>
      </nav>
      {showBlockedMessage && (
        <div className="blocked-message-container">
          <div className="blocked-message-content">
            <span className="close-btn" onClick={handleCloseMessage}>x</span>
            <p>המשתמש חסום מלבצע פעולה זו.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
