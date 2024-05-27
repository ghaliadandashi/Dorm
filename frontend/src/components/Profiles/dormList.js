import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faHouse, faBed } from '@fortawesome/free-solid-svg-icons';
import '../../styling/components/dormList.css';
import { useNavigate } from 'react-router-dom';
import noImage from '../../images/1554489-200.png';

const DormList = ({ handleModalOpen }) => {
    const navigate = useNavigate();
    const [dorms, setDorms] = useState([]);
    const [dormID, setDormID] = useState('');

    useEffect(() => {
        fetchDorms();
    }, []);

    const fetchDorms = async () => {
        const response = await axios.get('http://localhost:3001/api/dorm', { withCredentials: true });
        setDorms(response.data);
    };

    const handleDelete = async (dormId) => {
        await axios.delete(`http://localhost:3001/dorms/deleteDorm/${dormId}`);
        fetchDorms();
    };

    return (
        <div className='dormListContainer'>
            <div className='dormList'>
                <div className='dormss'>
                    <div className='cardNav'>
                        <div style={{display:"flex",flexDirection:'column',alignItems:'flex-start'}}>
                        <h2>Dorms</h2>
                        <h6 style={{marginTop:'-10px'}}>Click dorm name to view rooms.</h6>
                        </div>
                        <button onClick={() => handleModalOpen('dorm')}>
                            <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faHouse}/> Add Dorm
                        </button>
                    </div>
                    <div className='dorms'>
                    {dorms.map(dorm => (
                        <div key={dorm._id} className='dormCard'>
                            <div className='dorm'>
                                {dorm.dormPics.length !== 0
                                    ? <img src={dorm.dormPics[0]} alt='Dorm' width='100' height='100' style={{objectFit: 'cover'}}/>
                                    : <img src={noImage} alt='No Image' width='100' height='100' style={{objectFit: 'cover'}}/>
                                }
                                <div className='dormDetails'>
                                    <h3 onClick={() => setDormID(dorm._id)} className='dormName'>{dorm.dormName}</h3>
                                    <span className='occupancy'>Occupancy: {dorm.occupancy}</span>
                                </div>
                                <div className='dormActions'>
                                    <button className='editBtn' onClick={() => handleModalOpen('editDorm', dorm)}>
                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                    </button>
                                    <button className='deleteBtn' onClick={() => handleDelete(dorm._id)}>
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                {dormID && <RoomList dormId={dormID} handleModalOpen={handleModalOpen} />}
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
        setRooms(response.data[0]);
    };

    const handleDelete = async (roomId) => {
        await axios.delete(`http://localhost:3001/dorms/deleteRoom/${dormId}/${roomId}`);
        fetchRooms();
    };

    return (
        <div className='roomList'>
            <div className='cardNav'>
                <h2>Rooms</h2>
                <button onClick={() => handleModalOpen('room')}>
                    <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faBed} /> Add Room
                </button>
            </div>
            <div className='rooms'>
            {rooms && rooms.map(room => (
                <div className='roomCard' key={room._id}>
                    {room.roomPics.length !== 0
                        ? <img src={room.roomPics[0]} alt='Room' width='100' height='100' style={{objectFit: 'cover'}}/>
                        : <img src={noImage} alt='No Image' width='100' height='100' style={{objectFit: 'cover'}}/>
                    }
                    <div className='roomDetails'>
                        <h4>{room.roomType}</h4>
                        <div className='roomActions'>
                            <button className='editBtn' onClick={() => handleModalOpen('editRoom', room, dormId)}>
                                <FontAwesomeIcon icon={faEdit} /> Edit
                            </button>
                            <button className='deleteBtn' onClick={() => handleDelete(room._id)}>
                                <FontAwesomeIcon icon={faTrash} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
    );
};

export default DormList;
