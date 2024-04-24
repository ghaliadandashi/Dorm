import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import '../styling/pages/homepage.css';
import axios from "axios";
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import image1 from '../images/unnamed-1.jpg.webp'
import image2 from '../images/istockphoto-642901636-612x612.jpg'
import image3 from '../images/Saly-16.png'
import image4 from '../images/[removal.ai]_74281a78-76c3-42db-925c-2b9637458cb3-saly-37.png'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link} from "react-router-dom";
import {useAuth} from "../components/Auth/AuthHook";

const Home = () => {
    const [dorms, setDorms] = useState([]);
    localStorage.clear();
    const {isLoggedIn} = useAuth();
    useEffect(() => {
        axios.get('http://localhost:3001/dorms/show')
            .then(response => {
                setDorms(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch data:", error);
            });
    }, []);

    return (
        <div className='body'>
            <Header />
            <div className='homeContent'>
                <div className='homeFirst'>

                </div>
                <div className='homeMiddle'>
                    <div className='comfortsign'>
                        <img width='200' height='200' src={image4}/>
                        <p>Find your comfort with us</p>
                        <img width='250' height='200' src={image3}/>
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
                        {dorms.map((dorm, index) => (
                            <div key={index} style={{
                                backgroundColor: "white",
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                padding: '10px',
                                minWidth: '200px',
                                maxWidth: '300px',
                                textAlign: 'center'
                            }}>
                                <div>
                                    <img src={image2} alt='' width='300' height='200'/>
                                </div>
                                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
                                    <h5 style={{ color: 'black',fontSize:'20px',margin:'10px' }}><Link to='/dormDetails' onClick={()=>localStorage.setItem('DormId',dorm._id)} style={{textDecoration:'none',color:'black'}}>{dorm.dormName}</Link></h5>
                                    <p style={{margin:'5px' }}><FontAwesomeIcon icon={faMapMarkerAlt}/> {dorm.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {(isLoggedIn? (<div className='homeLast'></div>):null)}
            </div>
        </div>
    );
}

export default Home;
