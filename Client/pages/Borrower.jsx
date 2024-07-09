import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/borrower.css"; // Import your CSS file

function Borrower() {
  const location = useLocation();
  const { borrow } = location.state;
  const [books, setBooks] = useState([]);
  const [message, setMessage] = useState({
    userId: borrow.userId,
    title: "",
    body: "",
    status: "לא נקראה",
    createdDate: new Date().toLocaleDateString('en-CA'),
    readDate: null,
  });
  const [showModal, setShowModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [email, setEmail] = useState(borrow.email)
  const [emailMessage, setEmailMessage] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3000/libraryAdmin?userId=${borrow.userId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((books) => {
        setBooks(books); // Set state with fetched books data
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [borrow.userId]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openEmailModal = () => {
    setShowEmailModal(true);
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault(); // Prevent default form submission

    const fullMessage = {
      ...message,
      status: "לא נקראה", // Or set status as needed
      createdDate: new Date().toLocaleDateString('en-CA'),
      readDate: null,
    };

    fetch("http://localhost:3000/messages", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fullMessage),
    })
      .then((res) => res.json())
      .then((response) => {
        closeModal(); 
      })
      .catch((error) => console.error("Error sending message:", error));
  };

  const blockUser = (userId) => {
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blocked: true }),
    })
      .then((res) => res.json())
      .then((response) => {
      })
      .catch((error) => console.error("Error blocking user:", error));
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    openEmailModal(); // Open the email modal
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const fullEmail = {
        email,
        message: emailMessage, // Include email message in the request
      };

      const response = await fetch('http://localhost:3000/sendEmail', {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fullEmail),
      });

      if (response.ok) {
        
        closeEmailModal(); 
      } else {
        throw new Error('נכשל בהרשמה לניוזלייטר');
      }
    } catch (error) {
      console.error('שגיאה בהרשמה לניוזלייטר:', error);
      alert('נכשל בהרשמה לניוזלייטר');
    }
  };

  return (
    <div>
      <h1>Borrower Details for: {borrow.userName}</h1>
      <table className="borrow-details">
        <thead>
          <tr>
            <th>תאריך השאלה</th>
            <th>תאריך החזרה</th>
            <th>סטטוס</th>
            <th>הוחזר</th>
            <th>תקין</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.borrowId}>
              <td className='td-detailed'>{new Date(book.borrowDate).toLocaleDateString('en-CA')}</td>
              <td className='td-detailed'>{new Date(book.returnDate).toLocaleDateString('en-CA')}</td>
              <td className='td-detailed'>{book.status}</td>
              <td className='td-detailed'>{book.isReturned ? "Yes" : "No"}</td>
              <td className='td-detailed'>{book.isIntact ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={openModal}>Send Message</button>
      <button onClick={handleSendEmail}>Send Email</button>
      <button onClick={() => blockUser(borrow.userId)}>Block User</button>

      {/* Message Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <h2 className="modal-header">Send Message</h2>
            <form onSubmit={handleSubmitMessage}>
              <label className="modal-label" htmlFor="message-title">Title:</label>
              <input
                className="modal-input"
                type="text"
                id="message-title"
                value={message.title}
                onChange={(e) =>
                  setMessage({ ...message, title: e.target.value })
                }
              />
              <label className="modal-label" htmlFor="message-body">Body:</label>
              <textarea
                className="modal-textarea"
                id="message-body"
                value={message.body}
                onChange={(e) =>
                  setMessage({ ...message, body: e.target.value })
                }
              ></textarea>
              <div className="modal-actions">
                <button className="submit-button" type="submit">אישור</button>
                <button className="cancel-button" type="button" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-backdrop">
          <div className="modal-container">
            <h2 className="modal-header">Send Email</h2>
            <form onSubmit={handleSubmitEmail}>
              <label className="modal-label" htmlFor="email">Email:</label>
              <input
                className="modal-input"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="modal-label" htmlFor="email-message">Message:</label>
              <textarea
                className="modal-textarea"
                id="email-message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                required
              ></textarea>
              <div className="modal-actions">
                <button className="submit-button" type="submit">Send Email</button>
                <button className="cancel-button" type="button" onClick={closeEmailModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Borrower;
