import React, { useEffect, useState, useContext } from "react";
import "../css/books.css";
import { FaSearch } from "react-icons/fa";
import BookCard from "../components/BookCard";
import NewBook from "../components/NewBook";
import { userContext } from "../src/App";

function Books() {
  const { user } = useContext(userContext);
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const limit = 12

  useEffect(() => {
    const booksApi = user && user.roleId == 1 ?
      `http://localhost:3000/homeBooks?limit=${limit}&offset=${offset}` :
      `http://localhost:3000/homeBooks?libraryId=${libraryId}&limit=${limit}&offset=${offset}`;

    fetch(booksApi)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((newBooks) => {
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setIsSearching(false);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [libraryId, offset]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShowComments = (bookId) => {
    setShowComments(!showComments);
    if (!comments[bookId]) {
      fetch(`http://localhost:3000/comments?bookId=${bookId}`)
        .then((res) => res.json())
        .then((comments) => {
          setComments({ ...comments, [bookId]: comments });
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };

  useEffect(() => {
    if (searchQuery == '')
      setIsSearching(false);
  }, [searchQuery]);

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const filteredBooksApi = user && user.roleId == 1 ?
      `http://localhost:3000/homeBooks?query=${searchQuery}&limit=${limit}&offset=0` :
      `http://localhost:3000/homeBooks?libraryId=${libraryId}&query=${searchQuery}&limit=${limit}&offset=0`;

    fetch(filteredBooksApi)
      .then((res) => res.json())
      .then((data) => {
        setFilteredBooks(data);
      })
      .catch((error) => console.error("Error searching books:", error));
  };

  return (
    <div className="books-container">
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
        <div className="search-input-container">
          <input
            type="text"
            placeholder="חיפוש לפי שם ספר, סופר, או קטגוריה"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            type="submit"
            className="search-icon"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {user && (user.roleId == 1 || user.roleId == 2) && <button className="add-book-button" onClick={() => setShowAddBookModal(true)}>הוספת ספר</button>}
      <div className="books-grid">
        {!isSearching ? books.map(book => (
          <div key={book.id} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
            <BookCard book={book} />
          </div>
        )) :
          filteredBooks.map(book => (
            <div key={book.id} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
              <BookCard book={book} />
            </div>
          ))}
      </div>
      {selectedBook && (
        <div className="modal" onClick={() => setSelectedBook(null)}>
          <div className={`modal-content ${showComments ? 'show-comments' : ''}`} onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
            <img src={`http://localhost:3000/images/${selectedBook.image}`} alt={selectedBook.nameBook} />
            <h2>{selectedBook.nameBook}</h2>
            <p><strong>סופר</strong> {selectedBook.author}</p>
            <p><strong>מס דפים</strong> {selectedBook.numOfPages}</p>
            <p><strong>התפרסם</strong> {selectedBook.publishingYear}</p>
            <p><strong>תקציר</strong> {selectedBook.summary}</p>
            <p><strong>קטגוריה</strong> {selectedBook.category}</p>
            {(!user || user.libraryId) && <p><strong>חדש</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>}
            <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleShowComments(selectedBook.id) }}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showComments && comments[selectedBook.id] && (
              <div className="comments-section">
                {comments[selectedBook.id] ? (
                  comments[selectedBook.id].map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <h4>{comment.title}</h4>
                      <p>{comment.body}</p>
                    </div>
                  ))
                ) : (
                  <p>טוען הערות...</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {showAddBookModal && (
        <NewBook setShowAddBookModal={setShowAddBookModal} setBooks={setBooks} />
      )}
    </div>
  );
}

export default Books;
