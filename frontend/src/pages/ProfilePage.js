import React from 'react'
import Navbar from "../layout/Navbar";
import DormOwnerProfile from "../components/Profiles/DormOwnerProfile";
import StudentProfile from "../components/Profiles/StudentProfile";
import {useAuth} from "../components/Auth/AuthHook";
import AdminProfile from "../components/Profiles/AdminProfile";

const Profile = () =>{
    const {isLoggedIn, role, status} = useAuth()
    return(
        <>
            <Navbar/>
            {(role === 'dormOwner')?<DormOwnerProfile/>:(role === 'admin')?<AdminProfile/>:<StudentProfile/>}
        </>
    )
}


export default Profile;
