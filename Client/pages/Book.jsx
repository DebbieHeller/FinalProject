import React, { useState } from "react";
import { FaComment, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

function Book({ book, user }) {
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [newCommentTitle, setNewCommentTitle] = useState('');
  const [newCommentBody, setNewCommentBody] = useState('');
  const [showAddCommentForm, setShowAddCommentForm] = useState(false);

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
      .then((updatedbook) => {
        // Handle updated book logic if needed
      })
      .catch((error) => console.error('Error updating like:', error));
  };

  const handleSendComment = (e) => {
    e.preventDefault();

    // Validate comment fields (title and body)
    if (!newCommentTitle || !newCommentBody) {
      alert('Please enter both title and body for the comment.');
      return;
    }

    // Prepare the new comment object
    const newComment = {
      title: newCommentTitle,
      body: newCommentBody,
      bookId: book.id,
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
        // Handle created comment logic if needed
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  const handleUpdateComment = (commentId, updatedBody) => {
    // Implement update comment logic
  };

  const handleDeleteComment = (commentId) => {
    // Implement delete comment logic
  };

  return (
   
    <div className="book-details">
      <h2>{book.nameBook}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Pages:</strong> {book.numOfPages}</p>
      <p><strong>Published:</strong> {book.publishingYear}</p>
      <p><strong>Summary:</strong> {book.summary}</p>
      <p><strong>Units in Stock:</strong> {book.unitsInStock}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>New:</strong> {book.isNew ? 'Yes' : 'No'}</p>

      <div className="comments-controls">
        <button className='toggle-comments' onClick={() => handleShowComments(book.id)}>
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

      {showComments && comments[book.id] && (
        <div className="comments-section">
          {comments[book.id].map(comment => (
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
  );
}

export default Book;
