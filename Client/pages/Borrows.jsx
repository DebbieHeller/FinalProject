import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../css/inspectorBorrows.css';

function Borrows() {
  const [borrows, setBorrows] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/inspectorBorrows`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrows(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  }, []);

  useEffect(() => {
    console.log("Borrows state updated:", borrows);
  }, [borrows]);

  return (
    <div className="borrows-container">
      <h1>השאלות קודמות</h1>
      <table className="borrows-table">
        <thead>
          <tr>
            <th>Copy Book ID</th>
            <th>User ID</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Is Returned</th>
            <th>Is Intact</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow, index) => (
            <tr key={index}>
              <td>{borrow.copyBookId}</td>
              <td>{borrow.userId}</td>
              <td>{borrow.borrowDate}</td>
              <td>{borrow.returnDate}</td>
              <td>{borrow.status}</td>
              <td>{borrow.isReturned ? 'Yes' : 'No'}</td>
              <td>{borrow.isIntact ? 'Yes' : 'No'}</td>
              <td className="borrows-icons">
                <FaEdit />
                <FaTrash />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Borrows;
