import React, { useContext, useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { FaComment, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { userContext } from "../src/App";
import '../css/userBook.css';

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

  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetch(`http://localhost:3000/comments?bookId=${book.id}`)
        .then((res) => res.json())
        .then((bookComments) => {
          setComments(bookComments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  }, [showComments, book.id, comments.length]);

  const handleShowComments = () => {
    setShowComments(!showComments);
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
      credentials: 'include',
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

  const handleUpdateComment = (e) => {
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
      credentials: 'include',
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
      method: 'DELETE',
      credentials: 'include'
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
      <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} />
      <h2>{book.nameBook}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Pages:</strong> {book.numOfPages}</p>
      <p><strong>Published:</strong> {book.publishingYear}</p>
      <p><strong>Summary:</strong> {book.summary}</p>
      <p><strong>Units in Stock:</strong> {book.unitsInStock}</p>
      <p><strong>Category:</strong> {book.category}</p>
      <p><strong>New:</strong> {book.isNew ? 'Yes' : 'No'}</p>

      <div className="comments-controls">
        <button className='toggle-comments' onClick={handleShowComments}>
          <FaComment className="comment-icon" /> {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
        <button className='toggle-add-comment' onClick={() => setShowCommentForm(!showCommentForm)}>
          <FaPlus className="add-comment-icon" /> {showCommentForm ? 'Cancel' : 'Add Comment'}
        </button>
      </div>

      {showCommentForm && (
        <form className='comment-form' onSubmit={(e) => commentId ? handleUpdateComment(e) : handleAddComment(e)}>
          <input
            type="text"
            placeholder="Title"
            value={commentTitle}
            onChange={(e) => setCommentTitle(e.target.value)}
          />
          <textarea
            placeholder="Comment"
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          ></textarea>
          <button type="submit">{commentId ? 'Update Comment' : 'Submit Comment'}</button>
        </form>
      )}

      {showComments && (
        <div className='comments-section'>
          {comments.map((comment) => (
            <div key={comment.id} className='comment-card'>
              <h4>{comment.title}</h4>
              <p>{comment.body}</p>
              <div className='comment-actions'>
                <button className="update-comment" onClick={() => startEditing(comment)}>
                  <FaEdit className="edit-icon" /> Edit
                </button>
                <button className="delete-comment" onClick={(e) => handleDeleteComment(e, comment.id)}>
                  <FaTrash className="delete-icon" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBook;
