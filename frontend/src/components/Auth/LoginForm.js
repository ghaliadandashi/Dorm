import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";
import {signInWithMicrosoft} from "../../firebase-config";
import {WindowsFilled} from "@ant-design/icons";
import {Alert, Spin} from "antd";
import '../../styling/components/LoginForm.css'


const LoginForm = () => {
    const MLogin= () => {
        return (
            <button onClick={signInWithMicrosoft} className='Mloginbtn'><WindowsFilled /> Login in with Microsoft</button>
        );
    }
    const [loginForm , setLoginForm] = useState({
        email: '',
        password: ''
    })
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const handleInputChange = (e)=>{
        const {name, value} = e.target;
        setLoginForm(prevData =>({
            ...prevData,
            [name] :value
        }));
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        setIsLoading(true);

        axios.post('http://localhost:3001/api/login', loginForm, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                navigate('/home');
                window.location.reload();
            })
            .catch(error => {
                console.error('Login failed:', error.response?.data?.message || 'Error during login');
                setIsLoading(false);
                setError(error.response?.data?.message || 'General login error');
            });
    }

    if (isLoading) {
        return <Spin />;
    }
    return (
        <>
            <div className='loginForm'>
                <form onSubmit={handleSubmit}>
                    <h2>Sign in.</h2>
                    <input type='email' id='email' name='email' placeholder='Enter your email' value={loginForm.email} onChange={handleInputChange}/>
                    <input type='password' id='password'  placeholder='Enter your password' name='password' value={loginForm.password} onChange={handleInputChange}/>
                    <input type='submit' value='Login' />
                    {error?<Alert type='error' message={error} closable />:null }
                </form>
                <MLogin/>
            </div>
        </>
    )
}

export default LoginForm;