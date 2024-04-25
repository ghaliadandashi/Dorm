import React, {useEffect, useState} from 'react'
import Header from "../layout/Header";
import axios from "axios";
import {useAuth} from "../components/Auth/AuthHook";
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
            {/*Mahissa's code make sure you use the info I provided from backend*/}
            <table>
                {roomInfo.map((room,index)=>(
                    <tr>
                        <td key={index}>{room.roomType}</td>
                        <td>{room.price}</td>
                        {(room.availability ===1)?(<td>Available</td>):<td style={{color:"red"}}>Fully Booked!</td>}
                        <td>{room.services}</td>
                        {(role === 'student')?(<td><button onClick={()=>handleBooking(room._id,dormID)}>Book Room</button></td>):
                            (role === '')?(<td><button onClick={()=>{navigate('/login')}}>Book Room</button></td>):null}
                    </tr>
                ))}
            </table>
        </>
    )
}

export default DormDetails;