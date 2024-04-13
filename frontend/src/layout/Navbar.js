import React, {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import {getAuth, onAuthStateChanged} from "firebase/auth";

const Navbar = () => {
    const role = localStorage.getItem('role');
    const status = localStorage.getItem('status');
    const icon = <FontAwesomeIcon icon={faUser} />;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const currentPage = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            if(user){
                setIsLoggedIn(true)
            }else{
                setIsLoggedIn(false)
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = ()=>{
        const auth = getAuth();
        auth.signOut().then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('status');
            setIsLoggedIn(false);
            navigate('/home');
        }).catch((error) => {
            console.error('Firebase Logout Error:', error);
        });
    }

    if(status === 'Invalid' || status === 'Pending'){
        handleLogout();
    }


    return(
        <>
            <nav style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignContent:"space-between", width:"100vw"}}>
                <Link to='/' style={{color:"black",textDecoration:'none'}}><h1>Dorms</h1></Link>
                <ul style={{display:"flex", flexDirection:"row", listStyle:"none", justifyContent:"space-between", gap:'10px',textDecoration:'none', margin:'25px 5px'}}>
                    {(isLoggedIn || status==='Valid') ? (
                        <>
                            <li>
                                <Link to='/profile' style={{color:"black",textDecoration:'none'}}>{icon}</Link>
                            </li>
                            {(role === 'admin')?(
                                <li>
                                    <Link to='/loginreq' style={{color:"black",textDecoration:'none'}}>Login Requests</Link>
                                </li>
                            ):(role ==='dormOwner')? (
                                <>
                                    <li>
                                        <Link to='/bookingreq' style={{color:"black",textDecoration:'none'}}>Booking Requests</Link>
                                    </li>
                                    <li>
                                        <Link to='/dorms' style={{color:"black",textDecoration:'none'}}> My Dorms</Link>
                                    </li>
                                </>
                            ): <li>
                                <Link to='/bookings' style={{color:"black",textDecoration:'none'}}>Bookings</Link>
                            </li>}
                            <li>
                                <Link to='/contact' style={{color:"black",textDecoration:'none'}}>Contact Us</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Logout</button>
                            </li>
                        </>
                    ):(
                        <>
                            {currentPage === '/register' ? (
                                <li>
                                    <Link to='/login' style={{ color: "black", textDecoration: 'none' }}>Login</Link>
                                </li> ) : currentPage === '/home' || currentPage === '/' ? (
                                <>
                                    <li>
                                        <Link to='/login' style={{ color: "black", textDecoration: 'none' }}>Login</Link>
                                    </li>
                                    <li>
                                        <Link to='/register' style={{ color: "black", textDecoration: 'none' }}>Register As Dorm Owner</Link>
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
        </>
    );
}

export default Navbar;
