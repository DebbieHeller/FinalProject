import React, { useState, useEffect } from "react";
import "../css/inspectorBorrows.css";

function ReturnedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [checkboxData, setCheckboxData] = useState([]);
  const libraryId = parseInt(localStorage.getItem("libraryId"));

  useEffect(() => {
    fetch(`http://localhost:3000/inspectorBorrows?libraryId=${libraryId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrows(data);
        setCheckboxData(
          data.map(() => ({
            borrowId: "",
            isReturned: "",
            isIntact: "",
          }))
        );
      })
      .catch((error) => console.error("Error fetching borrows:", error));
  }, [libraryId]);

  const handleCheckboxChange = (index, type) => {
    const updatedData = { ...checkboxData };

    if (type === "isReturned") {
      updatedData[index].isReturned = !updatedData[index].isReturned;
      updatedData[index].isIntact = "";
    } else {
      if (type === "isIntact") {
        updatedData[index].isIntact =
          updatedData[index].isIntact === "intact" ? "" : "intact";
      } else if (type === "isNotIntact") {
        updatedData[index].isIntact =
          updatedData[index].isIntact === "notIntact" ? "" : "notIntact";
      }
      updatedData[index].isReturned = "";
    }
    setCheckboxData(updatedData);
  };

  const handleSubmit = () => {
    try {
      const updatedBorrows = borrows
        .filter((borrow, index) => checkboxData[index].isReturned || checkboxData[index].isIntact !== '')
        .map((borrow, index) => ({
          borrowId: borrow.borrowId,
          copyBookId: borrow.copyBookId,
          isReturned: checkboxData[index].isReturned == "" ? true : false,
          isIntact: checkboxData[index].isIntact === "intact",
          statusBorrow: borrow.status,
          userId:borrow.userId
        }));

      let allRequestsSucceeded = true;

      updatedBorrows.forEach((updatedBorrow) => {
        fetch(
          `http://localhost:3000/inspectorBorrows/${updatedBorrow.borrowId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              copyBookId: updatedBorrow.copyBookId,
              isReturned: updatedBorrow.isReturned,
              isIntact: updatedBorrow.isIntact,
              statusBorrow: updatedBorrow.statusBorrow,
              userId:updatedBorrow.userId
            }),
          }
        )
          .then((response) => {
            if (!response.ok) {
              allRequestsSucceeded = false;
              throw new Error("Network response was not ok");
            }
          })
          .catch((error) => {
            console.error("Error updating borrow:", error);
            allRequestsSucceeded = false;
          });
      });

      if (allRequestsSucceeded) {
        const updatedBorrowsIds = updatedBorrows.map(
          (borrow) => borrow.borrowId
        );

        setBorrows(
          borrows.filter(
            (borrow) => !updatedBorrowsIds.includes(borrow.borrowId)
          )
        );
        setCheckboxData(
          borrows.map(() => ({
            borrowId: "",
            isReturned: "",
            isIntact: "",
          }))
        );
      } else {
        console.error("Not all requests succeeded, please try again.");
      }
    } catch (error) {
      console.error("Error updating borrows:", error);
    }
  };
  
  return (
    <div className="borrows-container">
      <h1>ספרים שהוחזרו</h1>
      <table className="borrows-table">
        <thead>
          <tr>
            <th>קוד ספר</th>
            <th>שם ספר</th>
            <th>שם סופר</th>
            <th>סטטוס</th>
            <th>לא הוחזר</th>
            <th>תקין</th>
            <th>לא תקין</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length === 0 ? (
            <tr>
              <td className="td-detailed" colSpan="6">
                אין ספרים שהושאלו
              </td>
            </tr>
          ) : (
            borrows.map((borrow, index) => (
              <tr key={borrow.borrowId}>
                <td className="td-detailed">{borrow.copyBookId}</td>
                <td className="td-detailed">{borrow.nameBook}</td>
                <td className="td-detailed">{borrow.author}</td>
                <td className="td-detailed">{borrow.status}</td>
                <td className="td-detailed">
                  <input
                    type="checkbox"
                    checked={checkboxData[index].isReturned}
                    onChange={() => handleCheckboxChange(index, "isReturned")}
                  />
                </td>
                <td className="td-detailed">
                  <input
                    type="checkbox"
                    checked={checkboxData[index].isIntact === "intact"}
                    onChange={() => handleCheckboxChange(index, "isIntact")}
                  />
                </td>
                <td className="td-detailed">
                  <input
                    type="checkbox"
                    checked={checkboxData[index].isIntact === "notIntact"}
                    onChange={() => handleCheckboxChange(index, "isNotIntact")}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default ReturnedBooks;
