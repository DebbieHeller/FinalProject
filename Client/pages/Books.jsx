import React, { useEffect, useState, useContext } from "react";
import "../css/books.css";
import { FaSearch, FaThumbsUp } from "react-icons/fa";
import { userContext } from "../src/App";

function Books() {
    const { user } = useContext(userContext);
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [books, setBooks] = useState([]);
  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [newBook, setNewBook] = useState({
        nameBook: '',
        author: '',
        numOfPages: 0,
        publishingYear: 0,
        summary: '',
        image: null,
        category: '',
    });

  useEffect(() => {
    fetch(`http://localhost:3000/homeBooks?libraryId=${libraryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((books) => {
        setBooks(books);
        setSearchResults(books);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [libraryId]);

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
      .catch((error) => console.error("Error fetching likes:", error));
  }, [libraryId]);

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

  const handleLike = (bookId) => {
    fetch(`http://localhost:3000/likes?bookId=${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        const prevLikes = likes[bookId];
        setLikes({ ...likes, [bookId]: prevLikes + 1 });
      })
      .catch((error) => console.error("Error updating likes:", error));
  };

  const handleSearch = (searchQuery) => {
    fetch(
      `http://localhost:3000/homeBooks?libraryId=${libraryId}&query=${searchQuery}`
    )
      .then((res) => {
        if (!res.ok) {
          alert(searchQuery);
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        alert(data);
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
                setSearchResults([...books, data]);
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
            <h1>Books</h1>
            <form className="search-form">
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search by name, author or category"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <FaSearch className="search-icon" />
                </div>
            </form>
            {user && user.roleId == 1 &&<button className="add-book-button" onClick={() => setShowAddBookModal(true)}>Add Book</button>}
            <div className="books-grid">
                {searchResults.map(book => (
                    <div key={book.id} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                        <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
                        <div className="book-info">
                            <p><strong>{book.nameBook}</strong></p>
                            <p className="book-likes" onClick={(e) => { e.stopPropagation(); handleLike(book.id); }}>
                                <FaThumbsUp className="like-icon" /> {likes[book.id]}
                            </p>
                        </div>
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
                        <span className="close" onClick={() => setShowAddBookModal(false)}>&times;</span>
                        <h2>Add a New Book</h2>
                        <form className="add-book-form">
                            <input
                                type="text"
                                name="nameBook"
                                placeholder="Book Name"
                                value={newBook.nameBook}
                                onChange={handleAddBookChange}
                            />
                            <input
                                type="text"
                                name="author"
                                placeholder="Author"
                                value={newBook.author}
                                onChange={handleAddBookChange}
                            />
                            <input
                                type="number"
                                name="numOfPages"
                                placeholder="Number of Pages"
                                value={newBook.numOfPages}
                                onChange={handleAddBookChange}
                            />
                            <input
                                type="number"
                                name="publishingYear"
                                placeholder="Publishing Year"
                                value={newBook.publishingYear}
                                onChange={handleAddBookChange}
                            />
                            <textarea
                                name="summary"
                                placeholder="Summary"
                                value={newBook.summary}
                                onChange={handleAddBookChange}
                            />
                            <input
                                type="text"
                                name="category"
                                placeholder="Category"
                                value={newBook.category}
                                onChange={handleAddBookChange}
                            />
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <button type="button" onClick={handleAddBookSubmit}>Add Book</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
  return (
    <div className="books-container">
      <h1>Books</h1>
      <form className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search by name, author or category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            className="search-icon"
            onClick={() => handleSearch(searchQuery)}
          >
            <FaSearch />
          </button>
        </div>
      </form>
      <div className="books-grid">
        {searchResults.map((book) => (
          <div
            key={book.id}
            className="book-card"
            onClick={() => {
              setShowComments(false);
              setSelectedBook(book);
            }}
          >
            <img
              src={`http://localhost:3000/images/${book.image}`}
              alt={book.nameBook}
              className="book-image"
            />
            <div className="book-info">
              <p>
                <strong>{book.nameBook}</strong>
              </p>
              <p
                className="book-likes"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike(book.id);
                }}
              >
                <FaThumbsUp className="like-icon" /> {likes[book.id]}
              </p>
            </div>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div className="modal" onClick={() => setSelectedBook(null)}>
          <div
            className={`modal-content ${showComments ? "show-comments" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="close" onClick={() => setSelectedBook(null)}>
              &times;
            </span>
            <img
              src={`http://localhost:3000/images/${selectedBook.image}`}
              alt={selectedBook.nameBook}
            />
            <h2>{selectedBook.nameBook}</h2>
            <p>
              <strong>Author:</strong> {selectedBook.author}
            </p>
            <p>
              <strong>Pages:</strong> {selectedBook.numOfPages}
            </p>
            <p>
              <strong>Published:</strong> {selectedBook.publishingYear}
            </p>
            <p>
              <strong>Summary:</strong> {selectedBook.summary}
            </p>
            <p>
              <strong>Category:</strong> {selectedBook.category}
            </p>
            <p>
              <strong>New:</strong> {selectedBook.isNew ? "Yes" : "No"}
            </p>
            <button
              className="singleBook"
              onClick={(e) => {
                e.stopPropagation();
                handleShowComments(selectedBook.id);
              }}
            >
              {showComments ? "Hide Comments" : "Show Comments"}
            </button>
            {showComments && comments[selectedBook.id] && (
              <div className="comments-section">
                {comments[selectedBook.id].map((comment) => (
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
    </div>
  );
}

export default Books;
