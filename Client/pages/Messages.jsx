import React, { useEffect, useState, useContext } from 'react';
import { userContext } from "../src/App";
import '../css/messages.css';

function Messages() {
    const { user } = useContext(userContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    
    fetch(`http://localhost:3000//messages?userId=${user.id}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error("Error fetching messages:", error));
  }, []);

  return (
    <div className="messages-container">
      <h1>הודעות</h1>
      <table className="messages-table">
        <thead>
          <tr>
            <th>כותרת</th>
            <th>תוכן</th>
            <th>סטטוס</th>
            <th>תאריך קריאה</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((message) => (
              <tr key={message.id} className={message.status === 'didnt read yet' ? 'unread' : ''}>
                <td>{message.title}</td>
                <td>{message.body}</td>
                <td>{message.status}</td>
                <td>{message.readDate ? new Date(message.readDate).toLocaleDateString() : 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">אין הודעות</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Messages;
