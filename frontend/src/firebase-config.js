import { initializeApp } from 'firebase/app';
import {getAuth, signInWithRedirect, OAuthProvider, getRedirectResult} from 'firebase/auth';
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

const firebaseConfig = {
    apiKey: "AIzaSyDaFEUXYBDVw6V2cn6Wsq7kKyJf3MurorA",
    authDomain: "dorm-2aa81.firebaseapp.com",
    projectId: "dorm-2aa81",
    storageBucket: "dorm-2aa81.appspot.com",
    messagingSenderId: "721866043021",
    appId: "1:721866043021:web:9bd310bdba5452930abcc4",
    measurementId: "G-5LPGVKYFCL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const signInWithMicrosoft = () => {
    const microsoftProvider = new OAuthProvider('microsoft.com');
    signInWithRedirect(auth, microsoftProvider);
};
export const RedirectHandler = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        getRedirectResult(auth)
            .then((result) => {
                const { uid, email, displayName } = result.user;
                axios.post('http://localhost:3001/api/user', {
                    uid,
                    email,
                    name: displayName,
                },{withCredentials:true})
                    .then(response => {
                        console.log('User saved to database:', response.data);
                        navigate('/home');
                    })
                    .catch(error => {
                        // console.error('Failed to save user:', error);
                        navigate('/home')
                    });
            })
            .catch((error) => {
                //console.error("Authentication error:", error.code, error.message);
            });
    }, [navigate]);

    return null;
};