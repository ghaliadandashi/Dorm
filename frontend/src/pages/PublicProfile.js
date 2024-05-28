import React, { useEffect, useState } from 'react';
import {Link, useParams} from 'react-router-dom';
import axios from 'axios';
import Header from '../layout/Header';
import noImage from '../images/1554489-200.png';
import '../styling/pages/publicProfile.css'
const PublicProfile = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/getPublicProf/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, [userId]);


    return (
        <>
            <Header />
            <div className="public-profile">
                <div className="profile-header">
                    <img src={userData?.profilePic || noImage} alt="Profile" width="150" height="150" style={{ borderRadius: '50%' ,objectFit:'cover'}} />
                    <h1>{userData?.name}</h1>
                    <p></p>
                </div>
                <div className="profile-details">
                    <h2>Contact Information</h2>
                    <p>Email: {userData?.email}</p>
                    <p>Phone: {userData?.phoneNo}</p>
                </div>
            </div>
        </>
    );
}

export default PublicProfile;

