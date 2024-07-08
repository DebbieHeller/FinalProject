import React, { useEffect, useState } from "react";
import "../css/inspectors.css";
import InspectorForm from "../components/InspectorForm"; // ייבוא של טופס הוספת פקח

function Inspectors() {
  const roleId = 2;
  const [users, setUsers] = useState([]);
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3000/users?roleId=${roleId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleAddInspector = (inspectorData) => {
    fetch("http://localhost:3000/users", {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inspectorData),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Inspector added successfully");
          fetchInspectors();
          setShowForm(false);
        } else {
          console.error("Error adding inspector:", response.statusText);
        }
      })
      .catch((error) => console.error("Error adding inspector:", error));
  };

  return (
    <div className="inspectors-container">
      <h1>Inspectors</h1>
      <div className={`add-inspector-form ${showForm ? 'active' : ''}`}>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Hide Form' : 'Add Inspector'}
        </button>
        {showForm && <InspectorForm onSubmit={handleAddInspector} />}
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="user-row">
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inspectors;
