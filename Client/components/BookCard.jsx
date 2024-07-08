import React, { useState, useEffect, useContext } from "react";
import { FaThumbsUp, FaStar } from 'react-icons/fa';
import { userContext } from "../src/App";

function BookCard({ book }) {
    const { user } = useContext(userContext);
    const libraryId = parseInt(localStorage.getItem('libraryId'));
    const [likes, setLikes] = useState({});

    useEffect(() => {
        const likesApi = user && user.roleId == 1 ? `http://localhost:3000/likes`
            : `http://localhost:3000/likes?libraryId=${libraryId}`

        fetch(likesApi)
            .then((res) => res.json())
            .then((likes) => {
                const likesObject = likes.reduce((acc, like) => {
                    acc[like.bookId] = like.numLikes;
                    return acc;
                }, {});
                setLikes(likesObject);
            })
            .catch((error) => console.error("Error fetching likes:", error));
    }, [libraryId]);

    const handleLike = (bookId) => {
        fetch(`http://localhost:3000/likes?bookId=${bookId}`, {
            method: 'PUT',
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then((res) => {
                const prevLikes = likes[bookId];
                if (res.status == 201) {
                    setLikes({ ...likes, [bookId]: prevLikes + 1 });
                }
                else if (res.status == 200) {
                    setLikes({ ...likes, [bookId]: prevLikes - 1 });
                }
            })
            .catch((error) => console.error('Error updating likes:', error));
    };

    return (
        <>
            <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
            <div className="book-info">
                <p><strong>{book.nameBook}</strong></p>
                {book.recommended && <FaStar className="recommended-icon" />}
                {user && (user.roleId == 1 || user.roleId == 4) ? <p className="book-likes" onClick={(e) => { e.stopPropagation(); handleLike(book.id); }}>
                    <FaThumbsUp className="like-icon" /> {likes[book.id]}
                </p> :
                    <><FaThumbsUp className="like-icon" /> {likes[book.id]}</>}
            </div>
        </>
    )
}

export default BookCard;