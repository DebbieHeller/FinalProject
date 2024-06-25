import React, { useContext, useState } from "react";
import { useLocation } from 'react-router-dom';
import { FaComment, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { userContext } from "../src/App";

function UserBook() {
  const { user } = useContext(userContext);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [commentTitle, setCommentTitle] = useState('');
  const [commentBody, setCommentBody] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentId, setCommentId] = useState(null);
  const location = useLocation();
  const { book } = location.state;

  const handleShowComments = (bookId) => {
    setShowComments(!showComments);
    if (comments.length==0) {
      fetch(`http://localhost:3000/comments?bookId=${bookId}`)
        .then((res) => res.json())
        .then((bookComments) => {
          setComments(bookComments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentTitle || !commentBody) {
      alert('Please enter both title and body for the comment.');
      return;
    }

    const newComment = {
      title: commentTitle,
      body: commentBody,
      userId: user.id,
      bookId: book.id
    };
    fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newComment),
    })
      .then((res) => res.json())
      .then((createdComment) => {
        setComments([...comments, createdComment]);
        setShowCommentForm(false);
        setCommentTitle('');
        setCommentBody('');
      })
      .catch((error) => console.error('Error adding comment:', error));
  };

  const handleUpdateComment = (e, commentId) => {
    e.preventDefault();

    if (!commentTitle || !commentBody) {
      alert('Please enter both title and body for the comment.');
      return;
    }
    const updatedBody = {
      title: commentTitle,
      body: commentBody,
      userId: user.id,
      bookId: book.id
    };

    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBody),
    })
      .then(response => {
        if (response.ok) {
          setComments(comments.map(comment => comment.id === commentId ? { ...comment, ...updatedBody } : comment));
          setShowCommentForm(false);
          setCommentTitle('');
          setCommentBody('');
        } else {
          console.error('Error updating comment:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error updating comment:', error.message);
      });
  };

  const handleDeleteComment = (e, commentId) => {
    e.preventDefault();

    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.ok) {
          setComments(comments.filter(comment => comment.id !== commentId));
        } else {
          console.error('Error deleting comment:', response.statusText);
        }
      })
      .catch(error => {
        console.error('Error deleting comment:', error.message);
      });
  };

  const startEditing = (comment) => {
    setCommentId(comment.id)
    setCommentTitle(comment.title);
    setCommentBody(comment.body);
    setShowCommentForm(true);
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
        <button className='toggle-add-comment' onClick={() => { setShowCommentForm(!showCommentForm), setCommentId(null) }}>
          <FaPlus className="add-comment-icon" /> {showCommentForm ? 'Close Form' : 'Add Comment'}
        </button>
      </div>

      {showCommentForm && (
        <form className="comment-form">
          <input
            type="text"
            placeholder="Comment Title"
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Comment Body"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            required
          />
          <button type="submit" onClick={(e) => (commentId ? handleUpdateComment(e, commentId) : handleAddComment(e))}>submit</button>
        </form>
      )}

      {showComments && comments && (
        <div className="comments-section">
          {comments.map(comment => (
            <div key={comment.id} className="comment-card">
              <h4>{comment.title}</h4>
              <p>{comment.body}</p>
              {/* Check if the comment is authored by the current user */}
              {comment.userId === user.id && (
                <div className="comment-actions">
                  <button className="update-comment" onClick={() => startEditing(comment)}>
                    <FaEdit className="edit-icon" /> Update
                  </button>
                  <button className="delete-comment" onClick={(e) => handleDeleteComment(e, comment.id)}>
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

export default UserBook;
