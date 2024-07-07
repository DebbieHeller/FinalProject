import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import Cart from "../components/Cart";
import '../css/books.css';
import '../css/newBorrow.css';
import { FaSearch, FaThumbsUp, FaShoppingCart, FaStar } from 'react-icons/fa';

function NewBorrow() {
    const libraryId = parseInt(localStorage.getItem('libraryId'));
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const { user } = useContext(userContext);
    const [likes, setLikes] = useState({});

    useEffect(() => {
        fetch(`http://localhost:3000/recommends?libraryId=${libraryId}&userId=${user.id}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((books) => {
                setRecommendedBooks(books);
            })
            .catch((error) => console.error('Error fetching recommended books:', error));
    }, [libraryId, user.id]);

    useEffect(() => {
        fetch(`http://localhost:3000/homeBooks?libraryId=${libraryId}&userId=${user.id}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => res.json())
            .then((books) => {
                if (recommendedBooks.length > 0) {
                    const filteredBooks = books.filter(
                        book => !recommendedBooks.some(recommendedBook => recommendedBook.id === book.id)
                    );
                    setBooks(filteredBooks);
                } else {
                    setBooks(books);
                }
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, [libraryId, recommendedBooks]);

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

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        if (query === '') {
            setBooks(books);
        } else {
            const filteredBooks = books.filter(book =>
                book.nameBook.toLowerCase().includes(query) ||
                book.author.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query)
            );
            setBooks(filteredBooks);
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

    const handleAddToCart = (book) => {
        if (!cart.some(cartItem => cartItem.id === book.id)) {
            setCart([...cart, book]);
        }
        setSelectedBook(null);
        setIsCartVisible(true);
    };

    return (
        <>
            <div className="cart-icon-container" onClick={() => setIsCartVisible(!isCartVisible)}>
                <FaShoppingCart className="cart-icon" />
            </div>
            {isCartVisible && <Cart setIsCartVisible={setIsCartVisible} cart={cart} setCart={setCart} setBooks={setBooks} setRecommendedBooks={setRecommendedBooks}/>}

            <div className={`books-container ${isCartVisible ? 'cart-visible' : ''}`}>
                

                <form className="search-form">
                    <div className="search-input-container">
                        <input
                            type="text"
                            placeholder="חיפוש לפי שם ספר, סופר, או קטגוריה"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <FaSearch className="search-icon" />
                    </div>
                </form>

                <div className="new-borrow-container">
                    <h3>מומלצים עבורך</h3>
                    <div className="book-section">
                        {recommendedBooks.map(book => (
                            <div key={book.copyBookId} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                                <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
                                <div className="book-info">
                                    <p><strong>{book.nameBook}</strong></p>
                                    <FaStar className="recommended-icon" />
                                    <p className="book-likes" onClick={(e) => { e.stopPropagation(); handleLike(book.id); }}>
                                        <FaThumbsUp className="like-icon" /> {likes[book.id]}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="separator-line" />

                    <div className="book-section">
                        {books.map(book => (
                            <div key={book.copyBookId} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
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
                </div>

                {selectedBook && (
                    <div className="modal" onClick={() => setSelectedBook(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
                            <img src={`http://localhost:3000/images/${selectedBook.image}`} alt={selectedBook.nameBook} />
                            <h2>{selectedBook.nameBook}</h2>
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
                            {selectedBook.isAvailable == true ? <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleAddToCart(selectedBook); }}>
                                להשאלה
                            </button>
                                : <p>הספר אינו זמין להשאלה</p>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );

}

export default NewBorrow;
