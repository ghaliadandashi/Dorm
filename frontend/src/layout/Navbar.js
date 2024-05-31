import React, {useEffect, useState} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faCog, faComments, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { getAuth } from "firebase/auth";
import axios from "axios";
import { useAuth } from "../components/Auth/AuthHook";
import LoginForm from "../components/Auth/LoginForm";
import '../styling/navbar.css';
import { useTranslation } from "react-i18next";

const Navbar = () => {
    // const [search, setSearch] = useState('');
    const { isLoggedIn, role, status } = useAuth();
    const currentPage = useLocation().pathname;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        'New dorm added to the website',
        'Price drop alert: Dorm A',
        'New review for Dorm B'
    ]);
    const [dorms, setDorms] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");

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

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/home?search=${searchQuery}`);
        }
        if (e.key === 'Escape') {
            navigate(`/home`);
        }
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
    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            try {
                const response = await fetch(`http://localhost:3001/dorms/searchDorm?dormName=${query}`);
                if (response.ok) {
                    const data = await response.json();
                    setDorms(data);
                } else {
                    throw new Error('Failed to fetch dorms by name');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            // Reset to the original dorm list if search query is empty
            const fetchDorms = async () => {
                try {
                    const response = await fetch(`http://localhost:3001/dorms/show`);
                    if (response.ok) {
                        const data = await response.json();
                        setDorms(data);
                    } else {
                        throw new Error('Failed to fetch dorms');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchDorms();
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link to='/' className="navbar-brand"><h1>Dormy</h1></Link>
                <input
                    className="search-bar"
                    type="search"
                    placeholder={t('searchDorm')}
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearch}
                />
                <ul className="navbar-nav">
                    {(isLoggedIn || status === 'Valid') ? (
                        <>
                            <li className="nav-item">
                                <Link to='/profile' className="nav-link"><FontAwesomeIcon icon={faUser} /></Link>
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
                                <button onClick={handleLogout} className="nav-link" style={{ backgroundColor: '#2b2b43', border: 'none', padding: '0px' }}><FontAwesomeIcon icon={faSignInAlt} /></button>
                            </li>
                        </>
                    ) : (
                        <>
                            {currentPage === '/register' ? (
                                <li className="nav-item">
                                    <Link to='/login' className="nav-link">{t('login')}</Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link to='/login' className="nav-link">{t('login')}</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link to='/register' className="nav-link">{t('registerDormOwner')}</Link>
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
};

export default Navbar;
