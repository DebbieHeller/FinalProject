import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import '../css/books.css';
import { FaSearch, FaThumbsUp, FaShoppingCart, FaTrash, FaStar } from 'react-icons/fa'; // Added FaStar icon

function NewBorrow() {
    const libraryId = parseInt(localStorage.getItem('libraryId'));
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const { user } = useContext(userContext);

    useEffect(() => {
        fetch(`http://localhost:3000/recommends?libraryId=${libraryId}&userId=${user.id}`)
            .then((res) => res.json())
            .then((books) => {
                setRecommendedBooks(books);
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, [user.id]);

    useEffect(() => {
        fetch(`http://localhost:3000/availableBooks?libraryId=${libraryId}`)
            .then((res) => res.json())
            .then((availableBooks) => {
                if (recommendedBooks.length > 0) {
                    const filteredBooks = availableBooks.filter(
                        availableBook => !recommendedBooks.some(recommendedBook => recommendedBook.id === availableBook.id)
                    );
                    setBooks(filteredBooks);
                } else {
                    setBooks(availableBooks);
                }
                setSearchResults(books);
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, [libraryId, recommendedBooks]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (query === '') {
            setSearchResults(books);
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

    const handleAddToCart = (book) => {
        if (!cart.some(cartItem => cartItem.id === book.id)) {
            setCart([...cart, book]);
        }
        setSelectedBook(null);
    };

    const removeFromCart = (bookId) => {
        setCart(cart.filter(cartItem => cartItem.id !== bookId));
    };

    const handleCartSubmit = () => {
        cart.map(book => {
            const newBorrow = {
                copyBookId: book.copyBookId,
                userId: user.id,
                borrowDate: new Date().toISOString().split('T')[0],
                returnDate: null,
                status: 'Borrowed',
                isReturned: false,
                isIntact: null
            }
            fetch('http://localhost:3000/borrows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBorrow),
            })
                .catch((error) => console.error('Error adding books to cart:', error));
        })
        setRecommendedBooks(recommendedBooks.filter(recommendedBook => !cart.some(cartItem => cartItem.id === recommendedBook.id)));
        setBooks(books.filter(book => !cart.some(cartItem => cartItem.id === book.id)))
        setCart([]);
        alert('Books have been successfully added to the cart');
    };

    return (
        <div className="books-container">
            <div className="cart-container">
                <div className="cart">
                    <FaShoppingCart className="cart-icon" />
                    <h3>Borrow Cart</h3>
                    {cart.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cart.map(book => (
                            <div key={book.id} className="cart-item">
                                <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="cart-image-small" />
                                <div className="cart-item-details">
                                    <p>{book.nameBook}</p>
                                    <FaTrash onClick={() => removeFromCart(book.id)} className="remove-icon" />
                                </div>
                            </div>
                        ))
                    )}
                    {cart.length > 0 && (
                        <button className="cart-submit" onClick={handleCartSubmit}>
                            אישור
                        </button>
                    )}
                </div>
            </div>

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
                
                {recommendedBooks.map(book => (
                    <div key={book.id} className="book-card" onClick={() => { setShowComments(false, setSelectedBook(book)) }}>
                        <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
                        <div className="book-info">
                            <FaStar className="recommended-icon" /> {/* Recommended book icon */}
                            <p className="book-likes">
                                <FaThumbsUp className="like-icon" /> {book.likes}
                            </p>
                        </div>
                    </div>
                ))}

                {searchResults.map(book => (
                    <div key={book.id} className="book-card" onClick={() => { setShowComments(false, setSelectedBook(book)) }}>
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
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
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
                        <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleAddToCart(selectedBook) }}>
                            להשאלה
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NewBorrow;
