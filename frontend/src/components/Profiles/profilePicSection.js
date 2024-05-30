import React, { useEffect, useState } from 'react';
import avatar from "../../images/DALL·E 2024-05-05 19.40.58 - A gender-neutral, anonymous avatar for a profile picture. The design features a sleek, minimalist silhouette with abstract elements. The color palette.webp";
import { deleteFileFromFirebase, uploadFileToFirebase } from "../../firbase-storage";
import axios from "axios";
import { useAuth } from "../Auth/AuthHook";
import { useTranslation } from "react-i18next";
import { useNotification } from "../../layout/Notifications";
import {Link} from "react-router-dom";

const ProfilePicSection = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        phoneNo: '',
        profilePic: '',
        bio: '',
        roommatePreferences: {
            gender: '',
            cleanliness: '',
            studyHabits: '',
            socialHabits: '',
            smoking: '',
            pets: ''
        }
    });
    const [roommateSuggestions, setRoommateSuggestions] = useState([]);
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { role } = useAuth();
    const { addNotification } = useNotification();

    useEffect(() => {
        axios.get(`http://localhost:3001/api/profile`, { withCredentials: true })
            .then(response => {
                setProfile(response.data);
                fetchRoommateSuggestions(response.data.preferences);
            })
            .catch(error => console.error("Failed to fetch user data:", error));
    }, [profile.profilePic]);

    const fetchRoommateSuggestions = (preferences) => {
        axios.post('http://localhost:3001/api/roommateSuggestions', preferences, { withCredentials: true })
            .then(response => {
                setRoommateSuggestions(response.data);
            })
            .catch(error => console.error("Failed to fetch roommate suggestions:", error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
    };

    const handlePreferenceChange = (e, category) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [category]: {
                ...prevProfile[category],
                [name]: value
            }
        }));
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return re.test(email);
    };

    const validatePhoneNumber = (phoneNo) => {
        const re = /^[0-9]{10,15}$/; // Adjust the range as needed
        return re.test(phoneNo);
    };

    const handleSubmitPersonalInfo = async (e) => {
        e.preventDefault();

        if (!validateEmail(profile.email)) {
            addNotification(t('Invalid email format'), 'error');
            return;
        }

        if (!validatePhoneNumber(profile.phoneNo)) {
            addNotification(t('Invalid phone number format'), 'error');
            return;
        }

        try {
            const response = await axios.put('http://localhost:3001/api/profileEdit', profile, { withCredentials: true });
            setProfile(response.data);
            setEditMode(false);
            addNotification(t("profileUpdated"), 'success');
            fetchRoommateSuggestions(profile.preferences);
        } catch (error) {
            console.error('Failed to update profile:', error);
            addNotification(t('Failed to update profile'), 'error');
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const downloadURL = await uploadFileToFirebase(file);
            const response = await axios.post('http://localhost:3001/api/profile/profilePic', { pictureUrl: downloadURL }, { withCredentials: true });
            setProfile(prevProfile => ({ ...prevProfile, profilePic: response.data.pictureUrl }));
            addNotification(t('profilePicUpdated'), 'success');
        } catch (error) {
            console.error('Failed to update picture URL in the backend:', error);
            addNotification(t('Failed to update profile picture'), 'error');
        }
    };

    const handleDeletePicture = async () => {
        if (!profile.profilePic) return;

        try {
            await deleteFileFromFirebase(profile.profilePic);
            await axios.delete('http://localhost:3001/api/profile/profilePic', { withCredentials: true });
            setProfile(prevProfile => ({ ...prevProfile, profilePic: '' }));
            addNotification(t('profilePicDeleted'), 'error');
        } catch (error) {
            console.error('Failed to delete picture URL in the backend:', error);
            addNotification(t('Failed to delete profile picture'), 'error');
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
                            {t('changePicture')}
                        </label>
                        <button onClick={handleDeletePicture}>{t('deletePicture')}</button>
                    </div>
                </div>
                <div className='editBtn'>
                    <button onClick={() => setEditMode(true)}>{t('editInfo')}</button>
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
                    {role !== 'student' ? (
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleInputChange}
                            placeholder="Email"
                        />
                    ) : null}
                    <input
                        type="text"
                        name="phoneNo"
                        value={profile.phoneNo}
                        onChange={handleInputChange}
                        placeholder="Phone"
                    />
                    <input
                        type="text"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        placeholder={t('bio')}
                    />
                    {role === 'student'?
                        <>
                    <h3>{t('Roommate Preferences')}</h3>
                    <select name="gender" value={profile.preferences?.gender} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Gender')}</option>
                        <option value="Male">{t('Male')}</option>
                        <option value="Female">{t('Female')}</option>
                        <option value="No Preference">{t('No Preference')}</option>
                    </select>
                    <select name="cleanliness" value={profile.preferences?.cleanliness} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Cleanliness')}</option>
                        <option value="Very Clean">{t('Very Clean')}</option>
                        <option value="Moderately Clean">{t('Moderately Clean')}</option>
                        <option value="Not Important">{t('Not Important')}</option>
                    </select>
                    <select name="studyHabits" value={profile.preferences?.studyHabits} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Study Habits')}</option>
                        <option value="Quiet and Studious">{t('Quiet and Studious')}</option>
                        <option value="Moderate Noise">{t('Moderate Noise')}</option>
                        <option value="Noisy">{t('Noisy')}</option>
                    </select>
                    <select name="socialHabits" value={profile.preferences?.socialHabits} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Social Habits')}</option>
                        <option value="Social and Outgoing">{t('Social and Outgoing')}</option>
                        <option value="Moderate Social">{t('Moderate Social')}</option>
                        <option value="Quiet and Reserved">{t('Quiet and Reserved')}</option>
                    </select>
                    <select name="smoking" value={profile?.preferences?.smoking} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Smoking')}</option>
                        <option value="Non-Smoker">{t('Non-Smoker')}</option>
                        <option value="Smoker">{t('Smoker')}</option>
                        <option value="No Preference">{t('No Preference')}</option>
                    </select>
                    <select name="pets" value={profile?.preferences?.pets} onChange={(e) => handlePreferenceChange(e, 'roommatePreferences')}>
                        <option value="">{t('Select Pets')}</option>
                        <option value="No Pets">{t('No Pets')}</option>
                        <option value="Pets Allowed">{t('Pets Allowed')}</option>
                        <option value="No Preference">{t('No Preference')}</option>
                    </select></>:null}
                    <button type="submit">{t('saveChanges')}</button>
                    <button type="button" onClick={() => setEditMode(false)}>{t('cancel')}</button>
                </form>
            ) : (
                <div className="profile-info">
                    <p><strong>{t('name') + ':'}</strong> {profile.name}</p>
                    <p><strong>{t('email') + ':'}</strong> {profile.email}</p>
                    <p><strong>{t('phone') + ':'}</strong> {profile.phoneNo}</p>
                    {role === 'student' ? <p><strong>{t('bio')}:</strong>{profile.bio}</p> : null}
                </div>
            )}
            {role==='student'?
            <div className="roommate-suggestions">
                <h3>{t('Roommate Suggestions')}</h3>
                {roommateSuggestions.length > 0 ? (
                    roommateSuggestions.map((suggestion, index) => (
                        <div key={index} className='suggestion-card'>
                            <p><strong>{t('Name')}:</strong> <Link to={`/user/${suggestion._id}`}> {suggestion.name}</Link></p>
                            <p><strong>{t('Email')}:</strong> {suggestion.email}</p>
                            <p><strong>{t('Phone')}:</strong> {suggestion.phoneNo}</p>
                        </div>
                    ))
                ) : (
                    <p>{t('No roommate suggestions available')}</p>
                )}
            </div>:null}
        </div>
    );
};

export default ProfilePicSection;
