import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import "../css/userBooks.css";
import "../css/books.css";
import { FaThumbsUp, FaComment, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

function UserBooks() {
  const { user } = useContext(userContext);
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedBook, setSelectedBook] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newCommentTitle, setNewCommentTitle] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/borrows?userId=${user.id}`)
      .then((res) => res.json())
      .then((borrowedBooks) => {
        setBooks(borrowedBooks);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, [user.id]);

  const handleShowComments = (bookId) => {
    setShowComments(!showComments);
    if (!comments[bookId]) {
      fetch(`http://localhost:3000/comments?bookId=${bookId}`)
        .then((res) => res.json())
        .then((bookComments) => {
          setComments({ ...comments, [bookId]: bookComments });
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };

  const handleLike = (e, book) => {
    e.preventDefault();

    fetch(`http://localhost:3000/books/${book.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...book,
        likes: book.likes + 1
      }),
    })
      .then((res) => res.json())
      .then((updatedBook) => {
        setBooks(books.map(b => b.id === book.id ? updatedBook : b));
      })
      .catch((error) => console.error('Error updating like:', error));
  };

  const handleSendComment = () => {
    // // Validate comment fields (title and body)
    // if (!newCommentTitle || !newCommentBody) {
    //   alert('Please enter both title and body for the comment.');
    //   return;
    // }

    // Prepare the new comment object
    const newComment = {
      title: newCommentTitle,
      body: newCommentBody,
      bookId: selectedBook.id, 
      userId: user.id, 
    };

    // Send the new comment to the server
    fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then((createdComment) => {
        alert("hhhhh")
        // Update local state to include the new comment
        setComments({ ...comments, [selectedBook.id]: [...comments[selectedBook.id], createdComment] });
        // Clear the comment fields after successful submission
        setNewCommentTitle('');
        setNewCommentBody('');
        setShowAddCommentForm(false); // Close the add comment form after submission
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  const handleUpdateComment = (commentId, updatedBody) => {
    // Prepare the updated comment object
    const updatedComment = {
      body: updatedBody,
    };

    // Send the updated comment to the server
    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedComment),
    })
      .then((res) => res.json())
      .then((updatedComment) => {
        // Update local state to reflect the updated comment
        const updatedComments = comments[selectedBook.id].map(comment =>
          comment.id === updatedComment.id ? updatedComment : comment
        );
        setComments({ ...comments, [selectedBook.id]: updatedComments });
      })
      .catch((error) => console.error('Error updating comment:', error));
  };

  const handleDeleteComment = (commentId) => {
    // Send delete request to the server
    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update local state to remove the deleted comment
        const updatedComments = comments[selectedBook.id].filter(comment =>
          comment.id !== commentId
        );
        setComments({ ...comments, [selectedBook.id]: updatedComments });
      })
      .catch((error) => console.error('Error deleting comment:', error));
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setShowComments(false); // Reset comments display when selecting a new book
  };

  return (///צריך להעביר את כל העסק הזה לקומפוננטה נפרדת
    <div className="user-books-container">
      <h1>Your Borrowed Books</h1>
      <div className="books-grid">
        {books.map((book) => (
          <div key={book.id} className="book-card" onClick={() => handleBookClick(book)}>
            <img src={book.coverUrl} alt={book.title} className="book-image" />
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-likes">
                <FaThumbsUp className="like-icon" /> {book.likes}
              </p>
              <p className="book-author">{book.author}</p>
              <p className="book-summary">{book.summary}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div className="modal" onClick={() => setSelectedBook(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setSelectedBook(null)}>&times;</span>
            <h2>{selectedBook.title}</h2>
            <p><strong>Author:</strong> {selectedBook.author}</p>
            <p><strong>Pages:</strong> {selectedBook.numOfPages}</p>
            <p><strong>Published:</strong> {selectedBook.publishingYear}</p>
            <p><strong>Summary:</strong> {selectedBook.summary}</p>
            <p><strong>Units in Stock:</strong> {selectedBook.unitsInStock}</p>
            <p><strong>Category:</strong> {selectedBook.category}</p>
            <p><strong>New:</strong> {selectedBook.isNew ? 'Yes' : 'No'}</p>
            <div className="comments-controls">
              <button className='toggle-comments' onClick={() => handleShowComments(selectedBook.id)}>
                <FaComment className="comment-icon" /> {showComments ? 'Hide Comments' : 'Show Comments'}
              </button>
              <button className='toggle-add-comment' onClick={() => setShowAddCommentForm(!showAddCommentForm)}>
                <FaPlus className="add-comment-icon" /> Add Comment
              </button>
            </div>
            {showAddCommentForm && (
              <form className="add-comment-form" onSubmit={handleSendComment}>
                <input
                  type="text"
                  placeholder="Comment Title"
                  value={newCommentTitle}
                  onChange={(e) => setNewCommentTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Comment Body"
                  value={newCommentBody}
                  onChange={(e) => setNewCommentBody(e.target.value)}
                  required
                />
                <button type="submit">Submit</button>
              </form>
            )}
            {showComments && comments[selectedBook.id] && (
              <div className="comments-section">
                {comments[selectedBook.id].map(comment => (
                  <div key={comment.id} className="comment-card">
                    <h4>{comment.title}</h4>
                    <p>{comment.body}</p>
                    {comment.userId === user.id && (
                      <div className="comment-actions">
                        <button className="update-comment" onClick={() => handleUpdateComment(comment.id, 'Updated body')}>
                          <FaEdit className="edit-icon" /> Update
                        </button>
                        <button className="delete-comment" onClick={() => handleDeleteComment(comment.id)}>
                          <FaTrash className="delete-icon" /> Delete
                        </button>
                      </div>
                    )}
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

export default UserBooks;
