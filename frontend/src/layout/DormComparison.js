import React, { useState } from 'react';
import '../styling/DormComparison.css';
import { useTranslation } from "react-i18next";

const DormComparison = ({ selectedDorms }) => {
    const { t } = useTranslation();
    const [isVisible, setIsVisible] = useState(true);

    if (selectedDorms.length < 2) {
        return null;
    }

    const renderServices = (services) => {
        return services.map(service => <li key={service}>{t(`servicesList.${service}`)}</li>);
    };

    return (
        <div className={`dorm-comparison ${isVisible ? 'visible' : 'hidden'}`}>
            <button onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? t('hideComparison') : t('showComparison')}
            </button>
            {isVisible && (
                <>
                    <h3>{t('comparison')}</h3>
                    <div className='comparison-grid'>
                        {selectedDorms.map((dorm, index) => (
                            <div key={index} className='dorm-card'>
                                <h4>{dorm.dormName}</h4>
                                <h5>{t('services')}</h5>
                                <ul>
                                    {renderServices(dorm.services)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DormComparison;
