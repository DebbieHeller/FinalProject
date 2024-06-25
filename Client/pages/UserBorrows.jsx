import React, { useEffect, useState, useContext } from "react";
import { FaSearch, FaThumbsUp } from "react-icons/fa";
import { userContext } from "../src/App";

function UserBorrows() {
    const { user } = useContext(userContext);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/prevBorrows?userId=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setBorrowedBooks(data);
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, [user.id]);

    useEffect(() => {
        // Filtering search results based on search query
        if (searchQuery) {
            const results = borrowedBooks.filter(book =>
                book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSearchResults(results);
        } else {
            setSearchResults(borrowedBooks);
        }
    }, [searchQuery, borrowedBooks]);

    const handleShowComments = (bookId) => {
        // Assuming there's an endpoint to fetch comments for a book
        fetch(`http://localhost:3000/comments?bookId=${bookId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments((prevComments) => ({
                    ...prevComments,
                    [bookId]: data,
                }));
                setShowComments(true);
            })
            .catch((error) => console.error("Error fetching comments:", error));
    };

    return (
        <div className="books-container">
            <h1>Books Borrowed by {user.name}</h1>
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
            <div className="books-grid">
                {searchResults.length > 0 ? (
                    searchResults.map(book => (
                        <div key={book.id} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                            <img src={`http://localhost:3000/images/${book.image}`} alt={book.title} className="book-image" />
                            <div className="book-info">
                                <p className="book-likes">
                                    <FaThumbsUp className="like-icon" /> {book.likes}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No books borrowed yet.</p>
                )}
            </div>
            {selectedBook && (
                <div className="modal" onClick={() => setSelectedBook(null)}>
                    <div className={`modal-content ${showComments ? 'show-comments' : ''}`} onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
                        <img src={`http://localhost:3000/images/${selectedBook.image}`} alt={selectedBook.title} />
                        <h2>{selectedBook.title}</h2>
                        <p><strong>Author:</strong> {selectedBook.author}</p>
                        <p><strong>Pages:</strong> {selectedBook.numOfPages}</p>
                        <p><strong>Published:</strong> {selectedBook.publishingYear}</p>
                        <p><strong>Summary:</strong> {selectedBook.summary}</p>
                        <p><strong>Category:</strong> {selectedBook.category}</p>
                        <p><strong>New:</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>
                        <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleShowComments(selectedBook.id); }}>
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
        </div>
    );
}

export default UserBorrows;
