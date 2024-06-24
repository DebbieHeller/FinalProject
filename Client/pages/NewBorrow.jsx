import React, { useContext, useState, useEffect } from "react";
import { userContext } from "../src/App";
import '../css/books.css';
import {FaThumbsUp, FaStar } from 'react-icons/fa'; // Import FaStar icon for favorite

function NewBorrow() {
    const { user } = useContext(userContext);
    const [recommendedBooks, setRecommendedBooks] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/recommends?userId=${user.id}`)
            .then((res) => res.json())
            .then((books) => {
                setRecommendedBooks(books);
            })
            .catch((error) => console.error('Error fetching books:', error));
    }, [user.id]);

    return (
        <>
            <h1>השאלה חדשה</h1>
            <div className="books-grid">
                {recommendedBooks.map(book => (
                    <div key={book.id} className="book-card">
                        <img src={`http://localhost:3000/images/${book.image}`} alt={book.nameBook} className="book-image" />
                        <div className="book-info">
                            <p className="book-likes">
                                <FaThumbsUp className="like-icon" /> {book.likes}
                            </p>
                            <FaStar className="favorite-icon" style={{ color: 'gold', marginLeft: '5px' }} />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default NewBorrow;
