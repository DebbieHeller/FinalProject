import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/newLibrary.css";
import UserForm from "../components/UserForm"; 
import "../css/inspectors.css";

function NewLibrary() {
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [libraryId, setLibraryId] = useState(null);

  const handleLibrarySubmit = async () => {
    const newLibrary = {
      libraryName: libraryName,
      address: address,
      phone: phone,
    };

    try {
      const response = await fetch('http://localhost:3000/libraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newLibrary)
      });
      const data = await response.json();
      setLibraryId(data);
      return data;
    } catch (error) {
      console.error('Error adding library:', error);
      throw error;
    }
  };

  const handleAddManager = async (managerData) => {
    try {
      const libraryId = await handleLibrarySubmit();
      managerData.roleId = 2;
      managerData.libraryId = libraryId;

      const response = await fetch("http://localhost:3000/users", {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(managerData),
      });
      const data = await response.json();
     
      navigate('/admin-home/libraries');
    } catch (error) {
      console.error("Error adding manager:", error);
    }
  };

  return (
    <div className="newLibrary-container">
      <h1>הוספת ספרייה חדשה</h1>
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
      <div className='add-inspector-form'>
      <UserForm onSubmit={handleAddManager} />
      </div>
    </div>
  );
}

export default NewLibrary;
