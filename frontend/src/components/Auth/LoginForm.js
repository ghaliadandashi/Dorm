import React from "react";
import '../../styling/components/authcomp.css'
const LoginForm = () => {

    return (
    <>
        <form method='post' className='form'>
            <label htmlFor='loginemail'>Email</label>
            <input type='email' id='loginemail'/>
            <label htmlFor='loginpass'>Password</label>
            <input type='password' id='loginpass'/>
            <input type='submit' value='Login'/>
        </form>
    </>
    )
}

export default LoginForm;