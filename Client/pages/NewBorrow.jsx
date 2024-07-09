import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import Cart from "../components/Cart";
import BookCard from "../components/BookCard";
import "../css/books.css";
import "../css/newBorrow.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";

function NewBorrow() {
    const libraryId = parseInt(localStorage.getItem("libraryId"));
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);
    const { user } = useContext(userContext);
    const [offset, setOffset] = useState(0);
    const limit = 12;

    useEffect(() => {
        console.log(user)
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
        fetch(
            `http://localhost:3000/homeBooks?libraryId=${libraryId}&userId=${user.id}&limit=${limit}&offset=${offset}`,
            {
                method: "GET",
                credentials: "include",
            }
        )
            .then((res) => res.json())
            .then((fetchedBooks) => {
                if (recommendedBooks.length > 0 && offset == 0) {
                    const filteredBooks = fetchedBooks.filter(
                        book => !recommendedBooks.some(recommendedBook => recommendedBook.id === book.id)
                    );
                    setBooks(filteredBooks);
                } else {
                    // Append new books to existing list if offset is greater than 0 (infinite scroll)
                    setBooks((prevBooks) => [...prevBooks, ...fetchedBooks]);
                }
                setIsSearching(false);
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, [libraryId, user.id, recommendedBooks, offset]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight
            ) {
                setOffset((prevOffset) => prevOffset + limit);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [offset]);

    useEffect(() => {
        if (searchQuery === '')
            setIsSearching(false);
    }, [searchQuery]);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setIsSearching(false);
            return;
        }
        setIsSearching(true);
        fetch(`http://localhost:3000/homeBooks?libraryId=${libraryId}&query=${query}&userId=${user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setFilteredBooks(data);
            })
            .catch((error) => console.error("Error searching books:", error));
    };

    const handleShowComments = (bookId) => {
        setShowComments(!showComments);
        if (!comments[bookId]) {
            fetch(`http://localhost:3000/comments?bookId=${bookId}`)
                .then((res) => res.json())
                .then((fetchedComments) => {
                    setComments({ ...comments, [bookId]: fetchedComments });
                })
                .catch((error) => console.error("Error fetching comments:", error));
        }
    };

    const handleAddToCart = (book) => {
        if (!cart.some((cartItem) => cartItem.id === book.id)) {
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
            {isCartVisible && <Cart setIsCartVisible={setIsCartVisible} cart={cart} setCart={setCart} setBooks={setBooks} setRecommendedBooks={setRecommendedBooks} />}
            <div className={`books-container ${isCartVisible ? 'cart-visible' : ''}`}>
                <form className="search-form" onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery) }}>
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

                <div className="new-borrow-container">
                    {!isSearching && (
                        <>
                            <h3>מומלצים עבורך</h3>
                            <div className="book-section">
                                {recommendedBooks.map(book => (
                                    <div key={book.copyBookId} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                                        <BookCard book={book} />
                                    </div>
                                ))}
                            </div>

                            <hr className="separator-line" />
                        </>
                    )}
                    <div className="book-section">
                        {!isSearching ? books.map(book => (
                            <div key={book.copyBookId} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                                <BookCard book={book} />
                            </div>
                        )) :
                            filteredBooks.map(book => (
                                <div key={book.copyBookId} className="book-card" onClick={() => { setShowComments(false); setSelectedBook(book); }}>
                                    <BookCard book={book} />
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
                            <p><strong>Available copies:</strong> {selectedBook.availableCopies}</p>
                            {selectedBook.availableCopies > 0 ? <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleAddToCart(selectedBook); }}>
                                להשאלה
                            </button>
                                : <p>הספר אינו זמין להשאלה</p>}
                            <button className='singleBook' onClick={(e) => { e.stopPropagation(); handleShowComments(selectedBook.id); }}>
                                {showComments ? "הסתרת הערות" : "הצגת הערות"}
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
        </>
    );
}

export default NewBorrow;
