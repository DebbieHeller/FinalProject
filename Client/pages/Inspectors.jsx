import React, { useEffect, useState } from "react";
import "../css/inspectors.css";

function Inspectors() {
  const roleId = 2;
  const [users, setUsers] = useState([]);
  const libraryId = parseInt(localStorage.getItem("libraryId"));
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchInspectors();
  }, []);

  const fetchInspectors = () => {
    fetch(`http://localhost:3000/users?roleId=${roleId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  };

  const handleAddInspector = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const newInspector = {
      username: formData.get('username'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      isWarned: formData.get('isWarned') === 'true',
      subscriptionTypeId: null,
      roleId: roleId,
      libraryId: libraryId,
      password: formData.get('password')
    };

    fetch("http://localhost:3000/users", {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newInspector),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Inspector added successfully");
          fetchInspectors();
          form.reset();
          setShowForm(false); // Hide form after adding inspector
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
        {showForm && (
          <form onSubmit={handleAddInspector}>
            <label>
              Username:
              <input type="text" name="username" required />
            </label>
            <label>
              Phone:
              <input type="text" name="phone" required />
            </label>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <label>
              Address:
              <input type="text" name="address" required />
            </label>
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <label>
              Is Warned:
              <select name="isWarned" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
            <button type="submit">Add Inspector</button>
          </form>
        )}
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
