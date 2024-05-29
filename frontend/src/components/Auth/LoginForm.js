import React, { useState } from 'react';
import axios from 'axios';
import { Alert, Spin } from 'antd';
import { WindowsFilled } from '@ant-design/icons';
import { signInWithMicrosoft } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../../styling/loginForm.css';

const LoginForm = ({ onClose }) => {
  const { t } = useTranslation();
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    axios
        .post('http://localhost:3001/api/login', loginForm, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          navigate('/home');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Login failed:', error.response?.data?.message || 'Error during login');
          setIsLoading(false);
          setError(error.response?.data?.message || t('generalLoginError'));
        });
  };

  if (isLoading) {
    return <Spin />; // Loading spinner during processing
  }

  return (
      <div className="popup-container">
        <div className="popup">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="email">{t('email')}</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleInputChange}
                  required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">{t('password')}</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  required
              />
            </div>
            <input type="submit" value={t('login')} />
            {error && (
                <div className="error-message">
                  <Alert
                      className="popup-alert"
                      type="error"
                      message={error}
                      closable
                  />
                </div>
            )}
          </form>
          <div className="alternate-login">
            <h4>{t('or')}</h4>
            <button className="microsoft-login-btn" onClick={signInWithMicrosoft}>
              <WindowsFilled /> {t('loginWithMicrosoft')}
            </button>
          </div>
          <button className="popup-close-btn" onClick={onClose}>
            {t('close')}
          </button>
        </div>
      </div>
  );
};

export default LoginForm;
