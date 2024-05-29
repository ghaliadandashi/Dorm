import React, { useEffect, useState } from 'react';
import '../../styling/pages/profile.css';
import { useAuth } from "../Auth/AuthHook";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from "../Modal";
import DormList from "./dormList";
import { uploadFileToFirebase, deleteFileFromFirebase } from '../../firbase-storage';
import Dashboard from './dashboard';
import noImage from '../../images/1554489-200.png';
import ProfilePicSection from "./profilePicSection";
import { useNotification } from "../../layout/Notifications";
import Settings from "./settings";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const DormOwnerProfile = () => {
    const { t } = useTranslation();
    const { user, setUser } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        phoneNo: '',
        profilePic: ''
    });
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const [dorms, setDorm] = useState([]);
    const [tempID, setTempID] = useState(null);
    const [currentAction, setCurrentAction] = useState(null);
    const [currentObj, setCurrentObj] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const d = new Date();
    const { addNotification } = useNotification();

    const handleOpenModal = (type, object) => {
        const contents = {
            room: {
                title: t('addRoom'),
                initialData: { dorm: dorms[0].dormName, roomType: 'Double', pricePerSemester: '', summerPrice: '', viewType: 'CityView', noOfRooms: '' },
                fields: [
                    { name: 'dorm', label: t('dorm'), type: 'select', options: dorms.map(dorm => ({
                            value: dorm.dormName, label: dorm.dormName
                        })) },
                    { name: 'roomType', label: t('roomType'), type: 'select',
                        options: [
                            { value: 'Double', label: t('roomTypes.Double') },
                            { value: 'Single', label: t('roomTypes.Single') },
                            { value: 'Triple', label: t('roomTypes.Triple') },
                            { value: 'Quad', label: t('roomTypes.Quad') },
                            { value: 'Suite', label: t('roomTypes.Suite') },
                            { value: 'Studio', label: t('roomTypes.Studio') }
                        ] },
                    { name: 'pricePerSemester', label: t('pricePerSemester'), type: 'number' },
                    { name: 'summerPrice', label: t('summerPrice'), type: 'number' },
                    { name: 'viewType', label: t('viewType'), type: 'select',
                        options: [
                            { value: 'CityView', label: t('viewTypes.CityView') },
                            { value: 'StreetView', label: t('viewTypes.StreetView') },
                            { value: 'SeaView', label: t('viewTypes.SeaView') },
                            { value: 'CampusView', label: t('viewTypes.CampusView') }
                        ]},
                    { name: 'extraFee', label: t('extraFeeForView'), type: 'number' },
                    { name: 'space', label: t('roomSpace'), type: 'number' },
                    { name: 'noOfRooms', label: t('numberOfRooms'), type: 'number' },
                    {
                        name: "services",
                        label: t('servicesTitle'),
                        type: "checkbox",
                        options: [
                            { id: "ac", name: "ac", label: t('servicesList.ac') },
                            { id: "heating", name: "heating", label: t('servicesList.heating') },
                            { id: "furniture", name: "furniture", label: t('servicesList.furniture') },
                            { id: "linens", name: "linens", label: t('servicesList.linens') },
                            { id: "electricity", name: "electricity", label: t('servicesList.electricity') },
                            { id: "water", name: "water", label: t('servicesList.water') },
                            { id: "gas", name: "gas", label: t('servicesList.gas') },
                            { id: "cableTv", name: "cableTv", label: t('servicesList.cableTv') },
                            { id: "smokeDetector", name: "smokeDetector", label: t('servicesList.smokeDetector') },
                            { id: "fireExtinguisher", name: "fireExtinguisher", label: t('servicesList.fireExtinguisher') },
                        ]
                    },
                    { name: 'roomPics', label: t('roomPictures'), type: 'file' }
                ]
            },
            dorm: {
                title: t('addDorm'),
                initialData: { dormName: '', city: 'Famagusta', streetName: '', capacity: '', type: 'on-campus', dormPics: '' },
                fields: [
                    { name: 'dormName', label: t('dormName'), type: 'text' },
                    { name: 'streetName', label: t('streetName'), type: 'text' },
                    { name: 'city', label: t('city'), type: 'select', options: [
                            { value: 'Famagusta', label: t('famagusta') },
                            { value: 'Kyrenia', label: t('kyrenia') },
                            { value: 'Nicosia', label: t('nicosia') },
                            { value: 'Lefke', label: t('lefke') },
                            { value: 'Iskele', label: t('iskele') },
                            { value: 'Guzelyurt', label: t('guzelyurt') }
                        ]},
                    { name: 'capacity', label: t('capacity'), type: 'number' },
                    { name: 'type', label: t('type'), type: 'select', options: [
                            { value: 'on-campus', label: t('onCampus') },
                            { value: 'off-campus', label: t('offCampus') }
                        ]},
                    { name: 'services', label: t('servicesTitle'), type: 'checkbox', options: [
                            { id: 'wifi', name: 'wifi', label: t('servicesList.wifi') },
                            { id: 'laundry', name: 'laundry', label: t('servicesList.laundry') },
                            { id: 'market', name: 'market', label: t('servicesList.market') },
                            { id: 'sharedKitchen', name: 'sharedKitchen', label: t('servicesList.sharedKitchen') },
                            { id: 'restaurant', name: 'restaurant', label: t('servicesList.restaurant') },
                            { id: 'gym', name: 'gym', label: t('servicesList.gym') },
                            { id: 'studyRoom', name: 'studyRoom', label: t('servicesList.studyRoom') },
                            { id: 'cleaning', name: 'cleaning', label: t('servicesList.cleaning') },
                            { id: 'security', name: 'security', label: t('servicesList.security') },
                            { id: 'elevator', name: 'elevator', label: t('servicesList.elevator') }
                        ]},
                    { name: 'dormPics', label: t('dormPictures'), type: 'file' },
                    { name: 'ownershipFiles', label: t('ownershipFiles'), type: 'file' }
                ]
            },
            editRoom: {
                title: t('editRoom'),
                initialData: { services: '', pricePerSemester: '', summerPrice: '', extraFee: '', noOfRooms: '', viewType: '', space: '', roomPics: '' },
                fields: [
                    { name: 'services', label: t('servicesTitle'), type: 'checkbox', options: [
                            { id: "ac", name: "ac", label: t('servicesList.ac') },
                            { id: "heating", name: "heating", label: t('servicesList.heating') },
                            { id: "furniture", name: "furniture", label: t('servicesList.furniture') },
                            { id: "linens", name: "linens", label: t('servicesList.linens') },
                            { id: "electricity", name: "electricity", label: t('servicesList.electricity') },
                            { id: "water", name: "water", label: t('servicesList.water') },
                            { id: "gas", name: "gas", label: t('servicesList.gas') },
                            { id: "cableTv", name: "cableTv", label: t('servicesList.cableTv') },
                            { id: "smokeDetector", name: "smokeDetector", label: t('servicesList.smokeDetector') },
                            { id: "fireExtinguisher", name: "fireExtinguisher", label: t('servicesList.fireExtinguisher') }
                        ]},
                    { name: 'pricePerSemester', label: t('pricePerSemester'), type: 'number' },
                    { name: 'summerPrice', label: t('summerPrice'), type: 'number' },
                    { name: 'viewType', label: t('viewType'), type: 'select',
                        options: [
                            { value: 'CityView', label: t('viewTypes.CityView') },
                            { value: 'StreetView', label: t('viewTypes.StreetView') },
                            { value: 'SeaView', label: t('viewTypes.SeaView') },
                            { value: 'CampusView', label: t('viewTypes.CampusView') }
                        ]},
                    { name: 'extraFee', label: t('extraFeeForView'), type: 'number' },
                    { name: 'space', label: t('roomSpace'), type: 'number' },
                    { name: 'availability', label: t('numberOfRooms'), type: 'number' },
                    { name: 'roomPics', label: t('roomPictures'), type: 'file' }
                ]
            },
            editDorm: {
                title: t('editDorm'),
                initialData: { city: '', streetName: '', capacity: '', type: 'on-campus', dormPics: '' },
                fields: [
                    { name: 'streetName', label: t('streetName'), type: 'text' },
                    { name: 'city', label: t('city'), type: 'select', options: [
                            { value: 'Famagusta', label: t('famagusta') },
                            { value: 'Kyrenia', label: t('kyrenia') },
                            { value: 'Nicosia', label: t('nicosia') },
                            { value: 'Lefke', label: t('lefke') },
                            { value: 'Iskele', label: t('iskele') },
                            { value: 'Guzelyurt', label: t('guzelyurt') }
                        ]},
                    { name: 'capacity', label: t('capacity'), type: 'number' },
                    { name: 'type', label: t('type'), type: 'select', options: [
                            { value: 'on-campus', label: t('onCampus') },
                            { value: 'off-campus', label: t('offCampus') }
                        ]},
                    { name: 'services', label: t('servicesTitle'), type: 'checkbox', options: [
                            { id: 'wifi', name: 'wifi', label: t('servicesList.wifi') },
                            { id: 'laundry', name: 'laundry', label: t('servicesList.laundry') },
                            { id: 'market', name: 'market', label: t('servicesList.market') },
                            { id: 'sharedKitchen', name: 'sharedKitchen', label: t('servicesList.sharedKitchen') },
                            { id: 'restaurant', name: 'restaurant', label: t('servicesList.restaurant') },
                            { id: 'gym', name: 'gym', label: t('servicesList.gym') },
                            { id: 'studyRoom', name: 'studyRoom', label: t('servicesList.studyRoom') },
                            { id: 'cleaning', name: 'cleaning', label: t('servicesList.cleaning') },
                            { id: 'security', name: 'security', label: t('servicesList.security') },
                            { id: 'elevator', name: 'elevator', label: t('servicesList.elevator') }
                        ]},
                    { name: 'dormPics', label: t('dormPictures'), type: 'file' }
                ]
            }
        };

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
            if (currentAction.includes('dorm' || 'Dorm')) {
                addNotification(t('dormRequestAccepted'), 'success');
            } else {
                addNotification(t('roomRequestAccepted'), 'success');
            }
            setIsModalOpen(false);
            setCurrentAction(null);
            setCurrentObj(null);
            window.location.reload();
        } catch (error) {
            console.error(`Failed to submit ${currentAction}:`, error);
        }
    };

    const getBooking = async () => {
        axios.get('http://localhost:3001/booking/getBooking', { withCredentials: true })
            .then(response => {
                setBookings(response.data);
            }).catch(error => {
            console.error('Failed to get Bookings: ', error);
        });
    }

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`, { withCredentials: true })
                .then(response => {
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob: response.data.user.dob,
                        phoneNo: response.data.user.phoneNo,
                        profilePic: response.data.user.profilePic
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            axios.get(`http://localhost:3001/api/dorm`, { withCredentials: true })
                .then(response => {
                    setDorm(response.data);
                })
                .catch(error => { console.error('Failed to get Dorms: ', error) });
            getBooking();
        }
    }, [user],[bookings]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleStatus = async (id) => {
        try {
            const response = await axios.put(`http://localhost:3001/booking/handleStatus/${id}`, {});
            window.location.reload();
        } catch (error) {
            console.error('Failed to update Booking status', error);
        }
    }

    const getPrice = (room, stay) => {
        switch (Number(stay)) {
            case 9:
                return room.pricePerSemester * 2;
            case 12:
                return (room?.pricePerSemester * 2) + (room?.summerPrice * 3);
            case 4.5:
                return room?.pricePerSemester;
            case 3:
                return room?.summerPrice * 3;
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
    const deleteRequest= async (bookingID)=>{
        try {
            const response = await axios.delete(`http://localhost:3001/booking/deleteRequest/${bookingID}`)
                .then(
                    addNotification('Booking Rejected!', 'error')
                )
        }catch (error){
            console.error('Failed to update Booking status', error);
        }
    }
    return (
        <div className="profile">
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
                <button onClick={() => handleTabClick('properties')}
                        className={activeTab === 'properties' ? 'active' : ''}>
                    {t('properties')}
                </button>
                <button onClick={() => handleTabClick('financials')}
                        className={activeTab === 'financials' ? 'active' : ''}>
                    {t('financials')}
                </button>
                <button onClick={() => handleTabClick('settings')}
                        className={activeTab === 'settings' ? 'active' : ''}>
                    {t('settings')}
                </button>
            </div>
            <div className="tab-content">
                {activeTab === 'personalInfo' && (
                    <ProfilePicSection />
                )}
                {activeTab === 'bookings' && (
                    <div className='table-container'>
                        <table style={{ color: 'white' }}>
                            <thead>
                            <tr>
                                <th style={{ color: '#a1a1ae' }}>{t('name')}</th>
                                <th>{t('dormName')}</th>
                                <th>{t('roomTypesTitle')}</th>
                                <th>{t('startDate')}</th>
                                <th>{t('endDate')}</th>
                                <th>{t('semester')}</th>
                                <th>{t('stayDuration')}</th>
                                <th>{t('price')}</th>
                                <th>{t('status')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={index}>
                                    <td><Link to={`/user/${booking.user._id}`} style={{ textDecoration: "underline", color: 'white', cursor: 'pointer' }}>
                                        {booking.user.name}
                                    </Link></td>
                                    <td>{booking.dorm.dormName || '----'}</td>
                                    <td>{t(`roomTypes.${booking.room.roomType}`)}</td>
                                    <td>{booking.startDate.substring(0, booking.startDate.indexOf('T')).split('-').reverse().join('-')}</td>
                                    <td>{booking.endDate.substring(0, booking.startDate.indexOf('T')).split('-').reverse().join('-')}</td>
                                    <td>{d.getFullYear()}- {d.getFullYear() + 1} {booking.semester.toUpperCase()}</td>
                                    <td>{booking.stayDuration === 9 ? t('2Semesters') :
                                        booking.stayDuration === 4.5 ? t('1Semester') :
                                            booking.stayDuration === 12 ? t('1Year') :
                                                booking.stayDuration === 3 ? t('summer') :
                                                    '-----'
                                    }</td>
                                    <td>{getPrice(booking.room, booking.stayDuration)}</td>
                                    <td>{t(`bookingStats.${booking.status}`)}</td>
                                    {(booking.status === 'Requested') ?
                                        (<><td><button onClick={() => handleStatus(booking._id)}>{t('confirmReservation')}</button></td></>)
                                        : <>
                                            {booking.status === 'Reserved' ? <td><button onClick={() => handleStatus(booking._id)}>{t('confirmBooking')}</button></td> : null
                                            }
                                        </>}
                                    {booking.status !== 'Booked' ? <td><FontAwesomeIcon icon={faTimes} onClick={()=>deleteRequest(booking._id)} /></td> : null}
                                </tr>
                            ))}
                            </tbody>
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
                            <DormList handleModalOpen={handleOpenModal} />
                        </div>
                    </div>
                )}
                {activeTab === 'financials' && (
                    <div>
                        <div className='dorms-container-f'>
                            {dorms.map((dorm, index) => (
                                <div key={index} className='dorms-financials' onClick={() => handleDormClick(dorm._id)}>
                                    <img src={dorm.dormPics[0] || noImage} width='50px' height='50px' />
                                    <p>{dorm.dormName}</p>
                                </div>))}
                        </div>
                        {tempID ? <Dashboard dormId={tempID} /> : <h3 style={{ color: "white", fontWeight: 'bold' }}>{t('selectDormToViewInsights')}</h3>}
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div>
                        <Settings />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DormOwnerProfile;
