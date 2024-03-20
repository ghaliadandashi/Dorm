import React from "react";
import '../styling/layout.css'
import {Link} from "react-router-dom";

const Navbar = () =>{
    return(
        <>
            <div className='links'>
                <Link to='/login' className='link'>Login</Link>
                <Link to='/register' className='link'>Register As Dorm Owner</Link>
            </div>
        </>
    )
}

export default Navbar;