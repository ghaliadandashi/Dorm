import React, { useState } from 'react';
import '../../styling/components/settings.css';
import axios from "axios";
import { useNotification } from "../../layout/Notifications";
import LanguageSelector from "../LanguageSelector";
import { useAuth } from "../Auth/AuthHook";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { t } = useTranslation();
    const [pass, setPass] = useState('');
    const { addNotification } = useNotification();
    const { role } = useAuth();

    const handleChangePassword = () => {
        axios.put('http://localhost:3001/api/changePassword', { pass }, { withCredentials: true })
            .then(
                () => {
                    addNotification(t('passwordUpdatedSuccessfully'), 'success');
                    setPass('');
                }
            )
            .catch(error => {
                addNotification(t('errorUpdatingPassword'), 'error');
            });
    };

    return (
        <div className='settings-container'>
            {role !== 'student' ?
                <div className='change-Pass'>
                    <h2>{t('changePassword')}</h2>
                    <div>
                        <input
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            type='text'
                        />
                        <button onClick={handleChangePassword}>{t('change')}</button>
                    </div>
                </div> : null
            }

            <div className='language-selector'>
                <h2>{t('langPref')}</h2>
                <div>
                    <LanguageSelector />
                </div>
            </div>
        </div>
    );
}

export default Settings;
