import React from 'react';
import axios from "axios";
import '../../styling/components/authcomp.css'
const RegisterForm = () =>{
    const handleSubmit = () => {

    }
    return(
        <>
            <form method="post" className='form'>
                <label htmlFor='fname'>First Name </label>
                <input type='text' id='fname'/>
                <label htmlFor='lname'>Last Name </label>
                <input type='text' id='lname'/>
                <label htmlFor='email'>Email </label>
                <input type='email' id='email'/>
                <label htmlFor='nation'>Nationality</label>
                <select id='nation'>
                    <option></option>
                </select>
                <input type='submit' value='Register'/>
            </form>
        </>
    )
}


export default RegisterForm;