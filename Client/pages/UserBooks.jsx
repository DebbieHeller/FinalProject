import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userContext } from "../src/App";
import "../css/userBooks.css";
import "../css/books.css";
import { FaThumbsUp } from "react-icons/fa";

function UserBooks() {
  const libraryId = parseInt(localStorage.getItem('libraryId'));
  const { user } = useContext(userContext);
  const [books, setBooks] = useState([]);
  const [likes, setLikes] = useState({});
  const [selectedBooksToReturn, setSelectedBooksToReturn] = useState([]);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [daysLeftMap, setDaysLeftMap] = useState(new Map());

  useEffect(() => {
    fetch(`http://localhost:3000/borrows?userId=${user.id}`)
      .then((res) => res.json())
      .then((borrowedBooks) => {
        setBooks(borrowedBooks);

        // Calculate days left and populate daysLeftMap
        const today = new Date();

        const newDaysLeftMap = new Map();
        borrowedBooks.forEach((book) => {
          const borrowDate = new Date(book.borrowDate);
          const returnDate = new Date(borrowDate);
          returnDate.setDate(borrowDate.getDate() + 14);
          const diffTime = returnDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          newDaysLeftMap.set(book.id, diffDays);
        });
        setDaysLeftMap(newDaysLeftMap);
      })
      .catch((error) => console.error("Error fetching books:", error));

      fetch(`http://localhost:3000/likes?libraryId=${libraryId}`)
    .then((res) => res.json())
    .then((likes) => {
        const likesObject = likes.reduce((acc, like) => {
            acc[like.bookId] = like.numLikes;
            return acc;
        }, {});
        setLikes(likesObject);
        console.log(likesObject)
    })
    .catch((error) => console.error('Error fetching likes:', error));

  }, [user.id]);

  const toggleBookSelection = (borrowBook) => {
    if (selectedBooksToReturn.includes(borrowBook)) {
      setSelectedBooksToReturn(
        selectedBooksToReturn.filter(
          (book) => book.borrowId !== borrowBook.borrowId
        )
      );
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

  const handleLike = (bookId) => {
    fetch(`http://localhost:3000/likes?bookId=${bookId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then(() => {
            const prevLikes = likes[bookId]
            setLikes({ ...likes, [bookId]: prevLikes + 1 });
        })
        .catch((error) => console.error('Error updating likes:', error));
};

const confirmReturnBooks = () => {
  setShowConfirmation(false);
  setIsLoading(true);

  const updatedBooks = [...books];

  selectedBooksToReturn.forEach((borrowBook) => {
      const returnDate = new Date().toISOString().split("T")[0];
      const borrowDate = new Date(borrowBook.borrowDate)
          .toISOString()
          .split("T")[0];

      const updatedBorrow = {
          id: borrowBook.borrowId,
          copyBookId: borrowBook.copyBookId,
          userId: user.id,
          bookId: borrowBook.id,
          borrowDate: borrowDate,
          returnDate: returnDate,
          status: "Returned",
      };

      fetch(`http://localhost:3000/borrows/${borrowBook.borrowId}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBorrow),
      })
      .then((response) => {
          if (response.ok) {
              const index = updatedBooks.findIndex((book) => book.borrowId === borrowBook.borrowId);
              if (index > -1) {
                  updatedBooks.splice(index, 1);
              }
          } else {
              console.error("Error returning book:", response.statusText);
          }
      })
      .catch((error) => console.error("Error returning book:", error));
  });

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
              type="checkbox"
              checked={selectedBooksToReturn.includes(book)}
              onChange={() => toggleBookSelection(book)}
            />
            <div className="book-info">
              <button
                className="like-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(book.id);
                }}
              >
                <FaThumbsUp className="like-icon" />
              </button>
              <p className="book-likes">
                {likes[book.id]}
              </p>
              {daysLeftMap.get(book.id) < 0 ? (
                <p className="overdue-message">
                  באיחור של {Math.abs(daysLeftMap.get(book.id))} ימים
                </p>
              ) : (
                <p className="days-left-message">
                  נשארו {daysLeftMap.get(book.id)} ימים להחזיר
                </p>
              )}
            </div>
            <Link
              to={`/home/user-books/${book.copyBookId}`}
              className="book-card-link"
              state={{ book }}
            >
              <img
                src={`http://localhost:3000/images/${book.image}`}
                alt={book.nameBook}
                className="book-image"
              />
            </Link>
          </div>
        ))}
      </div>

      {books.length !== 0 && (
        <button className="return-books-button" onClick={handleReturnBooks}>
          Return Books
        </button>
      )}

      {showErrorMessage && (
        <div className="error-message">לא נבחרו ספרים להחזרה</div>
      )}

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
