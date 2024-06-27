import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaThumbsUp } from 'react-icons/fa';
import { userContext } from "../src/App";
import '../css/userBorrows.css'; 

function UserBorrows() {
    const { user } = useContext(userContext);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/prevBorrows?userId=${user.id}`) 
            .then((res) => res.json())
            .then((data) => {
                setBorrowedBooks(data);
                setSearchResults(data);
            })
            .catch((error) => console.error("Error fetching books:", error));
    }, [user.id]);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        let filteredBooks = borrowedBooks.filter(book =>
            book.nameBook.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query) ||
            book.category.toLowerCase().includes(query)
        );

        if (filter === 'month') {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            filteredBooks = filteredBooks.filter(book => new Date(book.borrowDate) > oneMonthAgo);
        } else if (filter === 'week') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            filteredBooks = filteredBooks.filter(book => new Date(book.borrowDate) > oneWeekAgo);
        } else if (filter === 'day') {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            filteredBooks = filteredBooks.filter(book => new Date(book.borrowDate) > oneDayAgo);
        }

        setSearchResults(filteredBooks);
    }, [searchQuery, filter, borrowedBooks]);

    const handleRowDoubleClick = (index, book) => {
        setSelectedRow(index);
        navigate(`${book.copyBookId}`, { state: { book } });
    };

    return (
        <div className="books-container">
            <h1>Books Borrowed by {user.name}</h1> 
            <form className="search-form">
                <div className="search-input-container">
                    <input
                        type="text"
                        placeholder="Search by name, author or category"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <FaSearch className="search-icon" />
                </div>
                <div className="filter-container">
                    <label>
                        <input
                            type="radio"
                            value="all"
                            checked={filter === 'all'}
                            onChange={() => setFilter('all')}
                        />
                        All
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="month"
                            checked={filter === 'month'}
                            onChange={() => setFilter('month')}
                        />
                        Last Month
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="week"
                            checked={filter === 'week'}
                            onChange={() => setFilter('week')}
                        />
                        Last Week
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="day"
                            checked={filter === 'day'}
                            onChange={() => setFilter('day')}
                        />
                        Last Day
                    </label>
                </div>
            </form>
            <table className="books-table">
                <thead>
                    <tr>
                        <th>Borrow Date</th>
                        <th>Return Date</th>
                        <th>Book Name</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((book, index) => (
                            <tr
                                key={book.id}
                                className={selectedRow === index ? "selected-row" : ""}
                                onDoubleClick={() => handleRowDoubleClick(index, book)}
                            >
                                <td>{new Date(book.borrowDate).toISOString().split('T')[0]}</td>
                                <td>{new Date(book.returnDate).toISOString().split('T')[0]}</td>
                                <td>{book.nameBook}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
                                <td><FaThumbsUp className="like-icon" /> {book.likes}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No books borrowed yet.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default UserBorrows;
