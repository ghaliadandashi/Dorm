import React from "react";
import '../styling/layout.css'
import Navbar from "./Navbar";

const Header = () =>{
    return(
        <>
            <div className='header'>
                <Navbar/>
            </div>
        </>
    )
}

export default Header;