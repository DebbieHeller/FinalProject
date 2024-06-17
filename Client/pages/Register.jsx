import React, { useState, useContext } from 'react';
import { userContext } from '../src/App'
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';

function SignUp() {
  const { user, setUser } = useContext(userContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordVerify: '',
  });

  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordVerify) {
      alert('Passwords do not match');
      return;
    }
    if (formData.username == '') {
      alert('username must be full');
      return;
    }
    if (formData.password == '') {
      alert('password must be full');
      return;
    }

    fetch(`http://localhost:3000/users?username=${formData.username}`)
      .then(res => {
        if (res.status === 201) {
          setUser(formData)
          setIsRegistered(true)
          throw console.error()
        } else {
          return res.json()
        }
      })
      .then(() => {
          alert('Username in use')
          navigate('/login');
      })
      .catch(() => 
        console.log('sign-up')
      )
  };

  return (
    <div className='container'>
      {isRegistered ? <SignUp /> :
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Verify Password:
            <input type="password" name="passwordVerify" value={formData.passwordVerify} onChange={handleInputChange} />
          </label>
          <br />
          <button type="submit">Sign-up</button>
        </form>
      }
    </div >
  );
}

export default SignUp;





