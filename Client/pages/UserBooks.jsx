import React, { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { userContext } from "../src/App";
import "../css/userBooks.css";
import "../css/books.css";
import { FaThumbsUp } from 'react-icons/fa'; // Import necessary icons

function UserBooks() {
  const { user } = useContext(userContext);
  const [books, setBooks] = useState([]);
  const [selectedBooksToReturn, setSelectedBooksToReturn] = useState([]); 
  const [showErrorMessage, setShowErrorMessage] = useState(false);

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
    }
    
    // selectedBooksToReturn.forEach((borrowBook) => {

    //   const updatedBorrow = {
    //     id: borrowBook.borrowId,
    //     copyBookId: borrowBook.copyBookId,
    //     userId: user.id,
    //     bookId: ,
    //     borrowDate: borrowBook.borrowDate,
    //     returnDate: createRoutesFromElements,
    //   };

    //   fetch(`http://localhost:3000/borrows/${borrowId}`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(),
    //   })
    //     .then(response => {
    //       if (response.ok) {
    //         // כאן תוכל לבצע פעולות נוספות אם נדרש
    //       } else {
    //         console.error('Error returning book:', response.statusText);
    //       }
    //     })
    //     .catch(error => {
    //       console.error('Error returning book:', error.message);
    //     });
    // });

    // לאחר טיפול בכל הבקשות
    setSelectedBooksToReturn([]);
  };

  return (
    <div className="user-books-container">
      <h1>Your Borrowed Books</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card">
            <input
              type="checkbox"
              checked={selectedBooksToReturn.includes(book)}
              onChange={() => toggleBookSelection(book)}
            />
            <Link
              to={`/home/user-books/${book.id}`}
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
    </div>
  );
}

export default UserBooks;
