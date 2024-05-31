import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";
import '../../styling/components/RegisterForm.css'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from '../../firebase-config';
import { useNotification } from "../../layout/Notifications";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

const RegisterForm = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const { addNotification } = useNotification();
    const [selectedServices, setSelectedServices] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        name: '',
        email: '',
        password: '',
        dob: '',
        phoneNo: '',
        dormName: '',
        streetName: '',
        cityName: '',
        capacity: '',
        dormType: 'on-campus',
        services: selectedServices,
        personalFile: [],
        ownershipFile: [],
        dormPics: [],
        langPref: ''
    });

    const handleInputChange = (e) => {
        const { name, type, files } = e.target;
        if (type === "file") {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: prevFormData[name] ? [...prevFormData[name], ...files] : [...files]
            }));
        } else {
            const { value } = e.target;
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const services = [
        { id: 'wifi', label: t('wifi') },
        { id: 'laundry', label: t('laundry') },
        { id: 'market', label: t('market') },
        { id: 'sharedKitchen', label: t('sharedKitchen') },
        { id: 'restaurant', label: t('restaurant') },
        { id: 'gym', label: t('gym') },
        { id: 'studyRoom', label: t('studyRoom') },
        { id: 'cleaning', label: t('cleaning') },
        { id: 'security', label: t('security') },
        { id: 'elevator', label: t('elevator') }
    ];

    const handleServiceChange = (event) => {
        const { id, checked } = event.target;
        setSelectedServices(prev =>
            checked ? [...prev, id] : prev.filter(serviceId => serviceId !== id)
        );
    };

    function printFormData(formData) {
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
    }

    const sanitizeFileName = (fileName) => {
        return fileName.replace(/[^a-zA-Z0-9.]/g, "_");
    };

    const uploadFileToFirebase = async (file) => {
        if (!file) {
            console.error('No file provided for upload');
            return;
        }
        const sanitizedFileName = sanitizeFileName(file.name);
        const fileRef = ref(storage, `uploads/${sanitizedFileName}`);
        try {
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
        } catch (error) {
            console.error(`Error uploading file to Firebase: ${error.message}`);
            throw error;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const uploadPromises = [];
        const fileLabels = {};
        ['personalFile', 'ownershipFile', 'dormPics'].forEach(key => {
            const files = formData[key];
            if (files) {
                Array.from(files).forEach(file => {
                    const promise = uploadFileToFirebase(file).then(url => ({ url, label: key }));
                    uploadPromises.push(promise);
                    fileLabels[key] = fileLabels[key] ? [...fileLabels[key], promise] : [promise];
                });
            }
        });

        try {
            const results = await Promise.all(uploadPromises);
            const submissionData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (!['personalFile', 'ownershipFile', 'dormPics', 'services'].includes(key)) {
                    submissionData.append(key, value);
                }
            });

            results.forEach(({ url, label }) => {
                submissionData.append(`files[${label}]`, url);
            });

            selectedServices.forEach(serviceId => {
                submissionData.append('services', serviceId);
            });

            const response = await axios.post('http://localhost:3001/api/register', submissionData);
            addNotification(t('registrationSuccessful'), 'success');
            setTimeout(() => navigate('/home'), 3000);
        } catch (error) {
            console.error('Failed during the registration process:', error);
            addNotification(t('registrationFailed'), 'error');
            setErrors(error.response && error.response.data && error.response.data.errors ? error.response.data.errors : [t('failedToProcessForm')]);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <div className="register-container">
                <div className="register-form">
                    <h1>{t('register')}</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='register-personal-info'>
                            <h3><FontAwesomeIcon icon={faUser} />  {t('personalInfo')}</h3>
                            {errors.length > 0 && (
                                <div style={{ color: 'red' }}>
                                    {errors.map((error, index) => (
                                        <p key={index}>{error.msg}</p>
                                    ))}
                                </div>
                            )}
                            <label htmlFor='firstName'>{t('firstName')} </label>
                            <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleInputChange} />
                            <label htmlFor='lastName'>{t('lastName')} </label>
                            <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleInputChange} />
                            <label htmlFor='email'>{t('email')} </label>
                            <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange} />
                            <label htmlFor='password'>{t('password')}</label>
                            <input type='password' id='password' name='password' value={formData.password} onChange={handleInputChange} />
                            <label htmlFor='dob'>{t('dob')}</label>
                            <input type='date' id='dob' name='dob' value={formData.dob} onChange={handleInputChange} />
                            <label htmlFor='phoneNo'>{t('phoneNo')}</label>
                            <input type='tel' id='phoneNo' name='phoneNo' value={formData.phoneNo} onChange={handleInputChange} />
                            <select id='langPref' name='langPref' value={formData.langPref} onChange={handleInputChange}>
                                <option>{t('selectLangPref')}</option>
                                <option value='english'>{t('english')}</option>
                                <option value='turkish'>{t('turkish')}</option>
                            </select>
                            <label htmlFor='personalFile'>{t('uploadPersonalDocs')}</label>
                            <input type='file' id='personalFile' name='personalFile' onChange={handleInputChange} multiple />
                        </div>
                        <div className='register-dorm-info'>
                            <h3><FontAwesomeIcon icon={faBuilding} />  {t('dormInfo')}</h3>
                            <label htmlFor='dormName'>{t('dormName')}</label>
                            <input type='text' id='dormName' name='dormName' value={formData.dormName} onChange={handleInputChange} />
                            <label htmlFor='file'>{t('uploadOwnershipDocs')}</label>
                            <input type='file' id='ownershipFile' name='ownershipFile' onChange={handleInputChange} />
                            <label htmlFor='streetName'>{t('streetName')}</label>
                            <input type='text' id='streetName' name='streetName' value={formData.streetName} onChange={handleInputChange} />
                            <select id='cityName' name='cityName' value={formData.cityName} onChange={handleInputChange}>
                                <option>{t('selectCity')}</option>
                                <option value='Nicosia'>{t('nicosia')}</option>
                                <option value='Kyrenia'>{t('kyrenia')}</option>
                                <option value='Famagusta'>{t('famagusta')}</option>
                                <option value='Iskele'>{t('iskele')}</option>
                                <option value='Guzelyurt'>{t('guzelyurt')}</option>
                                <option value='Lefke'>{t('lefke')}</option>
                            </select>
                            <label htmlFor='capacity'>{t('capacity')}</label>
                            <input type='number' id='capacity' name='capacity' min='1' max='1500' value={formData.capacity} onChange={handleInputChange} />
                            {(formData.capacity > 1500) ? <div style={{ padding: '10px', backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#FF0000' }}>{t('invalidInput')}</div> : null}
                            <label htmlFor='dormPics'>{t('uploadDormPics')}</label>
                            <input type='file' id='dormPics' name='dormPics' onChange={handleInputChange} multiple />
                            <label htmlFor='dormType'>{t('dormType')}</label>
                            <select id='dormType' value={formData.dormType} name='dormType' onChange={handleInputChange}>
                                <option value='on-campus'>{t('onCampus')}</option>
                                <option value='off-campus'>{t('offCampus')}</option>
                            </select>
                            <div>
                                <h5>{t('servicesOffered')}</h5>
                                {services.map(service => (
                                    <div key={service.id}>
                                        <input
                                            type="checkbox"
                                            id={service.id}
                                            value={service.id}
                                            checked={selectedServices.includes(service.id)}
                                            onChange={handleServiceChange}
                                        />
                                        <label htmlFor={service.id}>{service.label}</label>
                                    </div>
                                ))}
                            </div>
                            <input type='submit' value={t('register')} />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default RegisterForm;
