import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {getAuth, onAuthStateChanged} from "firebase/auth";
import axios, {get} from "axios";
import {useAuth} from "../components/Auth/AuthHook";
import {LogoutOutlined, UserOutlined} from "@ant-design/icons";
import {Avatar} from "antd";
import '../styling/navbar.css'

const Navbar = () => {
    const { isLoggedIn, role, status } = useAuth();
    // const icon = <FontAwesomeIcon icon={faUser} />;
    const currentPage = useLocation().pathname;
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const handleLogout = () => {
        const auth = getAuth()
        const user = auth.currentUser
        if(user){
            auth.signOut().then(()=>navigate('/home'))
        }
        axios.post('http://localhost:3001/api/logout', {},{withCredentials: true})
            .then(() => {
                localStorage.clear();
                navigate('/home');
                window.location.reload();
            })
            .catch((error) => {
                console.error('Logout Error:', error);
            });
    };

    if(status === 'Invalid'|| status === 'Pending'){
        setTimeout(()=>{
            handleLogout()
        },1000)

        return <div style={{height:'100vh',width:'100vw',display:'flex',justifyContent:'center',alignItems:'center',fontWeight:'bold',fontSize:'30px',color:'red'}}>ACCOUNT INVALID</div>
    }

    return(
        <>
        <nav className="navbar">
            <Link to='/' className="navbar-brand"><h3>Dorms</h3></Link>
            <input className="search-bar" type="search" placeholder="Explore" />
            <ul className="navbar-nav">
                {(isLoggedIn || status==='Valid') ? (
                    <>
                    <li className="nav-item">
                    <Link to='/profile' className="nav-link"><Avatar size="small" icon={<UserOutlined />}/></Link>
                    </li>
            {(role === 'admin')?(
                    <li className="nav-item">
                        <Link to='/loginreq' className="nav-link">Login Requests</Link>
                    </li>
                ):(role !== 'dormOwner' && role !== null)?
                    <li className="nav-item">
                        <Link to='/bookings' className="nav-link">Bookings</Link>
                    </li>:null}
                <li className="nav-item">
                    <Link to='/contact' className="nav-link">Contact Us</Link>
                </li>
                <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link"><LogoutOutlined /></button>
                </li>
            </>
            ):(
        <>
            {currentPage === '/register' ? (
                <li className="nav-item">
                    <Link to='/login' className="nav-link">Login</Link>
                </li>
            ) : currentPage === '/home' || currentPage === '/' ? (
                <>
                    <li className="nav-item">
                        <Link to='/login' className="nav-link">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link to='/register' className="nav-link">Register As Dorm Owner</Link>
                    </li>
                </>
            ) : (
                <li className="nav-item">
                    <Link to='/register' className="nav-link">Register As Dorm Owner</Link>
                </li>
            )}
        </>
    )}
</ul>
</nav>
</>
);
}

export default Navbar;