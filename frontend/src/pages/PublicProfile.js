import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Header from '../layout/Header';
import noImage from '../images/1554489-200.png';
import '../styling/pages/publicProfile.css';

const PublicProfile = () => {
    const { userId } = useParams();
    const { t } = useTranslation();
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/getPublicProf/${userId}`,{withCredentials:true});
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
                    <img src={userData?.profilePic || noImage} alt="Profile" className="profile-image" />
                    <h1>{userData?.name}</h1>
                </div>
                <div className="profile-details">
                    <h2>{t('contactInformation')}</h2>
                    <p>{t('email')}: {userData?.email}</p>
                    <p>{t('phone')}: {userData?.phoneNo}</p>
                    <p>{t('bio')}:{userData?.bio??'----'}</p>
                    <h2>{t('preferences')}</h2>
                    <ul>
                        {userData?.preferences?.length > 0 ? userData.preferences.map((preference, index) => (
                            <li key={index}>{preference}</li>
                        )) : <p>{t('noPreferencesListed')}</p>}
                    </ul>

                </div>
            </div>
        </>
    );
}

export default PublicProfile;
