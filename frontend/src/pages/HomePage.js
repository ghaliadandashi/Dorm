import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import '../styling/pages/homepage.css';
import axios from "axios";
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import noImage from '../images/1554489-200.png';
import avatar from '../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp';
import image3 from '../images/Saly-16.png';
import image4 from '../images/[removal.ai]_74281a78-76c3-42db-925c-2b9637458cb3-saly-37.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Link, useLocation} from "react-router-dom";
import { useAuth } from "../components/Auth/AuthHook";
import Search from '../layout/Search';
import { useTranslation } from 'react-i18next';
import DormComparison from '../layout/DormComparison';

const Home = () => {
    const [dorms, setDorms] = useState([]);
    const [currUser, setCUser] = useState(JSON.parse(localStorage.getItem('currUser')) || []);
    const { isLoggedIn, user, role } = useAuth();
    const [booking, setBooking] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDorms, setSelectedDorms] = useState([]);
    const dormsPerPage = 6;
    const location = useLocation();
    const { t } = useTranslation();

    useEffect(() => {
        axios.get('http://localhost:3001/dorms/show')
            .then(response => {
                const validDorms = response.data.filter(result => result.owner.status === 'Valid');
                setDorms(validDorms);
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
            });

        const searchParams = new URLSearchParams(location.search);
        const query = searchParams.get('search');
        if (query) {
            axios.get(`http://localhost:3001/dorms/searchDorm?dormName=${query}`)
                .then(response => {
                    setDorms(response.data);
                    console.log("Dorms: ",response.data);
                })
                .catch(error => {
                    console.error('Failed to fetch search results:', error);
                });
        }
        axios.get('http://localhost:3001/booking/getBooking', { withCredentials: true })
            .then(response => {
                if (role === 'student') {
                    setBooking(response.data);
                }
            })
            .catch(error => {
                console.error('Failed to fetch booking');
            });
        if (role !== 'student') {
            axios.get('http://localhost:3001/api/profile', { withCredentials: true })
                .then(response => {
                    setCUser(response.data);
                    localStorage.setItem('currUser', JSON.stringify(response.data));
                })
                .catch(error => {
                    console.error('Failed to get user info', error);
                });
        } else {
            setCUser(user);
            localStorage.setItem('currUser', JSON.stringify(user));
        }
    }, [user, role,location.search]);

    const indexOfLastDorm = currentPage * dormsPerPage;
    const indexOfFirstDorm = indexOfLastDorm - dormsPerPage;
    const currentDorms = dorms.slice(indexOfFirstDorm, indexOfLastDorm);

    const totalPages = Math.ceil(dorms.length / dormsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleDormSelection = (dorm) => {
        setSelectedDorms((prevSelected) => {
            if (prevSelected.includes(dorm)) {
                return prevSelected.filter(selected => selected !== dorm);
            } else {
                return [...prevSelected, dorm];
            }
        });
    };

    return (
        <div className='body'>
            <Header />
            <div className='homeContent'>
                <div className='homeFirst'>
                    <Search setDorms={setDorms} />
                    <DormComparison selectedDorms={selectedDorms} />
                </div>
                <div className='homeMiddle'>
                    <div className='comfortsign'>
                        <img width='200' height='200' src={image4} />
                        <p>{t('findYourComfort')}</p>
                        <img width='250' height='200' src={image3} />
                    </div>
                    <div style={{
                        borderRadius: '15px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '90px',
                    }}>
                        {currentDorms.length > 0 ? currentDorms.map((dorm, index) => (
                            <div key={index} style={{
                                backgroundColor: "white",
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                padding: '10px',
                                minWidth: '200px',
                                maxWidth: '300px',
                                textAlign: 'left',
                                position: 'relative'
                            }}>
                                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedDorms.includes(dorm)}
                                        onChange={() => handleDormSelection(dorm)}
                                        style={{
                                            width: '24px',
                                            height: '24px',
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                                <div>
                                    {dorm.dormPics.length > 0 ? (
                                        <Link to='/dormDetails' style={{ textDecoration: 'none' }} onClick={() => localStorage.setItem('DormId', dorm._id)}>
                                            <img style={{ objectFit: 'cover', borderRadius: '10px' }} src={dorm.dormPics[0]} alt='' width='300' height='200' />
                                        </Link>
                                    ) : (
                                        <img src={noImage} style={{ objectFit: 'cover', borderRadius: '10px' }} width='300' height='200' />
                                    )}
                                </div>
                                <Link to='/dormDetails' style={{ textDecoration: 'none' }} onClick={() => localStorage.setItem('DormId', dorm._id)}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: '10px' }}>
                                        <h5 style={{ color: 'black', fontSize: '20px', margin: '10px 0' }}>{dorm.dormName}</h5>
                                        <p style={{ margin: '5px 0', color: 'black' }}>
                                            <FontAwesomeIcon icon={faMapMarkerAlt} /> {dorm.location}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        )) : (
                            <div style={{ color: "white", height: '100vh' }}>
                                <h1>{t('noDorms')}</h1>
                            </div>
                        )}


                    </div>
                    <div className="pagination">
                        <button onClick={goToPreviousPage} disabled={currentPage === 1}>{t('previous')}</button>
                        <span>{t('page')} {currentPage} {t('of')} {totalPages}</span>
                        <button onClick={goToNextPage} disabled={currentPage === totalPages}>{t('next')}</button>
                    </div>
                </div>
                {console.log(currUser)}
                {(isLoggedIn ? (
                    <div className='homeLast'>
                        {(role !== 'student') ?
                            <div style={{ marginTop: '40px' }}>
                                {currUser?.profilePic ? (
                                    <img src={currUser?.profilePic} width='150' height='150' style={{ objectFit: 'cover', borderRadius: '40px' }} />
                                ) : (
                                    <img src={avatar} width='150' height='150' style={{ objectFit: 'cover', borderRadius: '40px' }} />
                                )}
                                <p style={{ color: "white", fontWeight: "bold" }}>{currUser?.name?.toUpperCase()}</p>
                            </div> : <div style={{ marginTop: '40px' }}>
                                {user?.profilePic ? (<img src={user?.profilePic || avatar} width='150' height='150' style={{ objectFit: 'cover', borderRadius: '40px' }} />) :
                                    <img src={avatar} width='150' height='150' style={{ objectFit: 'cover', borderRadius: '40px' }} />}
                                <p style={{ color: "white", fontWeight: "bold" }}>{user?.name?.toUpperCase()}</p></div>}
                        <div className='bookingStatus-container'>
                            <label htmlFor='bookingStatus'>{t('bookingStatus')}</label>
                            <p id='bookingStatus' className='bookingStatus' style={booking[0]?.status === 'Booked' ? { color: 'green' } : { color: '#f8c200' }}>{booking.length !== 0 ? booking[0].status : t('noBookingYet')}</p>
                        </div>
                    </div>) : null)}
            </div>
        </div>
    );
}

export default Home;
