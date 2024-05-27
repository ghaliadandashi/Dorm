import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import '../../styling/components/dashboard.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import {useNotification} from "../../layout/Notifications";

Chart.register(...registerables);

const Dashboard = ({ dormId }) => {
    const [granularity, setGranularity] = useState('month');
    const [occupancyRate, setOccupancyRate] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [response, setResponse] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [numReviews, setNumReviews] = useState(0);
    const [occupancyData, setOccupancyData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 3;
    const {addNotification} = useNotification()

    useEffect(() => {
        fetchInsights();
        fetchOccupancyData();
        fetchRevenueData();
    }, [granularity,reviews]);

    const fetchInsights = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/insights/${dormId}`);
            const { occupancyRate, totalRevenue, reviews, averageRating, numReviews } = response.data;
            setOccupancyRate(occupancyRate);
            setTotalRevenue(totalRevenue);
            setReviews(reviews);
            setAverageRating(averageRating);
            setNumReviews(numReviews);
        } catch (error) {
            console.error('Error fetching insights:', error);
        }
    };

    const fetchOccupancyData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/occupancy/${dormId}?granularity=${granularity}`);
            setOccupancyData(response.data);
        } catch (error) {
            console.error('Error fetching occupancy data:', error);
        }
    };

    const fetchRevenueData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/revenue/${dormId}?granularity=${granularity}`);
            setRevenueData(response.data);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
        }
    };

    const handleResponseSubmit = async (reviewId) => {
        try {
            await axios.post(`http://localhost:3001/reviews/respond/${reviewId}`, { response });
            fetchInsights();
            setResponse('');
        } catch (error) {
            console.error('Error responding to review:', error);
        }
    };

    const indexOfLastReview = currentPage * reviewsPerPage;
    const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const occupancyChartData = {
        labels: occupancyData.map(data => data.date),
        datasets: [
            {
                label: 'Occupancy Rate',
                data: occupancyData.map(data => data.rate),
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            }
        ]
    };

    const revenueChartData = {
        labels: revenueData.map(data => data.date),
        datasets: [
            {
                label: 'Total Revenue',
                data: revenueData.map(data => data.revenue),
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
            }
        ]
    };
    const deleteResponse=(reviewID)=>{
        axios.delete(`http://localhost:3001/reviews/deleteResponse/${reviewID}`)
            .then(addNotification('Response deleted successfully!','success'))
    }

    return (
        <div className="dashboard">
            <div className="insights">
                <div className="insight">
                    <h2>Occupancy Rate</h2>
                    <p>{occupancyRate}%</p>
                </div>
                <div className="insight">
                    <h2>Total Revenue</h2>
                    <p>${totalRevenue}</p>
                </div>
                <div className="insight">
                    <h2>Average Rating</h2>
                    <p>{averageRating}</p>
                </div>
                <div className="insight">
                    <h2>Number of Reviews</h2>
                    <p>{numReviews}</p>
                </div>
            </div>
            <div className="charts">
                <div className="chart">
                    <h2>Occupancy Rate Over Time</h2>
                    <Line data={occupancyChartData} />
                </div>
                <div className="chart">
                    <h2>Total Revenue Over Time</h2>
                    <Line data={revenueChartData} />
                </div>
                <div className="granularity">
                    <label htmlFor="granularity">View by:</label>
                    <select id="granularity" value={granularity} onChange={(e) => setGranularity(e.target.value)}>
                        <option value="day">Day</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                    </select>
                </div>
            </div>
            <h2>Reviews</h2>
            <div className='reviews-container'>
            {currentReviews.map(review => (
                <div key={review._id} className="review">
                    <div className='review-info'>
                        <div className='review-info-1'>
                            <p>{review.student.name}</p>
                            <p><StarRating rating={review.rating}/> </p>
                        </div>
                        <div className='review-info-2'>
                            <span className='deleteIcon' onClick={()=>deleteResponse(review._id)}><FontAwesomeIcon icon={faTimes}/></span>
                        </div>
                    </div>
                    <p>{review.comment}</p>
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
            </div>
            <div className="pagination">
                <button onClick={goToPreviousPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={goToNextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
        </div>
    );
};

export default Dashboard;

const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>&#9733;</span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};