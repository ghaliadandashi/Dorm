import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPlus, faEdit, faTrash, faHouse} from '@fortawesome/free-solid-svg-icons';

const DormList = ({ handleModalOpen }) => {
    const [dorms, setDorms] = useState([]);

    useEffect(() => {
        fetchDorms();
    }, []);

    const fetchDorms = async () => {
        const response = await axios.get('http://localhost:3001/api/dorm',{withCredentials:true});
        console.log(response)
        setDorms(response.data);
    };

    const handleDelete = async (dormId) => {
        await axios.delete(`http://localhost:3001/api/dorms/${dormId}`);
        fetchDorms();
    };

    return (
        <div>
            <button onClick={() => handleModalOpen('dorm')}>
                <FontAwesomeIcon icon={faPlus} /> <FontAwesomeIcon icon={faHouse}/> Add Dorm
            </button>
            {dorms.map(dorm => (
                <div key={dorm.id}>
                    <h3>{dorm.dormName}</h3>
                    <button onClick={() => handleModalOpen('Edit Dorm', dorm)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button onClick={() => handleDelete(dorm.id)}>
                        <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default DormList;
