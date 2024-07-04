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
    createdDate: new Date().toISOString().split("T")[0],
    readDate: null,
  });
  const [showModal, setShowModal] = useState(false); // State for modal visibility

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

  const handleSubmitMessage = (e) => {
    e.preventDefault(); // Prevent default form submission

    const fullMessage = {
      ...message,
      status: "לא נקראה", // Or set status as needed
      createdDate: new Date().toISOString().split("T")[0],
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
        console.log("Message sent:", response);
        setShowModal(false); // Close the modal after sending
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
        console.log("User blocked:", response);
        // Optionally handle UI update or feedback
      })
      .catch((error) => console.error("Error blocking user:", error));
  };

  const handleSendEmail = () => {
    // Placeholder function for sending email logic
    console.log("Sending email to:");
    // Add your email sending logic here
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
              <td>{book.borrowDate}</td>
              <td>{book.returnDate}</td>
              <td>{book.status}</td>
              <td>{book.isReturned ? "Yes" : "No"}</td>
              <td>{book.isIntact ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={openModal}>Send Message</button>
      <button onClick={handleSendEmail}>Send Email</button>
      <button onClick={() => blockUser(borrow.userId)}>Block User</button>

      {/* Modal for sending message */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Send Message</h2>
            <form onSubmit={handleSubmitMessage}>
              <label htmlFor="message-title">Title:</label>
              <input
                type="text"
                id="message-title"
                value={message.title}
                onChange={(e) =>
                  setMessage({ ...message, title: e.target.value })
                }
              />
              <label htmlFor="message-body">Body:</label>
              <textarea
                id="message-body"
                value={message.body}
                onChange={(e) =>
                  setMessage({ ...message, body: e.target.value })
                }
              ></textarea>
              <div className="modal-buttons">
                <button type="submit">אישור</button>
                <button type="button" onClick={closeModal}>
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
