import React, { useEffect, useState } from 'react';
import avatar from "../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp";
import { deleteFileFromFirebase, uploadFileToFirebase } from "../../firbase-storage";
import axios from "axios";
import {useAuth} from "../Auth/AuthHook";

const ProfilePicSection = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        phoneNo: '',
        profilePic: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const {role} =useAuth()

    useEffect(() => {
        axios.get(`http://localhost:3001/api/profile`, { withCredentials: true })
            .then(response => {
                setProfile({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    dob: response.data.user.dob,
                    phoneNo: response.data.user.phoneNo,
                    profilePic: response.data.user.profilePic
                });
            })
            .catch(error => console.error("Failed to fetch user data:", error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handleSubmitPersonalInfo = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:3001/api/profileEdit', profile, { withCredentials: true });
            setProfile(response.data);
            setEditMode(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const downloadURL = await uploadFileToFirebase(file);
            const response = await axios.post('http://localhost:3001/api/profile/profilePic', { pictureUrl: downloadURL }, { withCredentials: true });
            setProfile(prevProfile => ({ ...prevProfile, profilePic: response.data.pictureUrl }));
            window.location.reload();
        } catch (error) {
            console.error('Failed to update picture URL in the backend:', error);
        }
    };

    const handleDeletePicture = async () => {
        if (!profile.profilePic) return;

        try {
            await deleteFileFromFirebase(profile.profilePic);
            await axios.delete('http://localhost:3001/api/profile/profilePic', { withCredentials: true });
            setProfile(prevProfile => ({ ...prevProfile, profilePic: '' }));
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete picture URL in the backend:', error);
        }
    };

    return (
        <div className="personalInfo">
            <div className="profileNav">
                <div className='profilePicSection'>
                    {profile.profilePic ? (
                        <img src={profile.profilePic} width="150" height="150" style={{ objectFit: "cover" }} id="profilePic" alt="Profile" />
                    ) : (
                        <img src={avatar} width="150" height="150" style={{ objectFit: "cover" }} id="profilePic" alt="Profile" />
                    )}
                    <div className="updatePicSection">
                        <label className="custom-file-upload">
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            Change Picture
                        </label>
                        <button onClick={handleDeletePicture}>Delete Picture</button>
                    </div>
                </div>
                <div className='editBtn'>
                    <button onClick={() => setEditMode(true)}>Edit Info</button>
                </div>
            </div>
            {editMode ? (
                <form onSubmit={handleSubmitPersonalInfo}>
                    <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                    />
                    {role !== 'student'?<input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                    />:null}
                    <input
                        type="text"
                        name="phoneNo"
                        value={profile.phoneNo}
                        onChange={handleInputChange}
                        placeholder="Phone"
                    />
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Phone:</strong> {profile.phoneNo}</p>
                </div>
            )}
        </div>
    );
};

export default ProfilePicSection;
