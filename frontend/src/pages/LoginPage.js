import React from 'react';
import LoginForm from "../components/Auth/LoginForm";
import '../styling/pages/LoginPage.css';
import {Link} from "react-router-dom";

const Login = () => {
    return (
        <div className='loginBody'>
            <div className="loginContainer">
                <div className="leftContent">
                    <h1>Begin now</h1>
                    <p>Find your dorm</p>
                </div>
                <div className="rightContent">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;
