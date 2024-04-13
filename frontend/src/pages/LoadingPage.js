import React from 'react';
import '../styling/pages/LoadingPage.css';

const LoadingPage = () => {
    return (
        <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
        </div>
    );
};

export default LoadingPage;
