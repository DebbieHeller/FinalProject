import { BrowserRouter, Routes, Route } from "react-router-dom"
import React, { useEffect, useState, createContext } from 'react';
import './App.css'
import Layout from '../components/Layout'
import Login from "../pages/Login"
import Register from "../pages/Register"
import Books from "../pages/Books";

export const userContext = createContext();

function App() {
  const [user, setUser] = useState()

  return (
    <>
      <BrowserRouter>
        <userContext.Provider value={{ user, setUser }}>
          <Routes>
            {/* <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route> */}

            <Route path="/" element={<Layout />}>
              <Route index element={<Books />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>

            {/* <Route path="logout" element={<Logout />} />
            <Route path="users/:id/albums" element={<Albums />} />
            <Route path="users/:id/posts" element={<Posts />} />
            <Route path="users/:id/todos" element={<Todos />} />
            <Route path="info" element={<Info />} />

            <Route path="users/:userId/albums/:albumId" element={<Photos />} />
            <Route path="users/:userId/todos/:id" element={<Todo />} />
            <Route path="users/:userId/posts/:postId" element={<Post />} >
              <Route path="comments" element={<Comments />} >
                <Route path=":commentId" element={<Comment />} />
              </Route>
            </Route> */}

          </Routes>
        </userContext.Provider>
      </BrowserRouter>
    </>
  )
}

export default App
