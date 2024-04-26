import React, {useEffect, useState} from 'react'
import Header from "../layout/Header";
import axios from "axios";
import {useAuth} from "../components/Auth/AuthHook";
import '../styling/pages/dormDetails.css'
import {useNavigate} from "react-router-dom";


const DormDetails=()=>{
    const [dormInfo,setDormInfo] = useState([]);
    const [roomInfo,setRoomInfo] = useState([]);
    const navigate = useNavigate()
    const {role} = useAuth();
    const dormID = localStorage.getItem('DormId')
    useEffect(()=>{
        axios.get(`http://localhost:3001/dorms/dormDetails/${dormID}`,{withCredentials:true})
            .then(response=>{
                setDormInfo(response.data)
                setRoomInfo(response.data.dorm.rooms)
            }).catch(error =>{
            console.error('Failed to get data',error)
        })
    },[])
    const handleBooking=(roomID,dormID)=>{
        axios.post(`http://localhost:3001/booking/add/${roomID}/${dormID}`)
            .then(response=>{
                console.log(response.data)
            }).catch(error=>{
                console.error('Failed to get data',error)
        })
    }
    //Open console to see the array of dormInfo it gives you, so you can use it
    console.log(dormInfo)
    console.log(roomInfo)
    return(
        <>
            <Header/>
            {dormInfo.dorm && (
                <>
            <div className="body">
            <div className="upsidebody">
                <div className="imageContainer">
                <p>
                   {dormInfo.dorm.dormName}
                </p>
                <div className="ax">
                    <img src="/assets/popart/p1.jpg" alt="" className="bigImage" />
                    <div className="small">
                    <img src="/assets/popart/p2.jpeg" alt="" className="smallImage" />
                    <div className="lastpic">
                        <img
                        src="/assets/popart/p3.jpg"
                        alt=""
                        className="smallImage"
                        />
                    </div>
                    </div>
                </div>
                </div>
                <div className="dormInformation">
                <div className="dormLocation">
                    <p className="dormp">Dorm location:</p>
                    <div className="dormlocationInput">
                    <span className="dormlocationspan">
                        <p>{dormInfo.dorm.location}</p>
                    </span>
                    </div>
                </div>
                <div className="service">
                    <p className="dormpp">Service:</p>
                    <div className="serviceInput">
                    <span>
                        <p>
                        {dormInfo.dorm.services}
                        </p>
                    </span>
                    </div>
                </div>
                {/* <div className="aboutTheRoom">
                    <p className="dormpp">About the room:</p>
                    <div className="abouttheroomInput">
                    <span>
                        <p>
                        Our Wifi speed is 30 mgps, a kitchen is included in every
                        room,our hot water is 24h there
                        </p>
                    </span>
                    </div>
                </div> */}
                </div>
            </div>
            {/* <div className="rooms">
                <p className="roomsp">
                <b>Rooms:</b>
                </p>
                <div className="tablediv">
                <table className="roomTable">
                    <tr className="tableHeader" id="a">
                    <th className="borderingTheTable">Room type</th>
                    <th className="borderingTheTable">Room available</th>
                    <th className="borderingTheTable">Price</th>
                    <th>Per room type</th>
                    </tr>
                    <tr className="roomBody" id="b">
                    <td className="leftB">Double room</td>
                    <td className="leftB">Almost out!</td>
                    <td className="leftB">2750$</td>
                    <td>
                        Our double room includes 2 beds, 2 closets, 2 desks, lamp on
                        each desk, 32 inch TV, 2 couches, kitchen inside the room
                    </td>
                    </tr>
                    <tr className="roomBody">
                    <td className="leftB">Single room</td>
                    <td className="leftB">Sold out!</td>
                    <td className="leftB">3100$</td>
                    <td>
                        Our single room includes 1 bed, 2 closet, 1 desk, lamp on each
                        desk, 32 inch TV, 2 couches, kitchen inside the room
                    </td>
                    </tr>
                </table>
                </div>
            </div>*/}
            </div> 
            <div className='tablediv'>
                <table>
                <tr className="tableHeader">
                    <th className="borderingTheTable">Room type</th>
                    <th className="borderingTheTable">Price</th>
                    <th className="borderingTheTable">Room available</th>
                    
                    <th className='borderingTheTable'>Per room type</th>
                    <th>Book Room</th>
                    </tr>
                    {roomInfo.map((room,index)=>(
                        
                        <tr id="a">
                            <td className="" key={index}>{room.roomType}</td>
                            <td>{room.price}</td>
                            {(room.availability ===1)?(<td>Available</td>):<td style={{color:"red"}}>Fully Booked!</td>}
                            <td>{room.services}</td>
                            {(role === 'student')?(<td><button className="tableBtn" onClick={()=>handleBooking(room._id,dormID)}>Book Room</button></td>):null}
                        </tr>
                    ))}
                </table>
            </div>
                </>
            )}
        </>
            
    )
    
}

export default DormDetails;