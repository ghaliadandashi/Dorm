import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import '../styling/components/modal.css'
const Modal = ({ isOpen, onClose, onSubmit, title, initialData, fields }) => {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal">
                <div className='modalNav'>
                    <h2>{title}</h2>
                    <FontAwesomeIcon style={{cursor:"pointer"}} onClick={onClose} icon={faTimes}/>
                </div>
                <div className='modal-form'>
                {fields.map(field => (
                    <div key={field.name} className='modal-elements'>
                        <label>{field.label}</label>
                        {field.type === 'select' ? (
                            <select name={field.name} value={formData[field.name]} onChange={handleChange}>
                                {field.options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                        )}

                    </div>
                ))}
                </div>
                {console.log(formData)}
                <button onClick={() => onSubmit(formData)}>{title}</button>
            </div>
        </div>
    );
};

export default Modal;
