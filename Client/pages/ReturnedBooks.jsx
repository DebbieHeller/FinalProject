import React, { useState, useEffect } from "react";
import { FaComment } from 'react-icons/fa'; // Import icon
import "../css/inspectorBorrows.css"; // Import CSS file for styling

function ReturnedBooks() {
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const deadlineForBorrow = new Date();
  deadlineForBorrow.setDate(deadlineForBorrow.getDate() - 14);
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    fetch(`http://localhost:3000/inspectorBorrows?libraryId=${libraryId}&date=${deadlineForBorrow}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrows(data);
      })
      .catch((error) => console.error("Error fetching borrows:", error));
  }, [libraryId, deadlineForBorrow]);

  const handleSendMessage = (borrow) => {
    
    let title = 'איחור בהחזרת הספר';
    let body = 'אתה מחזיק בספר כך וכך ימים מעל המותר,כל יום גורר איתו קנס,החזר בהקדם';
    if (title && body) {
      const createdDate = new Date().toISOString().split("T")[0];
      const messageData = { userId: borrow.userId, title, body, status: 'לא נקראה', createdDate };
      
      fetch('http://localhost:3000/messages', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })
      .then(response => response.json())
      .then(data => {
        setMessage('הודעה נשלחה בהצלחה');
        console.log(data);
      })
      .catch(error => {
        setMessage('נכשל בשליחת הודעה');
        console.error('Error sending message:', error);
      });
    }
  };

  return (
    <div className="borrows-container">
      <h1>השאלות קודמות</h1>
    
      <table className="borrows-table">
        <thead>
          <tr>
            <th>ספר</th>
            <th>תאריך השאלה</th>
            <th>תאריך החזרה תקין</th>
            <th>סטטוס</th>
            <th>שלח הודעה</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow, index) => (
            <tr key={index}>
              <td>{borrow.nameBook}</td>
              <td>{new Date(borrow.borrowDate).toISOString().split('T')[0]}</td>
              <td>{new Date(borrow.returnDate).toISOString().split('T')[0]}</td>
              <td>{borrow.status}</td>
              <td>
                <button onClick={() => handleSendMessage(borrow)}>
                  <FaComment /> שלח הודעה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReturnedBooks;
