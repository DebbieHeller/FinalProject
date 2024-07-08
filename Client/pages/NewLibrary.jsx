import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/newLibrary.css";

function NewLibrary() {
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if(!selectedManager){
      alert('לא בחרת מנהל')
      return;
    }
    const newLibrary = {
      libraryName,
      address,
      phone,
      userId: selectedManager.id
    };

    fetch('http://localhost:3000/libraries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(newLibrary)
    })
      .then((res) => {
        if(res.status == 201)
          navigate('/admin-home/libraries');
        else if(res.status == 409)
            alert('בחרת מנהל של ספריה קיימת')
      })
      .catch((error) => console.error('Error adding library:', error));
  };

  const handleManagerSelect = (manager) => {
    setSelectedManager(manager);
    setShowManagerModal(false);
  };

  const filteredManagers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="newLibrary-container">
      <h1>הוספת ספרייה חדשה</h1>
      <form onSubmit={handleSubmit}>
        <div className="newLibrary-form-group">
          <label htmlFor="libraryName">שם ספרייה</label>
          <input
            type="text"
            id="libraryName"
            value={libraryName}
            onChange={(e) => setLibraryName(e.target.value)}
            required
          />
        </div>
        <div className="newLibrary-form-group">
          <label htmlFor="address">כתובת</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="newLibrary-form-group">
          <label htmlFor="phone">טלפון</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="newLibrary-form-group">
          <label>מנהל ספרייה</label>
          <button type="button" onClick={() => setShowManagerModal(true)}>
            בחירת מנהל ספרייה
          </button>
          {selectedManager && (
            <div>
              מנהל נבחר: {selectedManager.username}
            </div>
          )}
        </div>
        <button type="submit">אישור</button>
      </form>

      {showManagerModal && (
        <div className="newLibrary-modal">
          <div className="newLibrary-modal-content">
            <span className="newLibrary-close" onClick={() => setShowManagerModal(false)}>
              &times;
            </span>
            <button>הוספת מנהל ספרייה</button>
            <input
              type="text"
              placeholder="חיפוש לפי שם משתמש"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>שם משתמש</th>
                </tr>
              </thead>
              <tbody>
                {filteredManagers.map((manager) => (
                  <tr key={manager.id} onClick={() => handleManagerSelect(manager)}>
                    <td>{manager.id}</td>
                    <td>{manager.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewLibrary;
