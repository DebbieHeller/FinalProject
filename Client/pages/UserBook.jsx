import React, { useContext, useState } from "react";
import { useLocation } from 'react-router-dom';
import { FaComment, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { userContext } from "../src/App";
import '../css/userBook.css';
import {
  handleShowComments,
  handleAddComment,
  handleUpdateComment,
  handleDeleteComment
} from './commentFunction';

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
        <button className='toggle-comments' onClick={() => handleShowComments(book.id, comments, setComments, showComments, setShowComments)}>
          <FaComment className="comment-icon" /> {showComments ? 'Hide Comments' : 'Show Comments'}
        </button>
        <button className='toggle-add-comment' onClick={() => setShowCommentForm(!showCommentForm)}>
          <FaPlus className="add-comment-icon" /> {showCommentForm ? 'Cancel' : 'Add Comment'}
        </button>
      </div>

      {showCommentForm && (
        <form className='comment-form' onSubmit={(e) => commentId ? handleUpdateComment(e, commentId, commentTitle, commentBody, user, book, comments, setComments, setShowCommentForm, setCommentTitle, setCommentBody) : handleAddComment(e, commentTitle, commentBody, user, book, comments, setComments, setShowCommentForm, setCommentTitle, setCommentBody)}>
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
                <button className="delete-comment" onClick={(e) => handleDeleteComment(e, comment.id, comments, setComments)}>
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
