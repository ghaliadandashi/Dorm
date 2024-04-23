import React, {useEffect, useState} from 'react';
import '../../styling/components/dormOwnerProfile.css'
import {useAuth} from "../Auth/AuthHook";
import axios from "axios";


const DormOwnerProfile = () => {
    const {user, setUser} = useAuth()
    const [profile,setProfile] = useState({
        name:'',
        email:'',
        dob:'',
        phone:'',

    })
    const[bookings,setBookings] = useState([]);
    const [dorms,setDorm] =useState([])
    const [activeTab, setActiveTab] = useState('personalInfo');


    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`)
                .then(response => {
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob:response.data.user.dob,
                        phone:response.data.user.phoneNo
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            axios.get(`http://localhost:3001/api/dorm`)
                .then(response=>{
                    console.log(response)
                    setDorm(response.data);
                })
                .catch(error=>{console.error('Failed to get Dorms: ',error)})
            axios.get('http://localhost:3001/booking/getBooking')
                .then(response=>{
                    setBookings(response.data);
                    console.log(response.data)
                }).catch(error=>{
                    console.error('Failed to get Bookings: ',error)
            })
        }
    }, [user]);
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className='profile-container'>
        <div className="profile">
            <div className="tabs">
                <button onClick={() => handleTabClick('personalInfo')}
                        className={activeTab === 'personalInfo' ? 'active' : ''}>
                    Personal Info
                </button>
                <button onClick={() => handleTabClick('bookings')}
                        className={activeTab === 'bookings' ? 'active' : ''}>
                    Booking Requests
                </button>
                <button onClick={() => handleTabClick('properties')}
                        className={activeTab === 'properties' ? 'active' : ''}>
                    Properties
                </button>
                <button onClick={() => handleTabClick('financials')}
                        className={activeTab === 'financials' ? 'active' : ''}>
                    Financials
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'personalInfo' && (
                    <div>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Date of Birth:</strong> {profile.dob}</p>
                        <p><strong>Phone:</strong> {profile.phone}</p>
                    </div>
                )}
                {activeTab === 'bookings' && (
                    <table style={{display:"flex",flexDirection:"column",gap:'30px'}}>
                        {bookings.map((booking, index) => (
                            <tr>
                                <td key={index}>{booking.user.name.toUpperCase()}</td>
                                <td>{booking.dorm.dormName}</td>
                                <td>{booking.room.roomType}</td>
                                <td>{booking.startDate}</td>
                                <td>{booking.status}</td>
                                {(booking.status === 'Booked')?
                                    (<td><button>Reject</button></td>)
                                    :<>
                                        <td><button>Accept</button></td>
                                        <td><button>Reject</button></td>
                                    </>}
                            </tr>
                        ))}
                    </table>
                )}
                {activeTab === 'properties' && (
                    <ul>
                        {dorms.map((dorm, index) => (
                            <li key={index}>{dorm.dormName} - {dorm.location}</li>
                        ))}
                    </ul>
                )}
                {activeTab === 'financials' && (
                    <div>
                        <p>Financial details here...</p>
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default DormOwnerProfile;
