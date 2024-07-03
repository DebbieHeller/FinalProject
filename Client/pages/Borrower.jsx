import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import '../css/borrower.css'; // Import your CSS file

function Borrower() {
    const location = useLocation();
    const { borrow } = location.state;
    const [books, setBooks] = useState([]);
    const [message, setMessage] = useState({
        userId: borrow.userId,
        title: '',
        body: '',
        status: 'draft', // Assuming default status is 'draft'
        createdDate: new Date().toISOString(), // Current date/time
        readDate: null // Initially null, assuming message is unread
    });

    useEffect(() => {
        fetch(`http://localhost:3000/libraryAdmin?userId=${borrow.userId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then((res) => res.json())
        .then((books) => {
            setBooks(books); // Set state with fetched books data
        })
        .catch((error) => console.error('Error fetching books:', error));
    }, [borrow.userId]);

    const sendMessage = (bookId, isIntact) => {
        let messageBody = '';

        if (!isIntact) {
            messageBody = 'החזרת ספר לא תקין, הנך באזהרה';
        } else {
            // Handle other conditions if needed
        }

        setMessage({
            ...message,
            title: `Message regarding Book ID: ${bookId}`,
            body: messageBody
        });

        // Now you can send the message to the server
        console.log(`Sending message for book with ID: ${bookId}`);
        console.log(message); // This will contain the message details to send
        // Implement your fetch logic to send message to server (POST request)
        // Example:
        /*
        fetch('http://localhost:3000/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        .then((res) => res.json())
        .then((response) => {
            console.log('Message sent:', response);
            // Optionally update state or show success message
        })
        .catch((error) => console.error('Error sending message:', error));
        */
    };

    return (
        <div>
            <h1>Borrower Details for User ID: {borrow.userId}</h1>
            <table className="borrow-details">
                <thead>
                    <tr>
                        <th>Copy Book ID</th>
                        <th>Borrow Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                        <th>Returned</th>
                        <th>Intact</th>
                        <th>Send Message</th> {/* New column header */}
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.borrowId}>
                            <td>{book.copyBookId}</td>
                            <td>{book.borrowDate}</td>
                            <td>{book.returnDate}</td>
                            <td>{book.status}</td>
                            <td>{book.isReturned ? 'Yes' : 'No'}</td>
                            <td>{book.isIntact ? 'Yes' : 'No'}</td>
                            <td>
                                <button onClick={() => sendMessage(book.copyBookId, book.isIntact)}>Send Message</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Borrower;
