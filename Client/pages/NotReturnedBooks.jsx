import React, { useState, useEffect } from "react";
import "../css/inspectorBorrows.css"; // Import CSS file for styling

function NotReturnedBooks() {
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [borrows, setBorrows] = useState([]);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState({});

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const deadlineForBorrow = new Date();
        deadlineForBorrow.setDate(deadlineForBorrow.getDate() + 14); // Adding 14 days

        const response = await fetch(`http://localhost:3000/inspectorBorrows?libraryId=${libraryId}&date=${deadlineForBorrow.toISOString()}`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch borrows');
        }

        const data = await response.json();
        setBorrows(data);
      } catch (error) {
        console.error("Error fetching borrows:", error);
      }
    };

    fetchBorrows();
  }, [libraryId]);

  const calculateDaysDelayed = (borrow) => {
    const borrowDate = new Date(borrow.borrowDate);
    borrowDate.setDate(borrowDate.getDate() + 14);
    const today = new Date();
    const weeksLate = Math.floor((today - borrowDate) / (7 * 24 * 60 * 60 * 1000));
    const daysLate = weeksLate * 7;
    return daysLate;
  };

  const handleSendMessage = (borrow) => {
    const daysDelayed = calculateDaysDelayed(borrow);
    const title = 'איחור בהחזרת הספר';
    const body = `אתה מחזיק בספר: "${borrow.nameBook}" כבר ${daysDelayed} ימים מעל המותר. כל יום גורר איתו קנס, החזר בהקדם.`;

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
          setMessage('הודעה נשלחה בהצלחה');
          setSentMessages(prev => ({ ...prev, [borrow.copyBookId]: true }
          ));

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
              console.log('Borrow status updated successfully');
            })
            .catch(error => {
              console.error('Error updating borrow status:', error);
            });
        })
        .catch(error => {
          setMessage('נכשל בשליחת הודעה');
          console.error('Error sending message:', error);
        });
    }
  };

  return (
    <div className="borrows-container">
      <h1>ספרים שלא הוחזרו</h1>
      <table className="borrows-table">
        <thead>
          <tr>
            <th>ספר</th>
            <th>תאריך השאלה</th>
            <th>תאריך החזרה תקין</th>
            <th>סטטוס</th>
            <th>שליחת הודעה</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow, index) => (
            <tr key={index}>
              <td className='td-detailed'>{borrow.nameBook}</td>
              <td className='td-detailed'>{new Date(borrow.borrowDate).toLocaleDateString('en-CA')}</td>
              <td className='td-detailed'>{new Date(borrow.borrowDate).toLocaleDateString('en-CA')}</td>
              <td className='td-detailed'>{borrow.status}</td>
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default NotReturnedBooks;
