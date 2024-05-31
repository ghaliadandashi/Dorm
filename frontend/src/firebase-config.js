import { initializeApp } from 'firebase/app';
import {getAuth, signInWithRedirect, OAuthProvider, getRedirectResult} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {useNavigate} from "react-router-dom";
import React, {useEffect} from "react";
import axios from "axios";
import LoadingPage from "./pages/LoadingPage";
import {useNotification} from "./layout/Notifications";

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
const storage = getStorage(app);
export { storage };

export const signInWithMicrosoft = () => {
    const microsoftProvider = new OAuthProvider('microsoft.com');
    signInWithRedirect(auth, microsoftProvider);
};
export const RedirectHandler = () => {
    const navigate = useNavigate();
    const {addNotification} = useNotification()
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
                        addNotification('Login Successful!','success')
                        navigate('/home');
                    })
                    .catch(error => {
                        // console.error('Failed to save user:', error);
                        addNotification('Login Failed!','error')
                        navigate('/home')
                    });
            })
            .catch((error) => {
                //console.error("Authentication error:", error.code, error.message);
            });
    }, [navigate]);

    return null;
};