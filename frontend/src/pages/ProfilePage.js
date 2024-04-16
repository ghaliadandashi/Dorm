import React from 'react'
import Navbar from "../layout/Navbar";
import DormOwnerProfile from "../components/Profiles/DormOwnerProfile";
import StudentProfile from "../components/Profiles/StudentProfile";
import {useAuth} from "../components/Auth/AuthHook";

const Profile = () =>{
    const {isLoggedIn, role, status} = useAuth()
    return(
        <>
            <Navbar/>
            {(role === 'dormOwner')?<DormOwnerProfile/>:<StudentProfile/>}
        </>
    )
}


export default Profile;
