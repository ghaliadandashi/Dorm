import React, {useEffect, useState} from 'react';
import '../../styling/pages/profile.css'
import {useAuth} from "../Auth/AuthHook";
import axios from "axios";
import avatar from '../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modal";
import DormList from "./dormList";
import { uploadFileToFirebase,deleteFileFromFirebase } from '../../firbase-storage';
import Dashboard from './dashboard';
import noImage from '../../images/1554489-200.png'
import ProfilePicSection from "./profilePicSection";

const DormOwnerProfile = () => {
    const {user, setUser} = useAuth()
    const [profile,setProfile] = useState({
        name:'',
        email:'',
        dob:'',
        phoneNo:'',
        profilePic:''
    })
    const[bookings,setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [dorms,setDorm] =useState([])
    const [tempID,setTempID] = useState(null);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentObj,setCurrentObj] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const d = new Date();



    const handleOpenModal = (type,object) => {
        const contents = {
            room: {
                title: 'Add Room',
                initialData: { dorm: dorms[0].dormName, roomType: 'Double', pricePerSemester: '', summerPrice: '', viewType: 'CityView', noOfRooms: '' },
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
                    {name:'extraFee',label:'Extra fee for View($): ',type: 'number'},
                    {name:'space',label:'Room space:(m^2)',type:'number'},
                    {name:'noOfRooms',label:'Number of Rooms: ',type: 'number'},
                    {
                        name: "services",
                        label: "Services:",
                        type: "checkbox",
                        options: [
                            {id: "ac", name: "ac", label: "Air Conditioning"},
                            {id: "heating", name: "heating", label: "Heating"},
                            {id: "furniture", name: "furniture", label: "Furnished"},
                            {id: "linens", name: "linens", label: "Linens Provided"},
                            {id: "electricity", name: "electricity", label: "Electricity Included"},
                            {id: "water", name: "water", label: "Water Included"},
                            {id: "gas", name: "gas", label: "Gas Included"},
                            {id: "cableTv", name: "cableTv", label: "Cable TV Support"},
                            {id: "smokeDetector", name: "smokeDetector", label: "Smoke Detector"},
                            {id: "fireExtinguisher", name: "fireExtinguisher", label: "Fire Extinguisher"},
                        ]
                    },
                    {name:'roomPics',label:' Room Pictures',type:'file'}
                ]
            },
            dorm: {
                title: 'Add Dorm',
                initialData: { dormName: '', city:'Famagusta',streetName:'',capacity:'',type:'on-campus',dormPics:''},
                fields: [
                    { name: 'dormName', label: 'Dorm Name: ', type: 'text' },
                    { name: 'streetName', label: 'Street Name: ', type: 'text' },
                    { name: 'city',label:'City',type: 'select',options:[
                            {value:'Famagusta',label:'Famagusta'},
                            {value:'Kyrenia',label:'Kyrenia'},
                            {value:'Nicosia',label: 'Nicosia'},
                            {value:'Lefke',label: 'Lefke'},
                            {value: 'Iskele',label:'Iskele'},
                            {value:'Guzelyurt',label:'Guzelyurt'}
                        ]},
                    { name:'capacity', label:'Capacity: ',type:'number'},
                    { name: 'type', label:'Type: ',type: 'select',options:[{
                        value:'on-campus', label:'On-campus'},
                            {value:'off-campus',label:'Off-campus'}
                        ]},
                    {name:'services',label: 'Services:',type:'checkbox',options:[
                            { id: 'wifi',name:'wifi', label: 'Wi-Fi' },
                            { id: 'laundry',name:'laundry', label: 'Laundry' },
                            { id: 'market',name:'market' ,label: 'Market' },
                            { id: 'sharedKitchen',name:'sharedKitchen', label:'Shared Kitchen'},
                            { id: 'restaurant',name:'restaurant', label: 'Restaurant' },
                            { id: 'gym',name:'gym', label: 'Gym Access' },
                            { id: 'studyRoom',name:'studyRoom', label: 'Study Rooms'},
                            { id: 'cleaning',name:'cleaning', label: 'Weekly Cleaning Services' },
                            { id: 'security',name:'security', label: '24/7 Security' },
                            { id: 'elevator',name:'elevator', label: 'Elevator'}
                        ]},
                    { name: 'dormPics', label: 'Dorm Pictures: ',type:'file'}
                ]
            },
            editRoom:{title:'Edit Room',initialData:{services:'',pricePerSemester:'',summerPrice: '',extraFee:'',noOfRooms:'',viewType: 'CityView',space:'',roomPics:''},
            fields:[
                {name:'services',label:'Services',type:'checkbox',options:[
                        {id: "ac", name: "ac", label: "Air Conditioning"},
                        {id: "heating", name: "heating", label: "Heating"},
                        {id: "furniture", name: "furniture", label: "Furnished"},
                        {id: "linens", name: "linens", label: "Linens Provided"},
                        {id: "electricity", name: "electricity", label: "Electricity Included"},
                        {id: "water", name: "water", label: "Water Included"},
                        {id: "gas", name: "gas", label: "Gas Included"},
                        {id: "cableTv", name: "cableTv", label: "Cable TV Support"},
                        {id: "smokeDetector", name: "smokeDetector", label: "Smoke Detector"},
                        {id: "fireExtinguisher", name: "fireExtinguisher", label: "Fire Extinguisher"}
                    ]},
                { name: 'pricePerSemester', label: 'Price per Semester($): ', type: 'number' },
                {name:'summerPrice',label: 'Summer Price ($ per month): ',type: 'number'},
                {name:'viewType',label:'View Type: ',type: 'select',
                    options: [{value: 'CityView',label:'City View'},
                        {value: 'StreetView',label:'Street View'},
                        {value: 'SeaView',label:'Sea View'},
                        {value: 'CampusView',label:'Campus View'}
                    ]},
                {name:'extraFee',label:'Extra fee for View($): ',type: 'number'},
                {name:'space',label:'Room space:(m^2)',type:'number'},
                {name:'availability',label:'Number of Rooms: ',type: 'number'},
                {name:'roomPics',label:'Room Pictures',type:'file'}
            ]
            },
            editDorm:{title:'Edit Dorm',initialData:{ city:'Famagusta',streetName:'',capacity:'',type:'on-campus',dormPics:''},fields:[
                    { name: 'streetName', label: 'Street Name: ', type: 'text' },
                    { name: 'city',label:'City',type: 'select',options:[
                            {value:'Famagusta',label:'Famagusta'},
                            {value:'Kyrenia',label:'Kyrenia'},
                            {value:'Nicosia',label: 'Nicosia'},
                            {value:'Lefke',label: 'Lefke'},
                            {value: 'Iskele',label:'Iskele'},
                            {value:'Guzelyurt',label:'Guzelyurt'}
                        ]},
                    { name:'capacity', label:'Capacity: ',type:'number'},
                    { name: 'type', label:'Type: ',type: 'select',options:[{
                            value:'on-campus', label:'On-campus'},
                            {value:'off-campus',label:'Off-campus'}
                        ]},
                    {name:'services',label: 'Services:',type:'checkbox',options:[
                            { id: 'wifi',name:'wifi', label: 'Wi-Fi' },
                            { id: 'laundry',name:'laundry', label: 'Laundry' },
                            { id: 'market',name:'market' ,label: 'Market' },
                            { id: 'sharedKitchen',name:'sharedKitchen', label:'Shared Kitchen'},
                            { id: 'restaurant',name:'restaurant', label: 'Restaurant' },
                            { id: 'gym',name:'gym', label: 'Gym Access' },
                            { id: 'studyRoom',name:'studyRoom', label: 'Study Rooms'},
                            { id: 'cleaning',name:'cleaning', label: 'Weekly Cleaning Services' },
                            { id: 'security',name:'security', label: '24/7 Security' },
                            { id: 'elevator',name:'elevator', label: 'Elevator'}
                        ]},
                    { name: 'dormPics', label: 'Dorm Pictures: ',type:'file'}
                ]
        }}

        setModalContent(contents[type]);
        setCurrentObj(object);
        setCurrentAction(type);
        setIsModalOpen(true);
    };
    
    const handleSubmit = async (formData) => {
        const endpoint = currentAction === 'dorm'
        ? 'http://localhost:3001/dorms/add'
        : (currentAction === 'room'
            ? 'http://localhost:3001/dorms/addRoom'
            : (currentAction === 'editDorm'
                ? `http://localhost:3001/dorms/editDorm/${currentObj._id}`
                : `http://localhost:3001/dorms/editRoom/${currentObj._id}`));
        try {
            const response = await axios.post(endpoint, formData, { withCredentials: true });
            console.log('Success:', response.data);
            setIsModalOpen(false);
            setCurrentAction(null);
            setCurrentObj(null);
            window.location.reload()
        } catch (error) {
            console.error(`Failed to submit ${currentAction}:`, error);
        }
    };

    const getBooking = async()=>{
        axios.get('http://localhost:3001/booking/getBooking',{withCredentials:true})
                .then(response=>{
                    setBookings(response.data);
                    // console.log(response.data)
                }).catch(error=>{
                    console.error('Failed to get Bookings: ',error)
            })
    }

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`,{withCredentials:true})
                .then(response => {
                    // console.log(response.data)
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob:response.data.user.dob,
                        phoneNo:response.data.user.phoneNo,
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
            getBooking()
        }
    }, [user]);



    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleStatus = async (id)=>{
        try{
            const response = await axios.put(`http://localhost:3001/booking/handleStatus/${id}`,{})
            window.location.reload()
            
        }catch(error){
            console.error('Failed to update Booking status',error)
        }
    }

    const getPrice = (room, stay) => {
        switch(Number(stay)) {
            case 9:
                return room.pricePerSemester * 2;
            case 12:
                return (room?.pricePerSemester * 2) + (room?.summerPrice * 3);
            case 4.5:
                return room?.pricePerSemester;
            case 3:
                return room?.summerPrice*3;
            default:
                return room?.pricePerSemester;
        }
    };
    const handleDormClick = (id) => {
        setTempID(null);
        setTimeout(() => {
            setTempID(id);
        }, 0);
    };

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
                    <ProfilePicSection/>
                )}
                {activeTab === 'bookings' && (
                    <div className='table-container'>
                    <table style={{color:'white'}}>
                        <tr>
                            <th style={{color:'#a1a1ae'}}>Student Name</th>
                            <th>Dorm Name</th>
                            <th >Room Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Semester</th>
                            <th>Stay Duration</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                        {bookings.map((booking, index) => (
                            <tr>
                                <td key={index}>{booking.user.name.toUpperCase()}</td>
                                <td>{booking.dorm.dormName || '----'}</td>
                                <td>{booking.room?.roomType?? '-----'}</td>
                                <td>{booking.startDate.substring(0,booking.startDate.indexOf('T')).split('-').reverse().join('-')}</td>
                                <td>{booking.endDate.substring(0,booking.startDate.indexOf('T')).split('-').reverse().join('-')}</td>
                                <td>{d.getFullYear()}- {d.getFullYear()+1} {booking.semester.toUpperCase()}</td>
                                <td>{booking.stayDuration===9?'2 Semesters':
                                    booking.stayDuration ===4.5?'1 Semester':
                                    booking.stayDuration ===12?'1 Year':
                                    booking.stayDuration ===3?'Summer':
                                    '-----'
                                }</td>
                                <td>{getPrice(booking.room,booking.stayDuration)}</td>
                                <td>{booking.status}</td>
                                {(booking.status === 'Requested')?
                                    (<><td><button onClick={()=>handleStatus(booking._id)}>Confirm Reservation</button></td></>)
                                    :<>
                                        {booking.status === 'Reserved'?<td><button onClick={()=>handleStatus(booking._id)}>Confirm Booking</button></td>:null
                                        }
                                    </>}
                                    {booking.status !== 'Booked'?<td><FontAwesomeIcon icon={faTimes}/></td>:null}
                            </tr>
                        ))}
                    </table>
                    </div>
                )}
                {activeTab === 'properties' && (
                    <div className='properties'>

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

                        <div>
                            <DormList handleModalOpen={handleOpenModal}/>
                        </div>
                    </div>
                )}
                {activeTab === 'financials' && (
                    <div>
                        <div className='dorms-container-f'>
                            {dorms.map((dorm,index)=>(
                                <div key={index} className='dorms-financials'>
                                    <img src={dorm.dormPics[0] || noImage} width='100px' height='100px'/>
                                    <p onClick={() => handleDormClick(dorm._id)}>{dorm.dormName}</p>
                            </div>))}
                        </div>
                        {tempID? <Dashboard dormId={tempID}/>:<h3 style={{color:"white",fontWeight:'bold'}}>Select Dorm to view insights!</h3>}

                    </div>
                )}
            </div>
        </div>
    );
};

export default DormOwnerProfile;
