import './App.css';
import { BrowserRouter as Router, Route , Routes} from 'react-router-dom';
import Home from '../src/pages/HomePage';
import React from "react";
import Login from "./pages/LoginPage";
import {RedirectHandler} from "./firebase-config";
import Register from "./pages/RegisterPage";
import Profile from "./pages/ProfilePage";
import {UserProvider} from "./components/Auth/AuthHook";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import DormDetails from "./pages/DormDetailsPage";
import ChatPage  from './pages/ChatPage';
import {NotificationProvider} from "./layout/Notifications";
import { I18nextProvider } from "react-i18next";
import i18n from './i18n';
import PublicProfile from "./pages/PublicProfile";


function App() {
    return (
        <I18nextProvider i18n={i18n}>
        <NotificationProvider>
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
                    <Route path='/dormDetails' element={<DormDetails/>}/>
                    <Route path="/chat" element={<ChatPage />}/>
                    <Route path="/user/:userId" element={<PublicProfile />} />
                </Routes>

            </Router>
        </div>
        </UserProvider>
        </NotificationProvider>
        </I18nextProvider>
    );
}

export default App;
