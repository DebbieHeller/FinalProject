import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import Book from "./Book";
import "../css/userBooks.css";
import "../css/books.css";
import { FaThumbsUp } from 'react-icons/fa'; // Import necessary icons

function UserBooks() {
  const { user } = useContext(userContext);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Initialize selectedBook as null
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/borrows?userId=${user.id}`)
      .then((res) => res.json())
      .then((borrowedBooks) => {
        setBooks(borrowedBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [user.id]);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleReturnBooks = () => {
    // Implement return books logic
  };

  return (
    <div className="user-books-container">
      <h1>Your Borrowed Books</h1>    
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <img
              src={`http://localhost:3000/images/${book.image}`}
              alt={book.nameBook}
              className="book-image"
              onClick={() => handleSelectBook(book)} // Update selected book on click
            />
            <div className="book-info">
              <p className="book-likes">
                <FaThumbsUp className="like-icon" /> {book.likes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && <Book book={selectedBook} user={user} />}

      {books.length !== 0 && <button className="return-books-button" onClick={handleReturnBooks}>Return Books</button>}
      {showErrorMessage && <div className="error-message">לא בחרת ספרים להחזרה</div>}
    </div>
  );
}

export default UserBooks;
