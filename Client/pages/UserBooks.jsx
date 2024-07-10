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
  const [daysLeftMap, setDaysLeftMap] = useState(new Map());
  
  useEffect(() => {
    fetch(`http://localhost:3000/borrows?userId=${user.id}`, {
      method: 'GET',
      credentials: 'include'
    })
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
  }, [user.id]);

  useEffect(() => {
    fetch(`http://localhost:3000/likes?libraryId=${libraryId}`)
      .then((res) => res.json())
      .then((likes) => {
        const likesObject = likes.reduce((acc, like) => {
          acc[like.bookId] = like.numLikes;
          return acc;
        }, {});
        setLikes(likesObject);
      })
      .catch((error) => console.error('Error fetching likes:', error));
  }, [libraryId]);

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
        const prevLikes = likes[bookId];
        setLikes({ ...likes, [bookId]: prevLikes + 1 });
      })
      .catch((error) => console.error('Error updating likes:', error));
  };

  const confirmReturnBooks = () => {
    setShowConfirmation(false);

    const updatedBooks = [...books];
    const updatedSelectedBooks = [...selectedBooksToReturn];

    selectedBooksToReturn.forEach((borrowBook) => {
      const returnDate = new Date();
      const borrowDate = new Date(borrowBook.borrowDate);
      const dueDate = new Date(borrowDate);
      dueDate.setDate(borrowDate.getDate() + 14);
      const status = returnDate <= dueDate ? "Returned" : "Overdue-Returned";

      const updatedBorrow = {
        id: borrowBook.borrowId,
        returnDate: returnDate.toLocaleDateString('en-CA'),
        status: status
      };

      fetch(`http://localhost:3000/borrows/${borrowBook.borrowId}`, {
        method: "PUT",
        credentials: 'include',
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
            setBooks([...updatedBooks]);
            const selectedIndex = updatedSelectedBooks.findIndex((book) => book.borrowId === borrowBook.borrowId);
            if (selectedIndex > -1) {
              updatedSelectedBooks.splice(selectedIndex, 1);
            }
            setSelectedBooksToReturn([...updatedSelectedBooks]);
          }
          if (response.status === 403) {
            alert("אין לך הרשאה מתאימה, הכנס מחדש");
            navigate('/logout');
          }
        })
        .catch((error) => console.error("Error returning book:", error));
    });
  };
 
  return (
    <div className="user-books-container">
      <h1>ספרים בהשאלה</h1>
      {books.length === 0 && <div className="no-books-message">אין כרגע ספרים בהשאלתך</div>}
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.copyBookId} className="book-card">
            <input
              type="checkbox"
              checked={selectedBooksToReturn.includes(book)}
              onChange={() => toggleBookSelection(book)}
            />
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
              <div className="book-info">
                <p><strong>{book.nameBook}</strong></p>
                <p className="book-likes" onClick={(e) => { e.stopPropagation(); handleLike(book.id); }}>
                  <FaThumbsUp className="like-icon" />
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
