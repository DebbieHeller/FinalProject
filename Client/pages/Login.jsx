import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../src/App';
import '../css/signUp&Login.css'; // Import the CSS file

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then(res => {
        if (res.status !== 201) {
          alert('The username or password is not correct');
          throw new Error('Failed to login');
        } else {
          return res.json();
        }
      })
      .then(data => {
        setUser(data);
        navigate('/home');
      })
      .catch(() => 
        console.log('error')
      );
  };

  return (
    <div className='container'>
      <h1 className='title'>Login</h1>
      <form className='form' onSubmit={handleSubmit}>
        <label className='form-label'>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleInputChange} className='form-input' />
        </label>
        <br />
        <label className='form-label'>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} className='form-input' />
        </label>
        <br />
        <button type="submit" className='submit-button'>Login</button>
      </form>
    </div>
  );
}

export default Login;
