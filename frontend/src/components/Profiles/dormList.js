import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faEdit, faTrash, faHouse, faBed} from '@fortawesome/free-solid-svg-icons';
import '../../styling/components/dormList.css'
import { useNavigate } from 'react-router-dom';
import noImage from '../../images/1554489-200.png'

const DormList = ({ handleModalOpen }) => {
    const nagivate = useNavigate();
    const [dorms, setDorms] = useState([]);
    const [dormID,setDormId] = useState('')
    useEffect(() => {
        fetchDorms();
    }, []);

    const fetchDorms = async () => {
        const response = await axios.get('http://localhost:3001/api/dorm',{withCredentials:true});
        // console.log(response)
        setDorms(response.data);
    };

    const handleDelete = async (dormId) => {
        await axios.delete(`http://localhost:3001/dorms/deleteDorm/${dormId}`);
        fetchDorms();
    };

    return (
        <div className='dormListContainer'>
            <div className='addingBtns'>
                <button onClick={() => handleModalOpen('dorm')}>
                    <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faHouse}/> Add Dorm
                </button>
                <button onClick={() => handleModalOpen('room')}>
                    <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faBed} /> Add Room
                </button>
            </div>
            <div className='middleNav'><h2>Dorms</h2> <h2>Rooms</h2></div>
            <div className='dormList'>
                <div className='dormss'>
            {dorms.map(dorm => (
                <div key={dorm._id} >
                    <div className='dorm'>
                        {dorm.dormPics.length != 0?<img src={dorm.dormPics[0]} width='100' height='100' style={{objectFit:'cover'}}/>:
                            <img src={noImage} width='100' height='100' style={{objectFit:'cover'}}/>
                        }
                        
                    <span style={{display:'flex',flexDirection:'column'}}>
                    <h3 onClick={()=>setDormId(dorm._id)} style={{textDecoration:'underline',cursor:'pointer',color:'#2b2c48'}}>{dorm.dormName}</h3>
                    <span style={{color:'#2b2c48'}}>Occupancy: {dorm.occupancy}</span>
                    </span>
                    <span style={{display:'flex',flexDirection:'column',justifyContent:'center'}}>
                    <button style={{fontWeight:'bold',padding:'0px 25px',backgroundColor:'#2b2c48',color:'white',height:'100%',border:'none',borderBottom:'1px solid white',borderLeft:'1px solid white',cursor:'pointer'}} onClick={() => handleModalOpen('editDorm', dorm)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button style={{fontWeight:'bold',backgroundColor:'#2b2c48',color:'white',height:'100%',border:'none',borderLeft:'1px solid white',cursor:'pointer'}} onClick={() => handleDelete(dorm._id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                    </span>
                    </div>
                </div>
            ))}
                </div>
                {dormID?<RoomList dormId={dormID} handleModalOpen={handleModalOpen}/>:null}
            </div>
        </div>
    );
};

const RoomList = ({ dormId, handleModalOpen }) => {
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetchRooms();
    }, [dormId]);

    const fetchRooms = async () => {
        const response = await axios.get(`http://localhost:3001/dorms/rooms/getRooms/${dormId}`);
        setRooms(response.data[0])
    };

    const handleDelete = async (roomId) => {
        await axios.delete(`http://localhost:3001/dorms/deleteRoom/${dormId}/${roomId}`);
        fetchRooms();
    };

    return (
        <div>
            {rooms? rooms.map(room => (
                <div className='dorm' key={room._id}>
                    {room.roomPics.length!==0?<img src={room.roomPics[0]} width='100' height='100' style={{objectFit:'cover'}}/>:
                        <img src={noImage} width='100' height='100' style={{objectFit:'cover'}}/>
                    }
                    
                    <h4>{room.roomType}</h4>
                    <button onClick={() => handleModalOpen('editRoom', room, dormId)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button onClick={() => handleDelete(room._id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>)):null}

        </div>
    );
};

export default DormList;
