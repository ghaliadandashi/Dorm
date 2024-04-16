import './App.css';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import Home from '../src/pages/HomePage';
import Header from "./layout/Header";
import React, {useEffect} from "react";
import Login from "./pages/LoginPage";
import {RedirectHandler} from "./firebase-config";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";
import {UserProvider} from "./components/Auth/AuthHook";
import ProtectedRoute from "./components/Auth/ProtectedRoute";



function App() {
    return (
        <UserProvider>
        <div className="App">
            <Router>
                <RedirectHandler/>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<ProtectedRoute element={Profile} />} />
                </Routes>

            </Router>
        </div>
        </UserProvider>
    );
}

export default App;
