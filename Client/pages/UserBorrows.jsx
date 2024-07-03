import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaThumbsUp } from 'react-icons/fa';
import { userContext } from "../src/App";
import '../css/userBorrows.css';
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

function UserBorrows() {
    const libraryId = parseInt(localStorage.getItem('libraryId'));
    const { user } = useContext(userContext);
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:3000/prevBorrows?userId=${user.id}`, {
            method: 'GET',
            credentials: 'include' 
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
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

        if (startDate && !endDate) {
            const startDateObj = new Date(startDate);
            filteredBooks = filteredBooks.filter(book => new Date(book.borrowDate) >= startDateObj);
        } else if (!startDate && endDate) {
            const endDateObj = new Date(endDate);
            filteredBooks = filteredBooks.filter(book => new Date(book.borrowDate) <= endDateObj);
        } else if (startDate && endDate) {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            filteredBooks = filteredBooks.filter(book =>
                new Date(book.borrowDate) >= startDateObj && new Date(book.borrowDate) <= endDateObj
            );
        }

        setSearchResults(filteredBooks);
    }, [searchQuery, startDate, endDate, borrowedBooks]);

    const handleRowDoubleClick = (index, book) => {
        setSelectedRow(index);
        navigate(`${book.copyBookId}`, { state: { book } });
    };

    return (
        <div className="books-container">
            <h1>השאלות קודמות</h1>
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
                    <label>Search by Date:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="date-input"
                    />
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
                    </tr>
                </thead>
                <tbody>
                    {searchResults.length > 0 ? (
                        searchResults.map((book, index) => (
                            <tr
                                key={book.borrowId}
                                className={selectedRow === index ? "selected-row" : ""}
                                onDoubleClick={() => handleRowDoubleClick(index, book)}
                            >
                                <td>{new Date(book.borrowDate).toISOString().split('T')[0]}</td>
                                <td>{new Date(book.returnDate).toISOString().split('T')[0]}</td>
                                <td>{book.nameBook}</td>
                                <td>{book.author}</td>
                                <td>{book.category}</td>
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
