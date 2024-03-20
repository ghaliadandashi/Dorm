import React from "react";
import RegisterForm from "../components/Auth/RegisterForm";
import {Link} from "react-router-dom";
import Header from "../layout/Header";
import Navbar from "../layout/navbar";
import '../styling/pages/registerpage.css'

const Register = ()=>{
    return(
        <>
            <div className='registerpage'>
                <header>
                    <h1>Registration</h1>
                </header>
                <RegisterForm/>
                <Link to='/login' className='link' style={{paddingTop:10}}>Already Registered?</Link>
            </div>
        </>
    )
}

export default Register;