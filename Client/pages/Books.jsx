import React, { useEffect, useState } from 'react';
import '../css/books.css';

function Books() {
    const [books, setBooks] = useState([]);
    const [comments, setComments] = useState({});
    const [showComments, setShowComments] = useState({});
    const [selectedBook, setSelectedBook] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/books?libraryId=1`)
          .then((res) => res.json())
          .then((books) => {
            setBooks(books);
          })
          .catch((error) => console.error('Error fetching books:', error));
    }, []);

    const handleShowComments = (e, bookId) => {
        e.preventDefault();
        if (showComments[bookId]) {
            setShowComments({ ...showComments, [bookId]: false });
        } else {
            fetch(`http://localhost:3000/comments?bookId=${bookId}`)
                .then((res) => res.json())
                .then((comments) => {
                    setComments({ ...comments, [bookId]: comments });
                    setShowComments({ ...showComments, [bookId]: true });
                })
                .catch((error) => console.error('Error fetching comments:', error));
        }
    };

    const handleUpdateTodo = () => {
        fetch(`http://localhost:3000/todos/${params.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...todo,  
                ...formData, 
            }),
        })
            .then(response => {
                if (response.ok) {
                    navigate(`/home/users/${user.id}/todos`);
                } else {
                    console.error('Error updating todo:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error updating todo:', error.message);
            });
    };

    const handleLike = (e, bookId) => {
        e.preventDefault();
        fetch(`http://localhost:3000/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...books[0],  //////אתכל הקטע של בחירת ספר בודד, הוספת לייקים שזה עדכון וצפייה בתגובות נעשה בPAGE חדש של Book.jsx 
                likes: books[0].likes + 1
            }),
        })
            .then((res) => { res.json() })
            .then((updatedBook) => {
                setBooks(books.map(book => book.id === bookId ? updatedBook : book));
            })
            .catch((error) => console.error('Error updating like:', error));
    };

    return (
        <div className="books-container">
            <h1>Books</h1>
            <div className="books-grid">
                {books.map(book => (
                    <div key={book.id} className="book-card" onClick={() => setSelectedBook(book)}>
                        <img src={`data:image/jpeg;base64,${book.image}`} alt={book.nameBook} className="book-image" />
                        <div className="book-info">
                            <p className="book-likes">
                                <button className="like-button" onClick={(e) => { e.stopPropagation(); handleLike(e, book.id) }}>
                                    <span role="img" aria-label="like">👍</span> {book.likes}
                                </button>
                            </p>
                            <button onClick={(e) => { e.stopPropagation(); handleShowComments(e, book.id) }}>
                                {showComments[book.id] ? 'Hide Comments' : 'Show Comments'}
                            </button>
                            {showComments[book.id] && (
                                <div className="comments-section">
                                    {comments[book.id] ? (
                                        comments[book.id].map(comment => (
                                            <div key={comment.id} className="comment-card">
                                                <h4>{comment.title}</h4>
                                                <p>{comment.body}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Loading comments...</p>
                                    )}
                                </div>
                            )}
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
                        <p><strong>Units in Stock:</strong> {selectedBook.unitsInStock}</p>
                        <p><strong>Category:</strong> {selectedBook.category}</p>
                        <p><strong>New:</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Books;
