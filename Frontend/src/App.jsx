import React, { useState } from 'react'
import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/landing/landing.jsx';
import Login from './components/auth/login.jsx';
import Register from './components/auth/register.jsx';
import Home from './components/Home/home.jsx';
import Profile from './components/Pages/profile.jsx';
import Message from './components/Pages/message.jsx';
import Screen from './components/Pages/Screen.jsx';
import Create from './components/Pages/createPost.jsx';
import Notifications from './components/Pages/Notifications.jsx';
import Search from './components/Pages/Search.jsx';
import OtherUser from './components/Pages/otherUser.jsx';
import OrionAI from './components/Pages/explore.jsx';
import Talk from './components/Pages/Talk.jsx';
import CreateImage from './components/Pages/image.jsx';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
{/* =============================== HOME ELEMENT ================================== */}
                <Route path="/home" element={<Home />}>
                  <Route index element={<Screen />} />
                   <Route path="profile" element={<Profile />} />
                   <Route path="message" element={<Message /> } />
                   <Route path="screen" element={<Screen /> } />
                   <Route path="create" element={<Create /> } />
                   <Route path="explore" element={<OrionAI /> } />
                   <Route path="notification" element={<Notifications /> } />
                   <Route path="search" element={<Search /> } />
                   <Route path="otherUser/:id" element={<OtherUser />} />
                   <Route path="talk" element={<Talk />} />
                   <Route path="image" element={<CreateImage />} />
                   <Route />
                </Route>
{/* =============================== ALL CHILDRENS ================================== */}
            </Routes>
        </BrowserRouter>
    )
}

export default App;
