import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faCog, faComments, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../components/Auth/AuthHook";
import LoginForm from "../components/Auth/LoginForm";
import '../styling/navbar.css';

const Navbar = () => {
    const { isLoggedIn, role, status } = useAuth();
    const currentPage = useLocation().pathname;
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        'New dorm added to the website',
        'Price drop alert: Dorm A',
        'New review for Dorm B'
    ]);

    useEffect(() => {
        if (sessionStorage.getItem('reloadAfterLogout')) {
            sessionStorage.removeItem('reloadAfterLogout');
            navigate('/home');
        }
    }, [navigate]);

    const handleLogout = () => {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            auth.signOut().then(() => navigate('/home'));
        }
        axios.post('http://localhost:3001/api/logout', {}, { withCredentials: true })
            .then(() => {
                localStorage.clear();
                sessionStorage.setItem('reloadAfterLogout', 'true');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    if (status === 'Invalid' || status === 'Pending') {
        setTimeout(() => {
            handleLogout();
        }, 1000);
    }

    const handleSigninClick = () => {
        setShowLoginForm(true);
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <>
            <nav className="navbar">
                <Link to='/' className="navbar-brand"><h1>Dormy</h1></Link>
                <input className="search-bar" type="search" placeholder="Explore" />
                <ul className="navbar-nav">
                    {(isLoggedIn || status === 'Valid') ? (
                        <>
                            <li className="nav-item">
                                <Link to='/profile' className="nav-link"><FontAwesomeIcon icon={faUser} /></Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/settings' className="nav-link"><FontAwesomeIcon icon={faCog} /></Link>
                            </li>
                            <li className="nav-item">
                                <Link to='/chat' className="nav-link"><FontAwesomeIcon icon={faComments} /></Link>
                            </li>
                            <li className="nav-item">
                                <div className="notification-wrapper">
                                    <FontAwesomeIcon icon={faBell} className="nav-link" onClick={toggleNotifications} />
                                    {showNotifications && (
                                        <div className="notifications-box">
                                            <ul>
                                                {notifications.map((notification, index) => (
                                                    <li key={index}>{notification}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="nav-link" style={{ backgroundColor: '#2b2b43', border: 'none' }}><FontAwesomeIcon icon={faSignInAlt} /></button>
                            </li>
                        </>
                    ) : (
                        <>
                            {currentPage === '/register' ? (
                                <li className="nav-item">
                                    <Link to='/login' className="nav-link">Login</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to='/login' className="nav-link">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/register' className="nav-link">Register As Dorm Owner</Link>
                                    </li>
                                </>
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
