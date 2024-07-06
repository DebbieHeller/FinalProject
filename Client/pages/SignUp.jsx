import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../src/App";
import "../css/signUp&Login.css"; // Import the CSS file

function SignUp() {
  const libraryId = localStorage.getItem("libraryId");
  const { setUser } = useContext(userContext);
 

  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
    subscriptionTypeId: 1,
    roleId: 4,
    libraryId: libraryId,
    password: "",
    passwordVerify: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordVerify) {
      alert("Passwords do not match");
      return;
    }
    if (
      !formData.username ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.subscriptionTypeId ||
      !formData.password
    ) {
      alert("All fields must be filled");
      return;
    }

    fetch("http://localhost:3000/signUp", {
      method: "POST",
      credentials: 'include',
      body: JSON.stringify(formData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => {
        console.log(res.status);
        if (res.status !== 201) {
          alert("Invalid username");
          throw new Error("Failed to register");
        } else {
          return res.json();
        }
      })
      .then(data => {
        setUser({ id: data.id, ...formData });
        navigate("/home");
      })
      .catch((error) => console.log("Error:", error));
  };

  return (
    <div className="container">
      <h1 className="title">Sign Up</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Email:
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Subscription Type:
          <select
            name="subscriptionTypeId"
            value={formData.subscriptionTypeId}
            onChange={handleSelectChange}
            className="form-select"
          >
            <option value="1">משפחתי</option>
            <option value="2">זוגי</option>
          </select>
        </label>
        <br />
        <label className="form-label">
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <label className="form-label">
          Verify Password:
          <input
            type="password"
            name="passwordVerify"
            value={formData.passwordVerify}
            onChange={handleInputChange}
            className="form-input"
          />
        </label>
        <br />
        <button type="submit" className="submit-button">
          Sign-up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
