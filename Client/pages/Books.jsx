import React, { useEffect, useState } from 'react';
import '../css/books.css';
import { FaSearch, FaThumbsUp } from 'react-icons/fa';

function Books() {
    const libraryId = parseInt(localStorage.getItem('libraryId'));
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/books?libraryId=${libraryId}`)
            .then((res) => res.json())
            .then((books) => {
                setBooks(books);
                setSearchResults(books); // Initial display of all books
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, [libraryId]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (query === '') {
            setSearchResults(books); // Display all books when search box is empty
        } else {
            const filteredBooks = books.filter(book =>
                book.nameBook.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
            setSearchResults(filteredBooks);
        }
    }, [searchQuery, books]);

    const handleShowComments = (bookId) => {
        setShowComments(!showComments);
        if (!comments[bookId]) {
            fetch(`http://localhost:3000/comments?bookId=${bookId}`)
                .then((res) => res.json())
                .then((comments) => {
                    setComments({ ...comments, [bookId]: comments });
                })
                .catch((error) => console.error('Error fetching comments:', error));
        }
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
            <div className="books-grid">
                {searchResults.map(book => (
                    <div key={book.id} className="book-card" onClick={() =>{setShowComments(false, setSelectedBook(book))} }>
                        <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
                         <div className="book-info">
                            <p className="book-likes">
                                <FaThumbsUp className="like-icon" /> {book.likes}
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
                        <p><strong>New:</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>
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
        </div>
    );
}

export default Books;
