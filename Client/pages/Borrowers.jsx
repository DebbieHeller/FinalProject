import { useEffect, useState } from "react";
import "../css/home.css";
import "../css/borrowers.css";
import { useNavigate } from 'react-router-dom';

function Borrowers() {
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState({});
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
      body = `החזרת ספר ${borrow.nameBook} לא תקין תחוייב בקנס`;
    } else if (!borrow.isReturned) {
      title = "ספר לא הוחזר";
      body = `${borrow.nameBook} :הינך נדרש להחזיר את הספר שנשאל`;
    }

    if (title && body) {
      const createdDate = new Date().toLocaleDateString('en-CA');
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
        setSentMessages(prev => ({ ...prev, [borrow.copyBookId]: true }));

        fetch(`http://localhost:3000/inspectorBorrows/${borrow.copyBookId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: 'Overdue' }),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update borrow status');
          }
          return response.json();
        })
        .then(updatedData => {
          console.log('Borrow status updated successfully:', updatedData);
        })
        .catch(error => {
          console.error('Error updating borrow status:', error);
        });
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
            <td>שם משאיל</td>
            <th>שם ספר</th>
            <th>תאריך השאלה</th>
            <th>תאריך החזרה</th>
            <th>החזר</th>
            <th>תקין</th>
            <th>שליחת הודעה</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((borrow, index) => (
            <tr
              key={borrow.borrowId}
              className={selectedRow === index ? "selected-row" : ""}
              onDoubleClick={() => handleRowDoubleClick(index, borrow)}
            >
              <td>{borrow.userName}</td>
              <td>{borrow.nameBook}</td>
              <td>{new Date(borrow.borrowDate).toLocaleDateString('en-CA')}</td>
              <td>{new Date(borrow.returnDate).toLocaleDateString('en-CA')}</td>
              <td>{borrow.isReturned ? "Yes" : "No"}</td>
              <td>{borrow.isIntact ? "Yes" : "No"}</td>
              <td>
                {sentMessages[borrow.copyBookId] ? (
                  <span>הודעה נשלחה</span>
                ) : (
                  <button onClick={() => handleSendMessage(borrow)}>שלח הודעה</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Borrowers;
