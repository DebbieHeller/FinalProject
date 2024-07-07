import React, { useEffect, useState, useContext } from "react";
import "../css/books.css";
import { FaSearch } from "react-icons/fa";
import BookCard from "../components/BookCard";
import { userContext } from "../src/App";

function Books() {
  const { user } = useContext(userContext);
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBook, setNewBook] = useState({
    nameBook: '',
    author: '',
    numOfPages: '',
    publishingYear: '',
    summary: '',
    image: null,
    category: '',
  });

  useEffect(() => {
    if (searchQuery === '') {
      const booksApi = user && user.roleId == 1 ? `http://localhost:3000/homeBooks`//?זה בעיה שלא נבדק הקוקיז בפטש הזה?
        : `http://localhost:3000/homeBooks?libraryId=${libraryId}`
      fetch(booksApi)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((books) => {
          setBooks(books);
        })
        .catch((error) => console.error("Error fetching books:", error));
    }
  }, [libraryId, searchQuery]);


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

  const handleSearch = (searchQuery) => {
    const filteredBooksApi = user && user.roleId == 1 ? `http://localhost:3000/homeBooks?query=${searchQuery}`
      : `http://localhost:3000/homeBooks?libraryId=${libraryId}&query=${searchQuery}`
    fetch(filteredBooksApi)
      .then((res) => {
        if (!res.ok) {
          alert(searchQuery);
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Error searching books:", error));
  };

  const handleAddBookChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBook(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddBookSubmit = () => {
    const formData = new FormData();
    for (const key in newBook) {
      formData.append(key, newBook[key]);
    }
    fetch('http://localhost:3000/books', {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then((res) => res.json())
      .then((data) => {
        setBooks([...books, data]);
        setShowAddBookModal(false);
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  const handleImageChange = (e) => {
    setNewBook(prevState => ({
      ...prevState,
      image: e.target.files[0]
    }));
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

      {user && user.roleId == 1 && <button className="add-book-button" onClick={() => setShowAddBookModal(true)}>הוספת ספר</button>}
      <div className="books-grid">
        {books.map(book => (
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
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Pages:</strong> {selectedBook.numOfPages}</p>
            <p><strong>Published:</strong> {selectedBook.publishingYear}</p>
            <p><strong>Summary:</strong> {selectedBook.summary}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            {(!user || user.libraryId) && <p><strong>New:</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>}
            <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleShowComments(selectedBook.id) }}>
              {showComments ? 'Hide Comments' : 'Show Comments'}
            </button>
            {showComments && comments[selectedBook.id] && (
              <div className="comments-section">
                {comments[selectedBook.id].map(comment => (
                  <div key={comment.id} className="comment-card">
                    <h4>{comment.title}</h4>
                    <p>{comment.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showAddBookModal && (
        <div className="modal">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-right" onClick={() => setShowAddBookModal(false)}>&times;</span>
            <h2>הוספת ספר חדש</h2>
            <form className="add-book-form" onSubmit={(e) => { e.preventDefault(); handleAddBookSubmit(); }}>
              <input
                type="text"
                name="nameBook"
                placeholder="שם ספר"
                value={newBook.nameBook}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="text"
                name="author"
                placeholder="שם סופר"
                value={newBook.author}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="number"
                name="numOfPages"
                placeholder="מספר עמודים"
                value={newBook.numOfPages}
                onChange={handleAddBookChange}
                required
              />
              <input
                type="number"
                name="publishingYear"
                placeholder="שנת הוצאה לאור"
                value={newBook.publishingYear}
                onChange={handleAddBookChange}
                required
              />
              <textarea
                name="summary"
                placeholder="תקציר"
                value={newBook.summary}
                onChange={handleAddBookChange}
                required
              />
              <select
                name="category"
                value={newBook.category}
                onChange={handleAddBookChange}
                required
              >
                <option value="">בחר קטגוריה</option>
                <option value="fiction">סיפורת</option>
                <option value="non-fiction">עיון</option>
                <option value="fantasy">פנטזיה</option>
                <option value="mystery">מסתורין</option>
                <option value="biography">ביוגרפיה</option>
                <option value="science-fiction">מדע בדיוני</option>
                <option value="history">היסטוריה</option>
                <option value="romance">רומן</option>
                <option value="self-help">עזרה עצמית</option>
                <option value="other">אחר</option>
              </select>
              <label>תמונה</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
              <button type="submit">אישור</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Books;
