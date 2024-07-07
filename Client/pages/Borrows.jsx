import React, { useState, useEffect } from "react";
import '../css/inspectorBorrows.css';

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [selectedBorrows, setSelectedBorrows] = useState([]);
  const [selectedNotIntactBorrows, setSelectedNotIntactBorrows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const libraryId = parseInt(localStorage.getItem("libraryId"));

  useEffect(() => {
    fetch(`http://localhost:3000/inspectorBorrows?libraryId=${libraryId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrows(data);
      })
      .catch((error) => console.error("Error fetching borrows:", error));
  }, [libraryId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleCheckboxChange = (index) => {
    const newBorrows = [...borrows];
    newBorrows[index].isIntact = !newBorrows[index].isIntact;
    if (newBorrows[index].isIntact) {
      newBorrows[index].isReturned = true;
    }
    setBorrows(newBorrows);

    // Manage selected borrows
    const updatedSelectedBorrows = [...selectedBorrows];
    const isSelected = updatedSelectedBorrows.some(borrow => borrow.borrowId === newBorrows[index].borrowId);
    if (newBorrows[index].isIntact && !isSelected) {
      updatedSelectedBorrows.push(newBorrows[index]);
    } else if (!newBorrows[index].isIntact && isSelected) {
      const selectedIndex = updatedSelectedBorrows.findIndex(borrow => borrow.borrowId === newBorrows[index].borrowId);
      updatedSelectedBorrows.splice(selectedIndex, 1);
    }
    setSelectedBorrows(updatedSelectedBorrows);

    // Disable corresponding not intact selection
    const updatedSelectedNotIntactBorrows = [...selectedNotIntactBorrows];
    const selectedNotIntactIndex = updatedSelectedNotIntactBorrows.findIndex(borrow => borrow.borrowId === newBorrows[index].borrowId);
    if (selectedNotIntactIndex > -1) {
      updatedSelectedNotIntactBorrows.splice(selectedNotIntactIndex, 1);
      setSelectedNotIntactBorrows(updatedSelectedNotIntactBorrows);
    }
  };

  const handleNotIntactChange = (index) => {
    const newBorrows = [...borrows];
    newBorrows[index].isIntact = !newBorrows[index].isIntact;
    setBorrows(newBorrows);

    // Manage selected not intact borrows
    const updatedSelectedNotIntactBorrows = [...selectedNotIntactBorrows];
    const isSelected = updatedSelectedNotIntactBorrows.some(borrow => borrow.borrowId === newBorrows[index].borrowId);
    if (!newBorrows[index].isIntact && !isSelected) {
      updatedSelectedNotIntactBorrows.push(newBorrows[index]);
    } else if (newBorrows[index].isIntact && isSelected) {
      const selectedIndex = updatedSelectedNotIntactBorrows.findIndex(borrow => borrow.borrowId === newBorrows[index].borrowId);
      updatedSelectedNotIntactBorrows.splice(selectedIndex, 1);
    }
    setSelectedNotIntactBorrows(updatedSelectedNotIntactBorrows);

    // Disable corresponding intact selection
    const updatedSelectedBorrows = [...selectedBorrows];
    const selectedBorrowIndex = updatedSelectedBorrows.findIndex(borrow => borrow.borrowId === newBorrows[index].borrowId);
    if (selectedBorrowIndex > -1) {
      updatedSelectedBorrows.splice(selectedBorrowIndex, 1);
      setSelectedBorrows(updatedSelectedBorrows);
    }
  };

  const handleSubmitSelectedBorrows = () => {
    if (selectedBorrows.length === 0) {
      console.log("No selected intact borrows to submit");
      return;
    }

    setIsLoading(true);

    const updatedBorrows = [...borrows];
    const updatedSelectedBorrows = [...selectedBorrows];

    selectedBorrows.forEach((borrowBook) => {
      const returnDate = new Date().toISOString().split("T")[0];
      const borrowDate = new Date(borrowBook.borrowDate)
        .toISOString()
        .split("T")[0];

      const updatedBorrow = {
        id: borrowBook.borrowId,
        copyBookId: borrowBook.copyBookId,
        userId: borrowBook.userId,
        bookId: borrowBook.id,
        borrowDate: borrowDate,
        returnDate: returnDate,
        status: "Returned",
        isReturned: true,
        isIntact: true
      };

      fetch(`http://localhost:3000/inspectorBorrows/${borrowBook.borrowId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBorrow),
      })
        .then((response) => {
          if (response.ok) {
            const index = updatedBorrows.findIndex((borrow) => borrow.borrowId === borrowBook.borrowId);
            if (index > -1) {
              updatedBorrows.splice(index, 1);
            }
            setBorrows([...updatedBorrows]);
            const selectedIndex = updatedSelectedBorrows.findIndex((borrow) => borrow.borrowId === borrowBook.borrowId);
            if (selectedIndex > -1) {
              updatedSelectedBorrows.splice(selectedIndex, 1);
            }
            setSelectedBorrows([...updatedSelectedBorrows]);
          } else {
            console.error("Error updating borrow:", response.statusText);
          }
        })
        .catch((error) => console.error("Error updating borrow:", error));
    });

    setIsLoading(false);
  };

  const handleSubmitNotIntactBorrows = () => {
    if (selectedNotIntactBorrows.length === 0) {
      console.log("No selected not intact borrows to submit");
      return;
    }

    setIsLoading(true);

    const updatedBorrows = [...borrows];
    const updatedSelectedNotIntactBorrows = [...selectedNotIntactBorrows];

    selectedNotIntactBorrows.forEach((borrowBook) => {
      const returnDate = new Date().toISOString().split("T")[0];
      const borrowDate = new Date(borrowBook.borrowDate)
        .toISOString()
        .split("T")[0];

      const updatedBorrow = {
        id: borrowBook.borrowId,
        copyBookId: borrowBook.copyBookId,
        userId: borrowBook.userId,
        bookId: borrowBook.id,
        borrowDate: borrowDate,
        returnDate: returnDate,
        status: "Returned",
        isReturned: true,
        isIntact: false
      };

      fetch(`http://localhost:3000/inspectorBorrows/${borrowBook.borrowId}`, {
        method: "PUT",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBorrow),
      })
        .then((response) => {
          if (response.ok) {
            const index = updatedBorrows.findIndex((borrow) => borrow.borrowId === borrowBook.borrowId);
            if (index > -1) {
              updatedBorrows.splice(index, 1);
            }
            setBorrows([...updatedBorrows]);
            const selectedIndex = updatedSelectedNotIntactBorrows.findIndex((borrow) => borrow.borrowId === borrowBook.borrowId);
            if (selectedIndex > -1) {
              updatedSelectedNotIntactBorrows.splice(selectedIndex, 1);
            }
            setSelectedNotIntactBorrows([...updatedSelectedNotIntactBorrows]);
          } else {
            console.error("Error updating borrow:", response.statusText);
          }
        })
        .catch((error) => console.error("Error updating borrow:", error));
    });

    setIsLoading(false);
  };

  return (
    <div className="borrows-container">
      <h1>השאלות קודמות</h1>
      {isLoading && <div className="loading-message">Updating...</div>}
      <table className="borrows-table">
        <thead>
          <tr>
            <th>ספר</th>
            <th>תאריך השאלה</th>
            <th>תאריך החזרה</th>
            <th>סטטוס</th>
            <th>הוחזר</th>
            <th>תקין</th>
            <th>לא תקין</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow, index) => (
            <tr key={index}>
              <td>{borrow.nameBook}</td>
              <td>{formatDate(borrow.borrowDate)}</td>
              <td>{formatDate(borrow.returnDate)}</td>
              <td>{borrow.status}</td>
              <td>
                <input
                  type="checkbox"
                  checked={borrow.isReturned}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={borrow.isIntact}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={!borrow.isIntact}
                  onChange={() => handleNotIntactChange(index)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmitSelectedBorrows}>
        Submit Selected Borrows
      </button>
      <button onClick={handleSubmitNotIntactBorrows}>
        Submit Not Intact Borrows
      </button>
    </div>
  );
}

export default Borrows;
