import React from 'react';
import LoginForm from "../components/Auth/LoginForm";
import Header from "../layout/Header";
import { Link } from "react-router-dom";
import "../styling/loginPage.css"

const Login = () =>{
    return(
        <>
        <div className='left-section'>
        <div className="dark-blue-content" style={{ textAlign: 'center', color: 'black', textDecoration: 'none' }}>
                    <h1 className="bold-text" style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '10px', marginTop: '300px', textAlign: 'left', color: 'white', textDecoration: 'none', marginRight: '700px' }}>Begin now</h1>
                    <p className="normal-text" style={{ fontSize: '2rem', color: '#999999', marginTop: '0', textAlign: 'left', textDecoration: 'none' }}>Find your dorm</p>
                    <div style={{ display: "flex", flexDirection: "column", marginRight: '700px' }}>
                        <button style={{ textDecoration: 'none', color: '#ffffff', padding: '10px 20px', marginTop: '20px', backgroundColor: 'transparent', border: '3px solid #ffffff', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>Sign-in</button>
                        <Link to='/register' style={{ textDecoration: 'none', color: '#ffffff', padding: '10px 20px', marginTop: '20px', backgroundColor: 'transparent', border: '3px solid #ffffff', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>Register As Dorm Owner</Link>
                    </div>
                </div>
                </div>
                <div className='right-section'></div>
            <LoginForm/>
        </>
    )
}

export default Login;
