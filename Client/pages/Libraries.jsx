import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../css/libraries.css";

function Libraries() {
  const navigate = useNavigate();
  const [libraries, setLibraries] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/libraries`, {
      method: 'GET',
      credentials: 'include'
    })
            .then((res) => res.json())
            .then((libraries) => {
              setLibraries(libraries);
            })
            .catch((error) => console.error('Error fetching libraries:', error));
  }, []);

  const handleAddLibrary = () => {
    navigate('/admin-home/new-library');
  };

  return (
    <div className="Libraries">
      <h1>Libraries</h1>
      <button onClick={handleAddLibrary}>הוספת ספריה</button>
      <table className="Libraries-table">
        <thead>
          <tr>
            <th>שם ספרייה</th>
            <th>כתובת</th>
            <th>טלפון</th>
            <th>מנהל ספרייה</th>
          </tr>
        </thead>
        <tbody>
          {libraries.map(library => (
            <tr key={library.id}>
              <td>{library.libraryName}</td>
              <td>{library.address}</td>
              <td>{library.phone}</td>
              <td>{library.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Libraries;
