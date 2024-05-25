import React, { useState } from 'react';
import axios from 'axios';
import '../styling/components/Search.css';

const Search = ({ setDorms }) => {
    const [service, setService] = useState('');
    const [type, setType] = useState('');
    const [roomType, setRoomType] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState(2500);
    const [minSpace, setMinSpace] = useState('');
    const [maxSpace, setMaxSpace] = useState('');
    const [viewType, setViewType] = useState('');

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/search', {
                params: {
                    service,
                    type,
                    roomType,
                    minPrice,
                    maxPrice,
                    minSpace,
                    maxSpace,
                    viewType
                }
            });
            setDorms(response.data); // Set the search results to the state in the parent component
        } catch (error) {
            console.error('Error searching dormitories:', error);
        }
    };

    return (
        <div className="search">
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Type</option>
                    <option value="on-campus">On-campus</option>
                    <option value="off-campus">Off-campus</option>
                </select>
                <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    <option value="">Room Type</option>
                    <option value="Single">Single room</option>
                    <option value="Double">Double room</option>
                    <option value='Triple'>Triple room</option>
                    <option value='Studio'>Studio</option>
                    <option value="Quad">Quad room</option>
                    <option value="Suite">Suite</option>
                </select>
                <div className="price-slider">
                    <label>Max Price: {maxPrice}$</label>
                    <input
                        type="range"
                        min="0"
                        max="10000"
                        step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
                <input
                    type="number"
                    placeholder="Min Space (m sq)"
                    value={minSpace}
                    onChange={(e) => setMinSpace(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Space (m sq)"
                    value={maxSpace}
                    onChange={(e) => setMaxSpace(e.target.value)}
                />
                <select
                    placeholder="View Type"
                    value={viewType}
                    onChange={(e) => setViewType(e.target.value)}>
                    <option value='CityView'>City View</option>
                    <option value='StreetView'>Street View</option>
                    <option value='SeaView'>Sea View</option>
                    <option value='CampusView'>Campus View</option>
                </select>
                <button onClick={handleSearch}>Apply</button>
            </div>
        </div>
    );
};

export default Search;
