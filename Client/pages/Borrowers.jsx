import { useEffect, useState } from "react";
import "../css/home.css";
import "../css/borrowers.css";
import { useNavigate } from 'react-router-dom';


function Borrowers() {
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/libraryAdmin?libraryId=${libraryId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBorrowRecords(data);
        console.log(data);
      })
      .catch((error) =>
        console.error("Error fetching borrow records:", error)
      );
  }, [libraryId]);

  const handleRowDoubleClick = (index, borrow) => {
    setSelectedRow(index);
    navigate(`${borrow.borrowId}`, { state: { borrow } });
    
  };

  return (
    <>
      <h1>Borrowers</h1>
      <table className="borrow-table">
        <thead>
          <tr>
            <th>Borrow ID</th>
            <th>שם ספר</th>
            <th>Copy Book ID</th>
            <th>User ID</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Status</th>
            <th>Is Returned</th>
            <th>Is Intact</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((borrow, index) => (
            <tr
              key={borrow.borrowId}
              className={selectedRow === index ? "selected-row" : ""}
              onDoubleClick={() => handleRowDoubleClick(index, borrow)}
            >
              <td>{borrow.borrowId}</td>
              <td>{borrow.nameBook}</td>
              <td>{borrow.copyBookId}</td>
              <td>{borrow.userId}</td>
              <td>{borrow.borrowDate}</td>
              <td>{borrow.returnDate}</td>
              <td>{borrow.status}</td>
              <td>{borrow.isReturned ? "Yes" : "No"}</td>
              <td>{borrow.isIntact ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Borrowers;
