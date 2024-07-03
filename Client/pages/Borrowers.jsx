import { useEffect, useState } from "react";
import "../css/home.css";
import "../css/borrowers.css";
import { useNavigate } from 'react-router-dom';

function Borrowers() {
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/libraryAdmin?libraryId=${libraryId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        
        setBorrowRecords(data);
        
      })
      .catch((error) =>
        console.error("Error fetching borrow records:", error)
      );
  }, [libraryId]);

  const handleRowDoubleClick = (index, borrow) => {
    setSelectedRow(index);
    navigate(`${borrow.borrowId}`, { state: { borrow } });
  };

  const handleSendMessage = (borrow) => {
    let title = '';
    let body = '';
    if (!borrow.isIntact && borrow.isReturned) {
      title = "ספר לא תקין";
      body = "החזרת ספר לא תקין תחוייב בקנס";
    } else if (!borrow.isReturned) {
      title = "ספר לא הוחזר";
      body = "הינך נדרש להחזיר את הספר שנשאל";
    }

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
        setMessage('Message sent successfully');
        console.log(data);
      })
      .catch(error => {
        setMessage('Failed to send message');
        console.error('Error sending message:', error);
      });
    }
  };

  return (
    <>
      <h1>Borrowers</h1>
      {message && <p>{message}</p>}
      <table className="borrow-table">
        <thead>
          <tr>
            <th>שם ספר</th>
            <th>תאריך השאלה Date</th>
            <th>תאריך החזרה Date</th>
            <th>סטטוס</th>
            <th>החזר</th>
            <th>תקין</th>
            <th>שלח הודעה</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((borrow, index) => (
            <tr
              key={borrow.borrowId}
              className={selectedRow === index ? "selected-row" : ""}
              onDoubleClick={() => handleRowDoubleClick(index, borrow)}
            >
              <td>{borrow.nameBook}</td>
              <td>{borrow.borrowDate}</td>
              <td>{borrow.returnDate}</td>
              <td>{borrow.status}</td>
              <td>{borrow.isReturned ? "Yes" : "No"}</td>
              <td>{borrow.isIntact ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleSendMessage(borrow)}>Send Message</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Borrowers;
