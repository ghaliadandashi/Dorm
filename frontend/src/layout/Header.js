import React from "react";
import '../styling/layout.css'
import Navbar from '../layout/navbar'
const Header = () =>{
    return(
        <>
            <header className='homeheader'>
                <h1>Dorms</h1>
                <Navbar/>
            </header>
        </>
    )
}

export default Header;