import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userId,setUserId]=useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), user => {
            if(user){
                setIsLoggedIn(true)
                setUser(user)
                setRole('student');
            }else{
                setIsLoggedIn(false)
                try{

                    axios.get('http://localhost:3001/api/validate', { withCredentials: true })
                        .then(response => {
                            if (response.status === 200) {
                                setIsLoggedIn(true);
                                setUser(response.data.user)
                                setUserId(response.data.user.userId)
                                setRole(response.data.user.role)
                                setStatus(response.data.user.status)
                                setEmail(response.data.user.email)
                            }
                        })
                        .catch(() => {
                            setIsLoggedIn(false);
                            // window.location.reload();

                        });
                }catch (error){
                    console.error('Session verification failed:', error);
                    setIsLoggedIn(false);
                    setUser(null);
                    
                }
            }
        })


        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ user, userId, role, status, isLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);
