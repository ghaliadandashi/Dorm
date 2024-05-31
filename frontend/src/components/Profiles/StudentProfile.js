import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../Auth/AuthHook';
import '../../styling/pages/profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import avatar from '../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp';

import ProfilePicSection from "./profilePicSection";
import Settings from "./settings";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
const StudentProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        phone: '',
    });
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const { user } = useAuth();
    const {t}= useTranslation()

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`, { withCredentials: true })
                .then(response => {
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob: response.data.user.dob,
                        phone: response.data.user.phoneNo,
                        profilePic: response.data.user.profilePic
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            axios.get('http://localhost:3001/booking/getBooking', { withCredentials: true })
                .then(response => {
                    setBookings(response.data);
                    console.log(response.data)
                }).catch(error => {
                    console.error('Failed to get Bookings: ', error)
                })
        }
    }, [user]);

    const getPrice = (booking) => {
        if (booking.stayDuration === 9) {
            return booking.room.pricePerSemester * 2;
        } else if (booking.stayDuration === 12) {
            return booking.room.pricePerSemester * 2 + (booking.room.summerPrice * 3);
        } else if (booking.stayDuration === 4.5) {
            return booking.room.pricePerSemester;
        } else {
            return booking.room.summerPrice * 3;
        }
    };

    const getStayDescription = (stayDuration) => {
        if (stayDuration === 9) {
            return '2 semesters';
        } else if (stayDuration === 12) {
            return '2 semesters + summer';
        } else if (stayDuration === 4.5) {
            return '1 semester';
        } else {
            return 'summer'
        }
    };
    const handleCancellation =()=>{

    }
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div className='profile'>
                <div className="tabs">
                    {profile.name.length < 20 ? <h2 style={{ color: "white" }}>@ {profile.name.toUpperCase()}</h2> :
                        <h3 style={{ color: "white" }}>@ {profile.name.toUpperCase()}</h3>}

                    <button onClick={() => handleTabClick('personalInfo')}
                        className={activeTab === 'personalInfo' ? 'active' : ''}>
                        {t('personalInfo')}
                    </button>
                    <button onClick={() => handleTabClick('bookings')}
                        className={activeTab === 'bookings' ? 'active' : ''}>
                        {t('bookingRequests')}
                    </button>
                    <button onClick={() => handleTabClick('settings')}
                        className={activeTab === 'settings' ? 'active' : ''}>
                        {t('settings')}
                    </button>
                </div>
                <div className="tab-content">
                    {activeTab === 'personalInfo' && (
                        <ProfilePicSection/>
                    )}
                    {activeTab === 'bookings' && (
                        <div style={{ display: "grid", gridTemplateColumns: '1fr 1fr', gap: '40px', margin: '40px 40px 0px 40px' }}>
                            {bookings.map(booking =>
                                <div style={{
                                    backgroundColor: "#46418d",
                                    borderRadius: '40px 40px 0px 40px',
                                    boxShadow: '1px 1px 5px #3a3a52',
                                    display: "grid",
                                    padding: '10px',
                                    paddingTop: '15px',
                                    gridTemplateColumns: '220px 1fr',
                                    alignItems: 'center',
                                    color: 'white',
                                    gap: '20px'
                                }}>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: 'center',
                                        borderRight: '1px dashed white'
                                    }}>
                                        <img src={booking.dorm.dormPics[0]} style={{ objectFit: "cover", width: '200px', height: '200px', borderRadius: '40px' }} />
                                        <p style={{ fontWeight: 'bold', fontSize: '25px' }}>{booking.dorm.dormName}</p>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column" }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: 'flex-start' }}>
                                                <span style={{ fontSize: '13px', marginBottom: '-10px' }}>{t('room')} </span>
                                                <p style={{ width: '100px', textAlign: "center", backgroundColor: 'white', color: "black", padding: '5px', borderRadius: '30px' }}>{t(`roomTypes.${booking.room.roomType}`)}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                                                <span style={{ fontSize: '13px', marginBottom: '-10px' }}>{t('status')} </span>
                                                <p style={{ width: '100px', textAlign: "center", backgroundColor: 'white', color: "black", padding: '5px', borderRadius: '30px' }}>{t(`bookingStats.${booking.status}`)}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                                                <span style={{ fontSize: '13px', marginBottom: '-10px' }}>{t('duration')} </span>
                                                <p style={{ width: '100px', textAlign: "center", backgroundColor: 'white', color: "black", padding: '5px', borderRadius: '30px' }}>{getStayDescription(booking.stayDuration)}</p>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: "column", alignItems: "flex-start" }}>
                                                <span style={{ fontSize: '13px', marginBottom: '-10px' }}>{t('price')} </span>
                                                <p style={{ width: '100px', textAlign: "center", backgroundColor: 'white', color: "black", padding: '5px', borderRadius: '30px' }}>{getPrice(booking)}</p>
                                            </div>
                                            <div style={{ display: 'flex',flexDirection:"column", alignItems:"flex-start"}}>
                                                <span style={{fontSize:'13px',marginBottom:'-10px'}}>{t('startDate')} </span>
                                                <p style={{width:'100px',textAlign:"center",backgroundColor:'white',color:"black",padding:'5px',borderRadius:'30px'}}>{booking.startDate.substring(0, booking.bookingDate.indexOf('T')).split('-').reverse().join('-')}</p>
                                            </div>
                                            <div style={{ display: 'flex',flexDirection:"column", alignItems:"flex-start"}}>
                                                <span style={{fontSize:'13px',marginBottom:'-10px'}}>{t('endDate')} </span>
                                                <p style={{width:'100px',textAlign:"center",backgroundColor:'white',color:"black",padding:'5px',borderRadius:'30px'}}>{booking.endDate.substring(0, booking.bookingDate.indexOf('T')).split('-').reverse().join('-')}</p>
                                            </div>
                                        </div>
                                        {booking.status !== 'Booked'?<FontAwesomeIcon onClick={handleCancellation} style={{color:"darkred",padding:'0px 10px',fontSize:'35px',alignSelf:"flex-end",backgroundColor:"white",borderRadius:'50px',cursor:"pointer"}} icon={faTimes}/>:null}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === 'settings' &&(
                        <Settings/>
                    )}
                </div>
            </div>
        </>
    );
}

export default StudentProfile;
