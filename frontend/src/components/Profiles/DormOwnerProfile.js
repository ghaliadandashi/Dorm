import React, {useEffect, useState} from 'react';
import '../../styling/pages/profile.css'
import {useAuth} from "../Auth/AuthHook";
import axios from "axios";
import avatar from '../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes,faBed,faHouse,faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modal";
const DormOwnerProfile = () => {
    const {user, setUser} = useAuth()
    const [profile,setProfile] = useState({
        name:'',
        email:'',
        dob:'',
        phone:'',
        profilePic:''
    })
    const[bookings,setBookings] = useState([]);
    const [dorms,setDorm] =useState([])
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); // Start with null to indicate no content is ready

    const handleOpenModal = (type) => {
        const contents = {
            room: {
                title: 'Add Room',
                initialData: { dorm: '', roomType: 'Double', pricePerSemester: '', summerPrice: '', viewType: 'Hall', numberOfRooms: '' },
                fields: [
                    { name: 'dorm', label: 'Dorm: ', type: 'select', options: dorms.map(dorm=>({
                            value:dorm.dormName,label:dorm.dormName
                        })) },
                    { name: 'roomType', label: 'Room Type: ', type: 'select',
                        options:[
                            {value:'Double',label: 'Double'},
                            {value:'Single',label: 'Single'},
                            {value:'Triple',label:'Triple'},
                            {value:'Quad',label: 'Quad'},
                            {value:'Suite',label:'Suite'},
                            {value:'Studio',label:'Studio'}
                        ] },
                    { name: 'pricePerSemester', label: 'Price per Semester($): ', type: 'number' },
                    {name:'summerPrice',label: 'Summer Price ($ per month): ',type: 'number'},
                    {name:'viewType',label:'View Type: ',type: 'select',
                        options: [{value: 'CityView',label:'City View'},
                            {value: 'StreetView',label:'Street View'},
                            {value: 'SeaView',label:'Sea View'},
                            {value: 'CampusView',label:'Campus View'}
                        ]},
                    {name:'space',label:'Room space:(m^2)',type:'number'},
                    {name:'extraFee',label:'Extra fee for View($): ',type: 'number'},
                    {name:'noOfRooms',label:'Number of Rooms: ',type: 'number'}
                ]
            },
            dorm: {
                title: 'Add Dorm',
                initialData: { dormName: '', location: '' },
                fields: [
                    { name: 'dormName', label: 'Dorm Name', type: 'text' },
                    { name: 'location', label: 'Location', type: 'text' }
                ]
            }
        };

        setModalContent(contents[type]);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log(formData);
        setIsModalOpen(false);
        setModalContent(null); // Reset modal content
    };
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`,{withCredentials:true})
                .then(response => {
                    // console.log(response.data)
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob:response.data.user.dob,
                        phone:response.data.user.phoneNo,
                        profilePic:response.data.user.profilePic
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            axios.get(`http://localhost:3001/api/dorm`,{withCredentials:true})
                .then(response=>{
                    // console.log(response)
                    setDorm(response.data);
                })
                .catch(error=>{console.error('Failed to get Dorms: ',error)})
            axios.get('http://localhost:3001/booking/getBooking',{withCredentials:true})
                .then(response=>{
                    setBookings(response.data);
                    // console.log(response.data)
                }).catch(error=>{
                    console.error('Failed to get Bookings: ',error)
            })
        }
    }, [user]);
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleStatus = ()=>{

    }

    return (
        <div className="profile">
            <div className="tabs">
                {profile.name.length<20?<h2 style={{color:"white"}}>@ {profile.name.toUpperCase()}</h2>:
                    <h3 style={{color:"white"}}>@ {profile.name.toUpperCase()}</h3>}
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
                <button onClick={() => handleTabClick('settings')}
                        className={activeTab === 'settings' ? 'active' : ''}>
                    Settings
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'personalInfo' && (
                    <div className='personalInfo'>
                        <div className='profilePicSection'>
                            {profile.profilePic?
                                <img src={profile.profilePic} width='150' height='150' style={{objectFit:"cover",borderRadius:'55px'}} id='profilePic'/>:
                                <img src={avatar} width='150' height='150' style={{objectFit:"cover",borderRadius:'55px'}} id='profilePic'/>}
                            <button>Change Picture</button>
                            <button>Delete Picture</button>
                        </div>
                        <p><strong>Name:</strong> {profile.name}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <p><strong>Phone:</strong> {profile.phone}</p>
                    </div>
                )}
                {activeTab === 'bookings' && (
                    <table style={{color:'white'}}>
                        <tr>
                            <th style={{color:'#a1a1ae'}}>Student Name</th>
                            <th>Dorm Name</th>
                            <th >Room Type</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Active</th>
                        </tr>
                        {bookings.map((booking, index) => (
                            <tr>
                                <td key={index}>{booking.user.name.toUpperCase()}</td>
                                <td>{booking.dorm.dormName}</td>
                                <td>{booking.room.roomType}</td>
                                <td>{booking.startDate.substring(0,booking.startDate.indexOf('T')).split('-').reverse().join('-')}</td>
                                <td>{booking.status}</td>
                                <td>{booking.isActive.toString()}</td>
                                {(booking.status === 'Booked')?
                                    (<td><button onClick={handleStatus}>Reject</button></td>)
                                    :<>
                                        <td><FontAwesomeIcon icon={faCheck}/></td>
                                        <td><FontAwesomeIcon icon={faTimes}/></td>
                                    </>}
                            </tr>
                        ))}
                    </table>
                )}
                {activeTab === 'properties' && (
                    <>
                        <ul>
                            {dorms.map((dorm, index) => (
                                <li key={index}>{dorm.dormName} - {dorm.location}</li>
                            ))}
                        </ul>
                        <button onClick={() => handleOpenModal('room')}><FontAwesomeIcon icon={faPlus}/> <FontAwesomeIcon icon={faBed}/></button>
                        <button onClick={() => handleOpenModal('dorm')}><FontAwesomeIcon icon={faPlus}/> <FontAwesomeIcon icon={faHouse}/></button>
                        {modalContent && isModalOpen && (
                            <Modal
                                isOpen={isModalOpen}
                                onClose={() => {
                                    setIsModalOpen(false);
                                    setModalContent(null);
                                }}
                                onSubmit={handleSubmit}
                                title={modalContent.title}
                                initialData={modalContent.initialData}
                                fields={modalContent.fields}
                            />)}
                    </>
                )}
                {activeTab === 'financials' && (
                    <div>
                        <p>Financial details here...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DormOwnerProfile;
