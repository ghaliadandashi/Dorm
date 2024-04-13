import React, { useEffect, useState } from 'react';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import LoadingPage from "../../pages/LoadingPage";


const RegisterForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        name:'',
        email: '',
        password:'',
        dob:'',
        phoneNo:'',
        dormName:'',
        streetName:'',
        cityName:'',
        capacity:'',
        dormType:'',
        services: selectedServices,
        personalFile: null,
        ownershipFile: null,
        dormPics: null,
        langPref:''
    });

    const handleInputChange = (e) => {
        const { name, type, value, files } = e.target;

        if (type === "file" && files.length) {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: Array.from(files).map(file => file.name)
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };
    const services = [
        { id: 'wifi', label: 'Wi-Fi' },
        { id: 'laundry', label: 'Laundry' },
        { id: 'market', label: 'Market' },
        { id: 'sharedKitchen', label:'Shared Kitchen'},
        { id: 'restaurant', label: 'Restaurant' },
        { id: 'gym', label: 'Gym Access' },
        { id: 'studyRoom', label: 'Study Rooms'},
        { id: 'cleaning', label: 'Weekly Cleaning Services' },
        { id: 'security', label: '24/7 Security' },
        { id: 'elevator', label: 'Elevator'}
    ];
    const handleServiceChange = (event) => {
        const { id, checked } = event.target;
        setSelectedServices(prev =>
            checked ? [...prev, id] : prev.filter(serviceId => serviceId !== id)
        );
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const submissionData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'personalFile' || key === 'ownershipFile' || key === 'dormPics') {
                if (value !== null) submissionData.append(key, value);
            } else if (key !== 'services') {
                submissionData.append(key, value);
            }
        });
        selectedServices.forEach(serviceId => {
            submissionData.append('services', serviceId);
        });


        axios.post('http://localhost:3001/api/register', submissionData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                console.log('Form submitted successfully:', response.data);
                setTimeout(() => {
                    navigate('/home');
                }, 3000);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors([]);
                }
                setIsLoading(false);
            });
    };

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='form' style={{backgroundColor:"white", padding:'10px',display:'flex',flexDirection:"column"}}>
                <h4>Personal Info</h4>
                {errors.length > 0 && (
                    <div style={{ color: 'red' }}>
                        {errors.map((error, index) => (
                            <p key={index}>{error.msg}</p>
                        ))}
                    </div>
                )}
                <label htmlFor='firstName'>First Name </label>
                <input type='text' id='firstName' name='firstName' value={formData.firstName} onChange={handleInputChange}/>
                <label htmlFor='lastName'>Last Name </label>
                <input type='text' id='lastName' name='lastName' value={formData.lastName} onChange={handleInputChange}/>
                <label htmlFor='email'>Email </label>
                <input type='email' id='email' name='email' value={formData.email} onChange={handleInputChange}/>
                <label htmlFor='password'>Password</label>
                <input type='password' id='password' name='password' value={formData.password} onChange={handleInputChange}/>
                <label htmlFor='dob'>Date of Birth</label>
                <input type='date' id='dob' name='dob' value={formData.dob} onChange={handleInputChange}/>
                <label htmlFor='phoneNo'>Phone Number</label>
                <input type='tel' id='phoneNo' name='phoneNo' value={formData.phoneNo} onChange={handleInputChange}/>
                <select id='langPref' name='langPref' value={formData.langPref} onChange={handleInputChange}>
                    <option>Select Language Preference</option>
                    <option>English</option>
                    <option>Turkish</option>
                </select>
                <label htmlFor='personalFile'>Upload Personal Identification Documents</label>
                <input type='file' id='personalFile' name='personalFile' onChange={handleInputChange} multiple/>
                {formData.personalFile && formData.personalFile.map((fileName, index) => (
                    <div key={index}>{fileName}</div>
                ))}
                <h4>Dorm Info</h4>
                <label htmlFor='dormname'>Dorm Name</label>
                <input type='text' id='dormName' name='dormName' value={formData.dormName} onChange={handleInputChange}/>
                <label htmlFor='file'>Upload ownership documents</label>
                <input type='file' id='ownershipFile' name='ownershipFile' onChange={handleInputChange}/>
                <label htmlFor='street'>Street Name</label>
                <input type='text' id='streetName' name='streetName' value={formData.streetName} onChange={handleInputChange}/>
                <select id='cityName' name='cityName' value={formData.cityName} onChange={handleInputChange}>
                    <option>-Select City-</option>
                    <option>Nicosia</option>
                    <option>Kyrenia</option>
                    <option>Famagusta</option>
                    <option>Iskele</option>
                    <option>Guzelyurt</option>
                    <option>Lefke</option>
                </select>
                <label htmlFor='capacity'>Dorm Capacity</label>
                <input type='number' id='capacity' name='capacity' min='1' max='1500' value={formData.capacity} onChange={handleInputChange}/>
                {(formData.capacity >1500)? <div style={{padding:'10px',backgroundColor:'rgba(255, 0, 0, 0.2)',color:'#FF0000'}}>INVALID INPUT</div>: null}
                <label htmlFor='dormPics'>Upload Dorm Pictures</label>
                <input type='file' id='dormPics' name='dormPics' onChange={handleInputChange} multiple />
                {formData.dormPics && formData.dormPics.map((fileName, index) => (
                    <div key={index}>{fileName}</div>
                ))}
                <label htmlFor='dormType'>Dorm Type</label>
                <select id='dormType' value={formData.dormType} name='dormType' onChange={handleInputChange}>
                    <option>On-Campus</option>
                    <option>Off-Campus</option>
                </select>
                <div>
                    <h5>Services Offered:</h5>
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
                <input type='submit' value='Register' />
            </form>
        </>
    )
}

export default RegisterForm;
