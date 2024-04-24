import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios, { get } from "axios";
import { useAuth } from "../components/Auth/AuthHook";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import LoginForm from "../components/Auth/LoginForm";




const Navbar = () => {
    const { isLoggedIn, role, status } = useAuth();
    const currentPage = useLocation().pathname;
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [showLoginForm, setShowLoginForm] = useState(false);

    const handleLogout = () => {
        const auth = getAuth()
        const user = auth.currentUser
        if (user) {
            auth.signOut().then(() => navigate('/home'))
        }
        axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true })
            .then(() => {
                localStorage.clear();
                navigate('/home');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    if (status === 'Invalid' || status === 'Pending') {
        setTimeout(() => {
            handleLogout()
        }, 1000)

        return <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '30px', color: 'red' }}>ACCOUNT INVALID</div>
    }

    const handleSigninClick = () => {
        setShowLoginForm(true);
    };

    return (
        <>
            <nav style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignContent: "space-between", width: "100vw" }}>
                <Link to='/' style={{ color: "white", textDecoration: 'none' }}><h1>Dormy</h1></Link>

                <ul style={{ display: "flex", flexDirection: "row", listStyle: "none", justifyContent: "space-between", gap: '10px', textDecoration: 'none', margin: '25px 5px' }}>
                    {(isLoggedIn || status === 'Valid') ? (
                        <>
                            <li>
                                <Link to='/profile' style={{ color: "black", textDecoration: 'none' }}><Avatar size="small" icon={<UserOutlined />} /></Link>
                            </li>
                            {(role === 'admin') ? (
                                <li>
                                    <Link to='/loginreq' style={{ color: "black", textDecoration: 'none' }}>Login Requests</Link>
                                </li>
                            ) : (role !== 'dormOwner' && role !== null) ?
                                <li>
                                    <Link to='/bookings' style={{ color: "black", textDecoration: 'none' }}>Bookings</Link>
                                </li> : null}
                            <li>
                                <Link to='/contact' style={{ color: "black", textDecoration: 'none' }}>Contact Us</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}><LogoutOutlined /></button>
                            </li>
                        </>
                    ) : (
                        <>
                            {currentPage === '/register' ? (
                                <li>
                                    <Link to='/login' style={{ color: "black", textDecoration: 'none' }}>Sign-in</Link>
                                </li>) : currentPage === '/home' || currentPage === '/' ? (
                                    <>
                                        <li>
                                            <Link to='/login' style={{ color: "white", textDecoration: 'none' }}>Sign-in</Link>
                                        </li>
                                        <li>
                                            <Link to='/register' style={{ color: "white", textDecoration: 'none' }}>Register As Dorm Owner</Link>
                                        </li>
                                    </>) : (
                                        <li>
                                            <Link to='/register' style={{ color: "black", textDecoration: 'none' }}>Register As Dorm Owner</Link>
                                        </li>
                                    )}
                        </>
                    )}

                </ul>
            </nav>

            {showLoginForm && (
                <div className="popup">
                    <LoginForm onClose={() => setShowLoginForm(false)} />
                </div>
            )}
        </>
    );
}

export default Navbar;
