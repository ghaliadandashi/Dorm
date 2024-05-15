// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
//
// const RoomList = ({ dormId, handleModalOpen }) => {
//     const [rooms, setRooms] = useState([]);
//
//     useEffect(() => {
//         fetchRooms();
//     }, [dormId]);
//
//     const fetchRooms = async () => {
//         const response = await axios.get(`http://localhost:3001/dorms/rooms/getRooms/${dormId}`);
//         setRooms(response.data);
//     };
//
//     const handleDelete = async (roomId) => {
//         await axios.delete(`http://localhost:3001/api/rooms/${roomId}`);
//         fetchRooms();
//     };
//
//     return (
//         <div>
//             <button onClick={() => handleModalOpen('room')}>
//                 <FontAwesomeIcon icon={faPlus} /> Add Room
//             </button>
//             {rooms.map(room => (
//                 <div key={room.id}>
//                     <h4>{room.name}</h4>
//                     <button onClick={() => handleModalOpen('editRoom', room, dormId)}>
//                         <FontAwesomeIcon icon={faEdit} /> Edit
//                     </button>
//                     <button onClick={() => handleDelete(room.id)}>
//                         <FontAwesomeIcon icon={faTrash} /> Delete
//                     </button>
//                 </div>
//             ))}
//         </div>
//     );
// };
//
// export default RoomList;
