import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userContext } from "../src/App";

function Logout() {
  const navigate = useNavigate();
  const { setUser } = useContext(userContext);
  useEffect(() => {
    setUser(null);
    navigate("/login");
  }, [setUser, navigate]);
}
export default Logout;
