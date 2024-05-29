import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import '../styling/loginPage.css';
import {useTranslation} from "react-i18next"; // Import the CSS file

const Login = () => {
  const [showPopup, setShowPopup] = useState(false); // State to track popup visibility
  const {t}= useTranslation()
  const handlePopupOpen = () => {
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
  };

  return (
    <div className="login-page">
      <div className="left-section"> {/* Dark blue section */}
        <div className="intro-content">
          <h1 className="title">{t('beginNow')}</h1>
          <p className="subtitle">{t('findYourDorm')}</p>
          <div className="actions">
            <button className="action-btn" onClick={handlePopupOpen}>
              {t('sigin')}
            </button>
            <Link to="/register" className="action-btn">
              {t('registerDormOwner')}
            </Link>
          </div>
        </div>
      </div>

      <div className="right-section"> {/* White section */}
        {showPopup && (
          <LoginForm onClose={handlePopupClose} /> // Pass the close function to LoginForm
        )}
      </div>
    </div>
  );
};

export default Login;
