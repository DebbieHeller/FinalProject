import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../src/App";

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);

  useEffect(() => {
    fetch(`http://localhost:3000/logout`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(() => {
        setUser(null)
        navigate("/");
      })
      .catch((error) => console.error('Error fetching user', error));
  }, [setUser, navigate]);
}
export default Logout;
