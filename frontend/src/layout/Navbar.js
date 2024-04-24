import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faSearch , faCog, faComments, faBell} from '@fortawesome/free-solid-svg-icons';
import {getAuth} from "firebase/auth";
import axios, {get} from "axios";
import {useAuth} from "../components/Auth/AuthHook";
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import '../styling/navbar.css'

const Navbar = () => {
    const { isLoggedIn, role, status } = useAuth();
    const icon = <FontAwesomeIcon icon={faUser} />;
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
            <div className='search'>
                <input className="search-bar" type="search" placeholder="Explore" />
                <FontAwesomeIcon icon={faSearch} className='nav-link'/>
            </div>
            <ul className="navbar-nav">
                {(isLoggedIn || status==='Valid') ? (
                    <>
                    <li className="nav-item">
                    <Link to='/profile' className="nav-link">{icon}</Link>
                    </li>
            {(role === 'admin')?(
                    <li className="nav-item">
                        <Link to='/loginreq' className="nav-link">Login Requests</Link>
                    </li>
                ):null}
                <li className="nav-item">
                    <Link to='/settings' className="nav-link"><FontAwesomeIcon icon={faCog}/></Link>
                </li>
                        <li className="nav-item">
                            <Link to='/chat' className="nav-link"><FontAwesomeIcon icon={faComments}/></Link>
                        </li>
                        <li className="nav-item">
                            <Link to='/notifications' className="nav-link"><FontAwesomeIcon icon={faBell}/></Link>
                        </li>
                <li className="nav-item">
                    <button onClick={handleLogout} className="nav-link" style={{backgroundColor:'#2b2b43',border:'none'}}><FontAwesomeIcon icon={faSignInAlt}/></button>
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