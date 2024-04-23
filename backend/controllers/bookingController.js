const Booking = require("../models/Booking");
const Dorm = require('../models/Dorm')

exports.addBooking = async (req, res) => {
    const userid = req.user.userId
    const roomId = req.params.roomID;
    const dormId = req.params.dormID;


    try {
        const bookings = await Booking.find({user:userid,status:'Reserved'})//remember status
        if(bookings.length>0){
            return res.status(400).json({message:'User Already Booked a Room!'})
        }
        const booking = new Booking({
            bookingDate: Date.now(),
            user: userid,
            dorm: dormId,
            room: roomId,
            startDate: Date.now(),
            endDate: Date.now(),
            status: 'Reserved'
        })
        await booking.save();
        res.status(200).json({
            message:'Successful Booking !'
        })
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ message: 'Error processing your booking.' });
    }
}

exports.getBooking=async (req,res)=>{
    try {
        const userid = req.user.userId
        const userDorms = await Dorm.find({owner: userid})
        const dormIds = userDorms.map(dorm => dorm._id);
        // console.log("Dorm IDs:", dormIds);
        const bookings = await Booking.find({
            dorm: {$in: dormIds},
            // status:'Reserved'
        }).populate('user').populate('dorm').populate('room');
        res.json(bookings);
        // console.log(bookings)
    }catch (error){
        console.error('Failed to retrieve bookings', error);
        res.status(500).send('Error retrieving bookings');
    }
}