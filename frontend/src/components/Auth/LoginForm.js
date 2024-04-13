import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";
import {signInWithMicrosoft} from "../../firebase-config";


const LoginForm = () => {
    const MLogin= () => {
        return (
            <button onClick={signInWithMicrosoft} className='Mloginbtn'>Login in with Microsoft</button>
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
        const loginData = new FormData();

        Object.entries(loginForm).forEach(([key,value])=>{
            loginData.append(key,value)
        })

        axios.post('http://localhost:3001/api/login', loginData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role',response.data.role)
                localStorage.setItem('status',response.data.status)
                navigate('/home');
            })
            .catch(error => {
                console.error('Login failed:', error.response.data);
                setIsLoading(false);
                setError(error.response.data.message);
            });


    }

    if (isLoading) {
        return <LoadingPage />;
    }
    return (
        <>
            {error && <div className="error" style={{backgroundColor:"red",padding:'10px'}}>{error}</div>}
            <div className='loginform'>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='email'>
                        Email
                    </label>
                    <input type='email' id='email' name='email' value={loginForm.email} onChange={handleInputChange}/>
                    <label htmlFor='password' id='password'>
                        Password
                    </label>
                    <input type='password' id='password' name='password' value={loginForm.password} onChange={handleInputChange}/>
                    <input type='submit' value='Login' />
                </form>
                <h4>or</h4>
                <MLogin/>
            </div>
        </>
    )
}

export default LoginForm;