import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

const PriceTrends = ({ dormId }) => {
    const [priceData, setPriceData] = useState([]);

    useEffect(() => {
        const fetchPriceHistory = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/dorms/price-history/${dormId}`);
                setPriceData(response.data);
            } catch (error) {
                console.error('Failed to fetch price history', error);
            }
        };

        fetchPriceHistory();
    }, [dormId]);

    const chartData = {
        labels: priceData.map(data => new Date(data.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Price Per Semester',
                data: priceData.map(data => data.pricePerSemester),
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false
            },
            {
                label: 'Summer Price',
                data: priceData.map(data => data.summerPrice),
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false
            }
        ]
    };

    return (
        <div>
            <h2>Historical Price Trends</h2>
            <Line data={chartData} />
        </div>
    );
};

export default PriceTrends;
