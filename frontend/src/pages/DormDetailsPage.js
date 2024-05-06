import React, {useEffect, useState} from 'react'
import Header from "../layout/Header";
import axios from "axios";
import {useAuth} from "../components/Auth/AuthHook";
import '../styling/pages/dormDetails.css'
import {useNavigate} from "react-router-dom";
import avatar
    from "../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp";


const DormDetails=()=>{
    const [dormInfo,setDormInfo] = useState([]);
    const [roomInfo,setRoomInfo] = useState([]);
    const navigate = useNavigate()
    const {role,isLoggedIn,user} = useAuth();
    const [stay, setStay]=useState(0);
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
    const handleChange=(e)=>{
        const { name, value } = e.target;
        setStay(parseFloat(value));
    }
    const handleBooking=(roomID,dormID)=>{
        axios.post(`http://localhost:3001/booking/add/${roomID}/${dormID}/${stay}`)
            .then(response=>{
                console.log(response.data)
            }).catch(error=>{
                console.error('Failed to get data',error)
        })
    }
    const getPrice = (room, stay) => {
        switch(Number(stay)) {
            case 9:
                return room.pricePerSemester * 2;
            case 12:
                return (room.pricePerSemester * 2) + (room.summerPrice * 3);
            case 4.5:
                return room.pricePerSemester;
            case 3:
                return room.summerPrice;
            default:
                return room.pricePerSemester;
        }
    };
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
                    <img src={dormInfo.dorm.dormPics[0]} alt="" className="bigImage" />
                    <div className="small">
                    <img src={dormInfo.dorm.dormPics[1]} alt="" className="smallImage" />
                    <div className="lastpic">
                        <img
                        src={dormInfo.dorm.dormPics[2]}
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
                        {dormInfo.dorm.services.map(service=>
                            <ul>
                                <li>{service.toUpperCase()}</li>
                            </ul>
                        )}
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
                <table style={{color:'white'}}>
                <tr className="tableHeader">
                    <th className="borderingTheTable">Room type</th>
                    <th className="borderingTheTable">Room available</th>
                    
                    <th className='borderingTheTable'>Per room type</th>
                    <th>Stay Duration</th>
                    <th className="borderingTheTable">Price</th>
                    {(role === 'student' || isLoggedIn == false)?<><th>Book Room</th></>:null}
                    </tr>
                    {roomInfo.map((room,index)=>(
                        
                        <tr id="a" key={room._id ||index}>
                            <td className="">{room.roomType}</td>
                            {(room.availability ===0 )?(<td style={{color:'darkred'}}>Fully Booked!</td>):(room.availability>20)?<td>Available</td>:<td style={{color:'orangered'}}>Almost Out!</td>}
                            <td>{room.services}</td>
                            <td><select value={stay} onChange={handleChange}>
                                <option value='4.5'>1 semester</option>
                                <option value='9'> 2 semesters</option>
                                <option value='12'>1 year</option>
                                <option value='2'>Summer</option>
                            </select></td>
                            <td>{getPrice(room,stay)}</td>
                            {(role === 'student')?(<td><button className="tableBtn" onClick={()=>handleBooking(room._id,dormID)}>Book Room</button></td>):(isLoggedIn === false)?
                            <td><button onClick={()=>{navigate('/login')}}>Book Room</button></td>:null}
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