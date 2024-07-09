import React, { useState } from "react";
const libraryId = parseInt(localStorage.getItem("libraryId"));
function UserForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    address: "",
    isWarned: false,
    password: "",
    roleId:2,
    libraryId:libraryId,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
    setFormData({
      username: "",
      phone: "",
      email: "",
      address: "",
      isWarned: false,
      password: ""
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
      </label>
      <label>
        Phone:
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
      </label>
      <label>
        Email:
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
      </label>
      <label>
        Address:
        <input type="text" name="address" value={formData.address} onChange={handleChange} required />
      </label>
      <label>
        Password:
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
      </label>
      {/* <label>
        Is Warned:
        <select name="isWarned" value={formData.isWarned} onChange={handleChange} required>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </select>
      </label> */}
      <button type="submit">אישור</button>
    </form>
  );
}

export default UserForm;
