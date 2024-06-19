import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useState, createContext } from "react";
import "./App.css";
import Layout from "../components/Layout";
import HomeLayout from "../components/HomeLayout";
import Home from "../components/Home"
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Books from "../pages/Books";
import Messages from "../pages/Messages";
import UserBorrows from "../pages/UserBorrows";
import UserBooks from "../pages/UserBooks";
import NewBorrow from "../pages/NewBorrow";
import Logout from "../components/Logout";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState();

  return (
    <>
      <BrowserRouter>
        <userContext.Provider value={{ user, setUser }}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Books />} />
              <Route path="login" element={<Login />} />
              <Route path="sign-up" element={<SignUp />} />
            </Route>

            <Route path="/home" element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path="logout" element={<Logout />} />
              <Route path="messages" element={<Messages />} />
              <Route path="user-borrows" element={<UserBorrows />} />
              <Route path="user-books" element={<UserBooks />} />
              <Route path="new-borrow" element={<NewBorrow />} />

              {/* <Route
                path="users/:userId/albums/:albumId"
                element={<Photos />}
              />
              <Route path="users/:userId/todos/:id" element={<Todo />} />
              <Route path="users/:userId/posts/:postId" element={<Post />}>
                <Route path="comments" element={<Comments />}>
                  <Route path=":commentId" element={<Comment />} />
                </Route>
              </Route> */}
            </Route>
          </Routes>
        </userContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
