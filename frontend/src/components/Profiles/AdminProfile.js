import React, {useEffect, useState} from 'react'
import {useAuth} from "../Auth/AuthHook";
import axios from "axios";
import ProfilePicSection from "./profilePicSection";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useNotification} from "../../layout/Notifications";
import '../../styling/pages/profile.css'

const AdminProfile = ()=>{
    const [profile,setProfile] = useState({
        name:'',
        email:'',
        dob:'',
        phone:'',

    })
    const [users, setUsers] = useState([]);
    const[dormRequests,setRequests] = useState([]);
    const [activeTab, setActiveTab] = useState('personalInfo');
    const {user} = useAuth();
    const {addNotification} = useNotification()
    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:3001/api/profile`,{withCredentials:true})
                .then(response => {
                    setProfile({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        dob:response.data.user.dob,
                        phone:response.data.user.phoneNo,
                        profilePic:response.data.user.profilePic
                    });
                })
                .catch(error => console.error("Failed to fetch user data:", error));
            // axios.get('http://localhost:3001/booking/getBooking',{withCredentials:true})
            //     .then(response=>{
            //         setBookings(response.data);
            //     }).catch(error=>{
            //     console.error('Failed to get Bookings: ',error)
            // })
            axios.get('http://localhost:3001/api/getLogins',{withCredentials:true})
                .then(response =>{
                    setUsers(response.data)
                    console.log(users)
                })
                .catch(error=>{
                    console.error('Failed to get login requests',error)
                })
            axios.get('http://localhost:3001/dorms/getDormRequests',{withCredentials:true})
                .then(response =>{
                    setRequests(response.data)
                })
                .catch(error=>{
                    console.error('Failed to get dorm requests',error)
                })
        }
    }, [user,dormRequests],[users]);


    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const FileLinks = ({ files }) => {
        return files.map((file, index) => (
            <div key={index}>
                <a href={file} target="_blank" rel="noopener noreferrer">
                    Download File {index + 1}
                </a>
            </div>
        ));
    };

    const handleAccept = (userID)=>{
        axios.put(`http://localhost:3001/api/acceptLogin/${userID}`)
            .then(
                addNotification('Login request accepted!','success')
            )
    }
    const handleReject = (userID)=>{
        axios.put(`http://localhost:3001/api/rejectLogin/${userID}`)
            .then(
                addNotification('Login request rejected','warning')
            )
    }

    const handleDormAccept = (dormID)=>{
        axios.put(`http://localhost:3001/dorms/acceptDorm/${dormID}`)
            .then(
                addNotification('Dorm Addition Request Accepted!','success')
            )
    }

    const handleDormReject = (dormID)=>{
        axios.put(`http://localhost:3001/dorms/rejectDorm/${dormID}`)
            .then(
                addNotification('Dorm Addition Request Rejected!','error')
            )
    }
    return(
        <>
            <div className='profile'>
                <div className="tabs">
                    {profile.name.length<20?<h2 style={{color:"white"}}>@ {profile.name.toUpperCase()}</h2>:
                        <h3 style={{color:"white"}}>@ {profile.name.toUpperCase()}</h3>}

                    <button onClick={() => handleTabClick('personalInfo')}
                            className={activeTab === 'personalInfo' ? 'active' : ''}>
                        Personal Info
                    </button>
                    <button onClick={() => handleTabClick('login')}
                            className={activeTab === 'login' ? 'active' : ''}>
                        Login Requests
                    </button>
                    <button onClick={() => handleTabClick('dormAddition')}
                            className={activeTab === 'dormAddition' ? 'active' : ''}>
                        Dorm Addition Requests
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
                    {activeTab === 'login' && (
                        <div>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Identification Files</th>
                                    <th>Ownership Files</th>
                                </tr>
                                {users.map(use =>
                                        <tr key={use._id}>
                                            <td>{use.name}</td>
                                            <td>{use.email}</td>
                                            <td>{use.phoneNo}</td>
                                            <td><FileLinks files={use.personalFiles}/> </td>
                                            <td><FileLinks files={use.ownershipFiles}/></td>
                                            <td><button onClick={()=>handleAccept(use._id)}>Accept</button></td>
                                            <td><button onClick={()=>handleReject(use._id)}>Reject</button></td>
                                        </tr>
                                )}
                            </table>

                        </div>
                    )}
                    {activeTab ==='dormAddition' &&(
                        <>
                            <table>
                                <tr>
                                    <th>Dorm Name</th>
                                    <th>Owner</th>
                                    <th>Identification Files</th>
                                    <th>Ownership Files</th>
                                </tr>
                                {dormRequests.map(request =>
                                    <tr key={request._id}>
                                        <td>{request.dormName}</td>
                                        <td>{request.owner.name}</td>
                                        <td><FileLinks files={request.owner.personalFiles}/> </td>
                                        <td><FileLinks files={request.ownershipFiles}/> </td>
                                        <td><button onClick={()=>handleDormAccept(request._id)}>Accept</button></td>
                                        <td><button onClick={()=>{handleDormReject(request._id)}}>Reject</button></td>
                                    </tr>
                                )}
                            </table>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

export default AdminProfile;