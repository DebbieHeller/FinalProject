import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import "../css/home.css";

function Inspectors() {
  const roleId = 3;

useEffect(() => {
  fetch(`http://localhost:3000/users?roleId=${roleId}`, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => console.error("Error fetching books:", error));
}, []);

  return (
    <>
    <h1>Inspectors</h1>
    </>
  );
}

export default Inspectors;
