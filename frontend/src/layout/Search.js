import React, { useState } from 'react';
import axios from 'axios';
import '../styling/components/Search.css';

const Search = () => {
    const [location, setLocation] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [services, setServices] = useState('');
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/search', {
                params: { location, minPrice, maxPrice, services }
            });
            setResults(response.data);
        } catch (error) {
            console.error('Error searching dormitories:', error);
        }
    };

    return (
        <div className="search">
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Services (comma-separated)"
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="search-results">
                {results.map((dorm) => (
                    <div key={dorm._id} className="dorm-card">
                        <h2>{dorm.dormName}</h2>
                        <p>Location: {dorm.location}</p>
                        <p>Price: {dorm.rooms[0].pricePerSemester}</p>
                        <p>Services: {dorm.services.join(', ')}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
