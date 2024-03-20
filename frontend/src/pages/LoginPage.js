import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import {Link} from "react-router-dom";
const Login = () =>{
    return(
        <>
            <div className='loginpage'>
                <LoginForm/>
                <Link to='/register' className='link' style={{paddingTop:10}}>Not Registered?</Link>
            </div>
        </>
    )
}

export default Login;