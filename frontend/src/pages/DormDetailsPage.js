import React, { useEffect, useState } from 'react';
import Header from "../layout/Header";
import axios from "axios";
import { useAuth } from "../components/Auth/AuthHook";
import '../styling/pages/dormDetails.css';
import { useNavigate } from "react-router-dom";
import noImage from '../images/1554489-200.png';
import PriceTrends from "../components/DormDetail/PriceTrends";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


const DormDetails = () => {
    const [dormInfo, setDormInfo] = useState(null);
    const [roomInfo, setRoomInfo] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [bookings,setBookings] = useState([])
    const navigate = useNavigate();
    const { role, isLoggedIn,user } = useAuth();
    const [stay, setStay] = useState(4.5);
    const [semester, setSemester] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [modalImages, setModalImages] = useState([]);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const dormID = localStorage.getItem('DormId');
    const d = new Date();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const dormResponse = await axios.get(`http://localhost:3001/dorms/dormDetails/${dormID}`, { withCredentials: true });
                setDormInfo(dormResponse.data.dorm);
                setRoomInfo(dormResponse.data.dorm.rooms);

                await fetchReviews();

                const bookingResponse = await axios.get(`http://localhost:3001/booking/getBooking`, { withCredentials: true });
                setBookings(bookingResponse.data);
            } catch (error) {
                console.error('Failed to get data', error);
            }
        };

         fetchData();
    }, [user, dormID,reviews]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/reviews/${dormID}`, { withCredentials: true });
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'stay') {
            setStay(value);
        } else if (name === 'semester') {
            setSemester(value);
        }
    };

    const handleBooking = (roomID, dormID) => {
        axios.post(`http://localhost:3001/booking/add/${roomID}/${dormID}/${stay}/${semester}`)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Failed to get data', error);
            });
    };

    const getPrice = (room, stay) => {
        switch (Number(stay)) {
            case 9:
                return room.pricePerSemester * 2;
            case 12:
                return (room.pricePerSemester * 2) + (room.summerPrice * 3);
            case 4.5:
                return room.pricePerSemester;
            case 3:
                return room.summerPrice * 3;
            default:
                return room.pricePerSemester;
        }
    };

    const openModal = (image, images = []) => {
        setSelectedImage(image);
        setModalImages(images);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedImage(null);
        setModalImages([]);
    };

    const openReviewModal = () => {
        setShowReviewModal(true);
    };

    const closeReviewModal = () => {
        setShowReviewModal(false);
        setNewReview({ rating: 0, comment: '' });
    };

    const handleReviewSubmit = () => {
        axios.post('http://localhost:3001/reviews/add', { dorm: dormID, ...newReview }, { withCredentials: true })
            .then(response => {
                const updatedReviews = [...reviews, response.data];
                setReviews(updatedReviews);
                console.log('Updated reviews:', updatedReviews);
                closeReviewModal();
            })
            .catch(error => {
                console.error('Failed to add review', error);
            });
    };

    const handleReviewDeletion = async (reviewID) => {
        try {
            await axios.delete(`http://localhost:3001/reviews/deleteReview/${reviewID}`);
            setReviews((prevReviews) => prevReviews.filter(review => review._id !== reviewID));
        } catch (error) {
            console.error('Failed to delete review', error);
        }
    };




    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const formatDate = (date) => {
        return date.substring(0, date.indexOf('T')).split('-').reverse().join('-');
    };
    const userHasBookingInDorm = () => {
        return bookings.some(booking => booking.dorm._id === dormID && booking.status ==='Booked');
    };


    return (
        <>
            <Header />
            {dormInfo && (
                <div className="dorm-details">
                    <div className="dorm-header">
                        <h1>{dormInfo.dormName}</h1>
                        {(role === 'admin' || (role === 'student' && userHasBookingInDorm())) && (
                            <button className="add-review-btn" onClick={openReviewModal}>Add Review</button>
                        )}
                    </div>
                    <div className="dorm-content">
                        <div className="dorm-info">
                            <div className="dorm-image">
                                {dormInfo.dormPics[0] ? (
                                    <img src={dormInfo.dormPics[0]} alt="Dorm" className="main-image" onClick={() => openModal(dormInfo.dormPics[0], dormInfo.dormPics)} />
                                ) : (
                                    <img src={noImage} className="main-image" alt="No image available" />
                                )}
                                <div className="small-images">
                                    {dormInfo.dormPics.slice(1, 2).map((pic, index) => (
                                        pic ? (
                                            <img key={index} src={pic} alt={`Dorm ${index}`} className="small-image" onClick={() => openModal(pic, dormInfo.dormPics)} />
                                        ) : (
                                            <img key={index} src={noImage} className="small-image" alt="No image available" />
                                        )
                                    ))}
                                    {dormInfo.dormPics.length > 3 && (
                                        <div className="more-images">
                                            <img src={dormInfo.dormPics[2]} alt="Dorm" className="small-image" onClick={() => openModal(dormInfo.dormPics[2], dormInfo.dormPics)} />
                                            <div className="more-overlay" onClick={() => openModal(dormInfo.dormPics[2], dormInfo.dormPics)}>+ More</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="dorm-details-text">
                                <h2>Location</h2>
                                <p>{dormInfo.location}</p>
                                <h2>Services</h2>
                                <ul>
                                    {dormInfo.services.map((service, index) => (
                                        <li key={index}>{capitalizeFirstLetter(service)}</li>
                                    ))}
                                </ul>
                                <div className="price-trends">
                                    <PriceTrends dormId={dormID} />
                                </div>
                            </div>
                        </div>
                        <div className="rooms-table">
                            <table>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th>Room Type</th>
                                    <th>Availability</th>
                                    <th>Services</th>
                                    <th>Stay Duration</th>
                                    <th>Semester</th>
                                    <th>Price</th>
                                    {role === 'student' || !isLoggedIn ? <th>Book Room</th> : null}
                                </tr>
                                </thead>
                                <tbody>
                                {roomInfo.map((room, index) => (
                                    <tr key={room._id || index}>
                                        <td>
                                            <div className="more-images">
                                                <img src={room.roomPics[0]} alt="Room" width="70px" height="70px" className="rooms-images" style={{borderRadius:'10px'}} onClick={() => openModal(room.roomPics[0], room.roomPics)} />
                                                {room.roomPics.length > 0 && (
                                                    <div className="more-overlay" onClick={() => openModal(room.roomPics[0], room.roomPics)}>+</div>
                                                )}
                                            </div>
                                        </td>
                                        <td>{room.roomType}</td>
                                        <td style={{ color: room.availability === 0 ? 'darkred' : room.availability > 20 ? 'green' : 'orangered' }}>
                                            {room.availability === 0 ? 'Fully Booked!' : room.availability > 20 ? 'Available' : 'Almost Out!'}
                                        </td>
                                        <td>{room.services.map(service => capitalizeFirstLetter(service)).join(', ')}</td>
                                        <td>
                                            <select name='stay' value={stay} onChange={handleChange}>
                                                <option value='4.5'>1 semester</option>
                                                <option value='9'>2 semesters</option>
                                                <option value='12'>1 year</option>
                                                <option value='3'>Summer</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select name='semester' value={semester} onChange={handleChange}>
                                                <option value='spring'>{d.getFullYear()} - {d.getFullYear() + 1} Spring Term</option>
                                                <option value='fall'>{d.getFullYear()} - {d.getFullYear() + 1} Fall Term</option>
                                                <option value='summer'>{d.getFullYear()} - {d.getFullYear() + 1} Summer Term</option>
                                            </select>
                                        </td>
                                        <td>{getPrice(room, stay)}</td>
                                        {role === 'student' ? (
                                            <td>
                                                <button className="table-btn" onClick={() => handleBooking(room._id, dormID)}>Book Room</button>
                                            </td>
                                        ) :(!isLoggedIn)?<td>
                                            <button className="table-btn" onClick={() => navigate('/login')}>Book Room</button>
                                        </td>:null
                                        }
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="reviews">
                            <h2>Reviews</h2>
                            {reviews.length > 0 ? (
                                <ul>
                                    {reviews.map((review, index) => (
                                        <li key={review._id || index}>
                                            <div className="review-header">
                                                <div className='review-info'>
                                                    <strong>{review.student.name}  <span style={{color:'violet'}}>{review.student.role !== 'student'?review.student.role:null}</span></strong>
                                                </div>
                                                {user?review.student._id == user.userId || user.uid || role === 'admin'?<FontAwesomeIcon icon={faTimes} style={{cursor:'pointer'}} onClick={()=>handleReviewDeletion(review._id)}/>:null:null}
                                            </div>
                                            <div className="review-rating">
                                                <StarRating rating={review.rating} />
                                                <span>{formatDate(review.timestamps[0])}</span>
                                            </div>
                                            <div className="review-comment">
                                                <p>{review.comment}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No reviews yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showModal && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={closeModal}>&times;</span>
                        <img src={selectedImage} alt="Selected" className="modal-image" />
                        <div className="modal-thumbnails">
                            {modalImages.map((pic, index) => (
                                <img
                                    key={index}
                                    src={pic}
                                    alt={`Thumbnail ${index}`}
                                    className={`thumbnail ${pic === selectedImage ? 'selected' : ''}`}
                                    onClick={() => setSelectedImage(pic)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
            {showReviewModal && (
                <div className="modal-backdrop" onClick={closeReviewModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <span className="modal-close" onClick={closeReviewModal}>&times;</span>
                        <h2>Add Review</h2>
                        <label>
                            Rating:
                            <input
                                type="number"
                                value={newReview.rating}
                                onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                                min="1"
                                max="5"
                            />
                        </label>
                        <label>
                            Comment:
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                        </label>
                        <button className="modal-btn" onClick={handleReviewSubmit}>Submit Review</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default DormDetails;


const StarRating = ({ rating }) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={`star ${i <= rating ? 'filled' : ''}`}>&#9733;</span>
        );
    }
    return <div className="star-rating">{stars}</div>;
};