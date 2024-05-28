import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import '../styling/components/modal.css'
import {uploadFileToFirebase} from "../firbase-storage";

const Modal = ({ isOpen, onClose, onSubmit, title, initialData, fields }) => {
    const [formData, setFormData] = useState(initialData);


    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file') {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: files
            }));
        } else if (type === 'checkbox') {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: checked
                    ? [...(prevFormData[name] || []), value]
                    : prevFormData[name].filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async () => {
        const formDataCopy = { ...formData };

        const fileFields = ['dormPics', 'roomPics','ownershipFiles'];
        for (const field of fileFields) {
            if (formDataCopy[field] instanceof FileList) {
                const fileArray = Array.from(formDataCopy[field]);
                const uploadPromises = fileArray.map(file => uploadFileToFirebase(file));
                const fileUrls = await Promise.all(uploadPromises);
                formDataCopy[field] = fileUrls;  // Replace the FileList with the array of URLs
            }
        }

        onSubmit(formDataCopy);
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
                        ):(field.type === 'checkbox')?
                            (
                                <>
                                    {field.options.map(option=>(
                                        <div className='modal-services'>
                                            <input
                                                type='checkbox'
                                                value={option.id}
                                                id={option.id}
                                                name={field.name}
                                                checked={formData[field.name]?.includes(option.id)}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor={option.id}>{option.label}</label>
                                        </div>
                                    ))}
                                </>
                            )
                            :field.type === 'file'?(
                            <input
                                type={field.type}
                                name={field.name}
                                onChange={handleChange}
                                multiple
                            />
                        ):(
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
                {/*{console.log(formData)}*/}
                <button onClick={handleSubmit}>{title}</button>
            </div>
        </div>
    );
};

export default Modal;
