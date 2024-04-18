import React, {useEffect, useState} from 'react'
import Header from "../layout/Header";
import axios from "axios";


const DormDetails=()=>{
    const [dormInfo,setDormInfo] = useState([]);
    const dormID = localStorage.getItem('DormId')
    useEffect(()=>{
        axios.get(`http://localhost:3001/dorms/dormDetails/${dormID}`,{withCredentials:true})
            .then(response=>{
                setDormInfo(response.data)
            }).catch(error =>{
            console.error('Failed to get data',error)
        })
    },[])

    //Open console to see the array of dormInfo it gives you, so you can use it
    console.log(dormInfo)

    return(
        <>
            <Header/>
            {/*Mahissa's code make sure you use the info I provided from backend*/}
        </>
    )
}

export default DormDetails;