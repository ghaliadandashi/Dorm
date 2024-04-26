import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/Auth/LoginForm';
import '../styling/loginPage.css'; // Import the CSS file

const Login = () => {
  const [showPopup, setShowPopup] = useState(false); // State to track popup visibility

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
          <h1 className="title">Begin now</h1>
          <p className="subtitle">Find your dorm</p>
          <div className="actions">
            <button className="action-btn" onClick={handlePopupOpen}>
              Sign-in
            </button>
            <Link to="/register" className="action-btn">
              Register As Dorm Owner
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
