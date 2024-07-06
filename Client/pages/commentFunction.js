// commentActions.js
export const handleShowComments = (bookId, comments, setComments, showComments, setShowComments) => {
    setShowComments(!showComments);
    if (comments.length === 0) {
      fetch(`http://localhost:3000/comments?bookId=${bookId}`)
        .then((res) => res.json())
        .then((bookComments) => {
          setComments(bookComments);
        })
        .catch((error) => console.error("Error fetching comments:", error));
    }
  };
  
  export const handleAddComment = (e, commentTitle, commentBody, user, book, comments, setComments, setShowCommentForm, setCommentTitle, setCommentBody) => {
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
  
  export const handleUpdateComment = (e, commentId, commentTitle, commentBody, user, book, comments, setComments, setShowCommentForm, setCommentTitle, setCommentBody) => {
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
  
  export const handleDeleteComment = (e, commentId, comments, setComments) => {
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
  