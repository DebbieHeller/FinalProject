import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../src/App';

function CompleteRegistration() {
    const navigate = useNavigate();
    const { user, setUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        username: user.username,
        email: '',
        phone: '',
        city: '',
        street: '',
        buildingNum: 0,
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.username == '') {
            alert('username must be full');
            return;
        }
        if (formData.email == '') {
            alert('email must be full');
            return;
        }
        if (formData.city == '') {
            alert('city must be full');
            return;
        }
        if (formData.password == '') {
            alert('password must be full');
            return;
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(res => {
                if (res.status !== 201) {
                  alert('Invalid username')
                  throw console.error();
                } 
              })
            .then(() => {
                setUser(formData);
                localStorage.setItem('currentUser', JSON.stringify(formData));
                alert('Registration successful');
                navigate('/home');
            })
            .catch(() => 
                console.log('error')
            )
    }

    return (
        <div className='complete-div'>
            <h1>Continue registration</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    City:
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Street:
                    <input type="text" name="street" value={formData.street} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Building num:
                    <input type="text" name="buildingNum" value={formData.buildingNum} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    password:
                    <input type="text" name="password" value={formData.password} onChange={handleInputChange} />
                </label>
                <br />
                <button type="submit">Complete Registration</button>
            </form>
        </div>
    )
}

export default CompleteRegistration