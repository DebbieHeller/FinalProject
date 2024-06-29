import React, { useEffect, useState, useContext } from 'react';
import { userContext } from "../src/App";
import '../css/messages.css';

function Messages() {
  const { user } = useContext(userContext);
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/messages?userId=${user.id}`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error("Error fetching messages:", error));
  }, [user.id]);

  const handleDoubleClick = (message) => {
    setSelectedMessage(message);

    if (message.status === 'לא נקראה') {
      const updatedMessage = {
        status: 'נקראה',
        readDate: new Date().toISOString().split('T')[0]
      };

      fetch(`http://localhost:3000/messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedMessage)
      })
      .then(response => response.json())
      .then(() => {
        setMessages(prevMessages => prevMessages.map(m => 
          m.id === message.id ? {...m, ...updatedMessage} : m
        ));
      })
      .catch(error => console.error("Error updating message:", error));
    }
  };

  return (
    <div className="messages-container">
      <h1>הודעות</h1>
      <table className="messages-table">
        <thead>
          <tr>
            <th>כותרת</th>
            <th>תוכן</th>
            <th>תאריך יצירה</th>
            <th>סטטוס</th>
          </tr>
        </thead>
        <tbody>
          {messages.length > 0 ? (
            messages.map((message) => (
              <tr
                key={message.id}
                className={message.status === 'לא נקראה' ? 'unread' : ''}
                onDoubleClick={() => handleDoubleClick(message)}
              >
                <td>{message.title}</td>
                <td>{message.body}</td>
                <td>{new Date(message.createdDate).toLocaleDateString()}</td>
                <td>{message.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">אין הודעות</td>
            </tr>
          )}
        </tbody>
      </table>

      {selectedMessage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setSelectedMessage(null)}>&times;</span>
            <h2>{selectedMessage.title}</h2>
            <p>{selectedMessage.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
