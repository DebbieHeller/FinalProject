import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../src/App';

function SignUp() {
    const { setUser } = useContext(userContext);
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        email: '',
        address: '',
        subscriptionTypeId: null,
        roleId: null,
        libraryId: null,
        paymentId: null,
        passwordId: null,
        password: '',
        passwordVerify: '',
    });

    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
        setFormData(prevState => ({ ...prevState, subscriptionTypeId: parseInt(value, 10) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.passwordVerify) {
            alert('Passwords do not match');
            return;
        }
        if (!formData.username || !formData.phone || !formData.email || !formData.address || !formData.subscriptionTypeId || !formData.password) {
            alert('All fields must be filled');
            return;
        }

        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify({
                ...formData,
                roleId: 1,  // Assuming a default roleId, this should be dynamic
                libraryId: 1,  // Assuming a default libraryId, this should be dynamic
                paymentId: 1,  // Assuming a default paymentId, this should be dynamic
                passwordId: 1,  // Assuming a default passwordId, this should be dynamic
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then(res => {
            if (res.status !== 201) {
                alert('Invalid username');
                throw new Error('Failed to register');
            }
            return res.json();
        })
        .then(user => {
            setUser(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Registration successful');
            navigate('/home');
        })
        .catch(error => console.log('Error:', error));
    };

    return (
        <div className='container'>
            <h1>Sign Up</h1>
            <form className="form" onSubmit={handleSubmit}>
                <label>
                    Username:
                    <input type="text" name="username" value={formData.username} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Phone:
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Address:
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
                </label>
                <br />
                <label>
                    Subscription Type:
                    <select name="subscriptionType" value={formData.subscriptionTypeId} onChange={handleSelectChange}>
                        <option value="">Select</option>
                        <option value="1">זוגי</option>
                        <option value="2">משפחתי</option>
                    </select>
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
        </div>
    );
}

export default SignUp;
