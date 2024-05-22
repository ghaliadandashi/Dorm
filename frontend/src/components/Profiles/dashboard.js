import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../../styling/components/dashboard.css';

Chart.register(...registerables);

const Dashboard = ({ dormId }) => {
    const [occupancyRate, setOccupancyRate] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [prices, setPrices] = useState([]);
    const [response, setResponse] = useState('');

    useEffect(() => {
        fetchInsights();
        fetchPriceData();
    }, []);

    const fetchInsights = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/insights/${dormId}`);
            const { occupancyRate, totalRevenue, reviews } = response.data;
            setOccupancyRate(occupancyRate);
            setTotalRevenue(totalRevenue);
            setReviews(reviews);
        } catch (error) {
            console.error('Error fetching insights:', error);
        }
    };

    const fetchPriceData = async () => {
        try {
            const response = await axios.get(`/api/prices/${dormId}`);
            setPrices(response.data);
        } catch (error) {
            console.error('Error fetching price data:', error);
        }
    };

    const handleResponseSubmit = async (reviewId) => {
        try {
            const response = await axios.post(`/api/reviews/respond/${reviewId}`, { response });
            fetchInsights();
            setResponse('');
        } catch (error) {
            console.error('Error responding to review:', error);
        }
    };

    const priceData = {
        labels: prices.map(price => new Date(price.date).toLocaleDateString()),
        datasets: [
            {
                label: 'Price',
                data: prices.map(price => price.price),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    return (
        <div className="dashboard">
            <h1>Dormitory Dashboard</h1>
            <div className="insights">
                <div className="insight">
                    <h2>Occupancy Rate</h2>
                    <p>{occupancyRate}%</p>
                </div>
                <div className="insight">
                    <h2>Total Revenue</h2>
                    <p>${totalRevenue}</p>
                </div>
            </div>
            <h2>Reviews</h2>
            {reviews.map(review => (
                <div key={review._id} className="review">
                    <p>{review.comment}</p>
                    <p>Rating: {review.rating}</p>
                    <p>Student: {review.student.name}</p>
                    {review.response ? (
                        <p>Response: {review.response}</p>
                    ) : (
                        <div>
                            <textarea
                                value={response}
                                onChange={(e) => setResponse(e.target.value)}
                                placeholder="Respond to review"
                            />
                            <button onClick={() => handleResponseSubmit(review._id)}>Submit Response</button>
                        </div>
                    )}
                </div>
            ))}
            <h2>Price Trends</h2>
            <Line data={priceData} />
        </div>
    );
};

export default Dashboard;
