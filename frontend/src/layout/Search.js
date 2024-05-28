import React, { useState } from 'react';
import axios from 'axios';
import '../styling/components/Search.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';


const servicesList = ['wifi', 'market', 'laundry', 'gym', 'sharedKitchen', 'restaurant', 'studyRoom', 'cleaning', 'security', 'elevator'];

const Search = ({ setDorms }) => {
    const { t } = useTranslation();
    const [selectedServices, setSelectedServices] = useState([]);
    const [type, setType] = useState('');
    const [roomType, setRoomType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState(2500);
    const [minSpace, setMinSpace] = useState('');
    const [maxSpace, setMaxSpace] = useState('');
    const [viewType, setViewType] = useState('');
    const [showServices, setShowServices] = useState(false);

    const handleServiceChange = (service) => {
        setSelectedServices((prevState) =>
            prevState.includes(service)
                ? prevState.filter((s) => s !== service)
                : [...prevState, service]
        );
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/search', {
                params: {
                    service: selectedServices.join(','),
                    type,
                    roomType,
                    minPrice,
                    maxPrice,
                    minSpace,
                    maxSpace,
                    viewType
                }
            });
            setDorms(response.data);
        } catch (error) {
            console.error('Error searching dormitories:', error);
        }
    };
    const translateService = (service) => {
        return t(`servicesList.${service}`);
    };

    return (
        <div className="search">
            <div className="search-filters">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">{t('type')}</option>
                    <option value="on-campus">{t('onCampus')}</option>
                    <option value="off-campus">{t('offCampus')}</option>
                </select>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    <option value="">{t('roomTypesTitle')}</option>
                    <option value="Single">{t('roomTypes.Single')}</option>
                    <option value="Double">{t('roomTypes.Double')}</option>
                    <option value='Triple'>{t('roomTypes.Triple')}</option>
                    <option value='Studio'>{t('roomTypes.Studio')}</option>
                    <option value="Quad">{t('roomTypes.Quad')}</option>
                    <option value="Suite">{t('roomTypes.Suite')}</option>
                </select>
                <div className="price-slider">
                    <label>{t('maxPrice')}: {maxPrice}$</label>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <div className="services-toggle" onClick={() => setShowServices(!showServices)}>
                    {t('servicesTitle')} <FontAwesomeIcon icon={faChevronDown} />
                </div>
                {showServices && (
                    <div className="services">
                        {servicesList.map((service) => (
                            <label key={service}>
                                <input
                                    type="checkbox"
                                    checked={selectedServices.includes(service)}
                                    onChange={() => handleServiceChange(service)}
                                />
                                {translateService(service)}
                            </label>
                        ))}
                    </div>
                )}
                <input
                    type="number"
                    placeholder={t('minSpace')}
                    value={minSpace}
                    onChange={(e) => setMinSpace(e.target.value)}
                />
                <input
                    type="number"
                    placeholder={t('maxSpace')}
                    value={maxSpace}
                    onChange={(e) => setMaxSpace(e.target.value)}
                />
                <select
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}
                >
                    <option value="">{t('viewType')}</option>
                    <option value='CityView'>{t('viewTypes.CityView')}</option>
                    <option value='StreetView'>{t('viewTypes.StreetView')}</option>
                    <option value='SeaView'>{t('viewTypes.SeaView')}</option>
                    <option value='CampusView'>{t('viewTypes.CampusView')}</option>
                </select>
                <button onClick={handleSearch}>{t('apply')}</button>
            </div>
        </div>
    );
};

export default Search;
