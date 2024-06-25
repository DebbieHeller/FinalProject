import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { userContext } from "../src/App";
import "../css/userBooks.css";
import "../css/books.css";
import { FaThumbsUp } from 'react-icons/fa';

function UserBooks() {
  const { user } = useContext(userContext);
  const [books, setBooks] = useState([]);
  const [selectedBooksToReturn, setSelectedBooksToReturn] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/borrows?userId=${user.id}`)
      .then((res) => res.json())
      .then((borrowedBooks) => {
        setBooks(borrowedBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [user.id]);

  const toggleBookSelection = (borrowBook) => {
    if (selectedBooksToReturn.includes(borrowBook)) {
      setSelectedBooksToReturn(selectedBooksToReturn.filter(book => book.borrowId !== borrowBook.borrowId));
    } else {
      setSelectedBooksToReturn([...selectedBooksToReturn, borrowBook]);
    }
  };

  const handleReturnBooks = () => {
    if (selectedBooksToReturn.length === 0) {
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }
    setShowConfirmation(true);
  };

  const confirmReturnBooks = async () => {
    setShowConfirmation(false);
    setIsLoading(true);

    const updatedBooks = [...books];

    for (const borrowBook of selectedBooksToReturn) {
      const returnDate = new Date().toISOString().split('T')[0];
      const borrowDate = new Date(borrowBook.borrowDate).toISOString().split('T')[0];

      const updatedBorrow = {
        id: borrowBook.borrowId,
        copyBookId: borrowBook.copyBookId,
        userId: user.id,
        bookId: borrowBook.id,
        borrowDate: borrowDate,
        returnDate: returnDate,
        status: 'Returned'
      };

      const response = await fetch(`http://localhost:3000/borrows/${borrowBook.borrowId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBorrow),
      });

      if (response.ok) {
        const index = updatedBooks.findIndex(book => book.borrowId === borrowBook.borrowId);
        if (index > -1) {
          updatedBooks.splice(index, 1);
        }
      } else {
        console.error('Error returning book:', response.statusText);
      }
    }

    setBooks(updatedBooks);
    setSelectedBooksToReturn([]);
    setIsLoading(false);
  };

  return (
    <div className="user-books-container">
      <h1>Your Borrowed Books</h1>
      {isLoading && <div className="loading-message">מתבצעת החזרה...</div>}
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <input
              type ="checkbox"
              checked={selectedBooksToReturn.includes(book)}
              onChange={() => toggleBookSelection(book)}
            />
            <Link
              to={`/home/user-books/${book.copyBookId}`}
              className='book-card-link'
              state={{ book }}
            >
              <img
                src={`http://localhost:3000/images/${book.image}`}
                alt={book.nameBook}
                className="book-image"
              />
              <div className="book-info">
                <p className="book-likes">
                  <FaThumbsUp className="like-icon" /> {book.likes}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {books.length !== 0 && (
        <button className="return-books-button" onClick={handleReturnBooks}>Return Books</button>
      )}

      {showErrorMessage && <div className="error-message">לא נבחרו ספרים להחזרה</div>}

      {showConfirmation && (
        <div className="confirmation-popup">
          <div className="confirmation-popup-content">
            <p>האם אתה בטוח שברצונך להחזיר את הספרים הנבחרים?</p>
            <button onClick={confirmReturnBooks}>אישור</button>
            <button onClick={() => setShowConfirmation(false)}>ביטול</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserBooks;


