import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/newLibrary.css";
import InspectorForm from "../components/InspectorForm"; // ייבוא של טופס בחירת מנהל

function NewLibrary() {
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedManager, setSelectedManager] = useState(null);
  const [showManagerForm, setShowManagerForm] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newLibrary = {
      libraryName:libraryName,
      address:address,
      phone:phone,
      userId: 15,
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
        if (res.status === 201) {
          navigate('/admin-home/libraries');
        }
      })
      .catch((error) => console.error('Error adding library:', error));
  };

  const handleAddManager = (managerData) => {
    managerData.roleId=3
    console.log(managerData.roleId)
    fetch("http://localhost:3000/users", {
      method: 'POST',
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(managerData),
    })
      .then((response) => {
        console.log(response)
        if (response.ok) {
          console.log("Inspector added successfully");
        
        } else {
          console.error("Error adding manager:", response.statusText);
        }
      })
      .catch((error) => console.error("Error adding manager:", error));
  };

  const handleManagerSelect = (manager) => {
    setSelectedManager(manager);
    setShowManagerForm(false);
  };

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
          {selectedManager ? (
            <p>{selectedManager.username}</p>
          ) : (
            <button type="button" onClick={() => setShowManagerForm(!showManagerForm)}>
              {showManagerForm ? 'Hide Manager Form' : 'Select Manager'}
            </button>
          )}
        </div>
       
        <button type="submit">אישור</button>
      </form>
      {showManagerForm && <InspectorForm onSubmit={handleAddManager} />}
    </div>
  );
}

export default NewLibrary;
