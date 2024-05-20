const getSemesterStartDate = require("../middleware/calenderIntegration");
const Booking = require("../models/Booking");
const Dorm = require('../models/Dorm')
const User = require('../models/User')
const Room = require('../models/Room')

exports.addBooking = async (req, res) => {
    const userid = req.user.userId
    const roomId = req.params.roomID;
    const dormId = req.params.dormID;
    const stay = req.params.stay
    const semester = req.params.semester
    
    try {
        const bookings = await Booking.find({user:userid,status:'Booked'})
        const reservations = await Booking.find({user:userid,dorm:dormId,status:'Reserved'})
        if(bookings.length>0){
            return res.status(400).json({message:'User Already Booked a Room!'})
        }else if(reservations.length === 1){
            return res.status(400).json({message:'Cannot Reserve more than 1 room in a dorm!'})
        }
        const booking = new Booking({
            bookingDate: Date.now(),
            user: userid,
            dorm: dormId,
            room: roomId,
            startDate: Date.now(),
            endDate: Date.now() +(15 * 24 * 60 * 60 * 1000),
            status: 'Requested',
            semester:semester,
            isActive:true,
            stayDuration: stay
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
        const role = req.user.role
        if(role === 'student'){
            const bookings = await Booking.find({
                user:userid
            }).populate('dorm').populate('room')
            res.json(bookings)
        }else{
            const userDorms = await Dorm.find({owner: userid})
            const dormIds = userDorms.map(dorm => dorm._id);
            // console.log("Dorm IDs:", dormIds);
            const bookings = await Booking.find({
                dorm: {$in: dormIds},
                isActive:'true'
                // status:'Reserved'
            }).populate('user').populate('dorm').populate('room');
            res.json(bookings);
        }

    }catch (error){
        console.error('Failed to retrieve bookings', error);
        res.status(500).send('Error retrieving bookings');
    }
}

exports.handleStatus = async (req,res)=>{
    try {
        const dates = await getSemesterStartDate();
        if (dates.length === 0) {
            return res.status(500).json({ message: 'Failed to fetch semester start dates' });
        }
    
        const booking = await Booking.findById(req.params.bookingID);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
    
        const userBookings = await Booking.find({ user: booking.user });
        const activeBookings = userBookings.filter(b => b.status === 'Reserved' || b.status === 'Booked');
        if (activeBookings.length > 0) {
            if(activeBookings.some(b => b.status === 'Reserved')){
                
            }else{
            await Booking.deleteMany({ user: booking.user, status: 'Requested' });
            return res.status(400).json({ message: 'User already booked/reserved a room. All other requests have been cancelled.' });
            }
        }
    
        const dorm = await Dorm.findById(booking.dorm);
        const room = await Room.findById(booking.room);
        const dOccupancy = dorm.occupancy || 0;
        const availability = room.availability || 0;
        const rOccupancy = room.occupancy || 0;
    
        if (booking.status === 'Requested') {
            const updatedBooking = await Booking.findByIdAndUpdate(
                req.params.bookingID,
                { status: 'Reserved' },
                { new: true }
            );
    
            res.status(200).json({ message: 'Room Reserved!', updatedBooking });
        } else if (booking.status === 'Reserved') {
            const tempDate = booking.semester === 'fall' ? dates[0] : booking.semester === 'spring' ? dates[1] : dates[2];
            const endDate = new Date(tempDate);
            endDate.setMonth(endDate.getMonth() + booking.stayDuration);
    
            const updatedBooking = await Booking.findByIdAndUpdate(
                req.params.bookingID,
                {
                    status: 'Booked',
                    startDate: tempDate,
                    endDate: endDate
                },
                { new: true }
            );
    
            const updatedDorm = await Dorm.findByIdAndUpdate(
                dorm._id,
                { occupancy: dOccupancy + 1 },
                { new: true, runValidators: true }
            );
    
            const updatedRoom = await Room.findByIdAndUpdate(
                room._id,
                { availability: availability - 1, occupancy: rOccupancy + 1 },
                { new: true, runValidators: true }
            );
    
            res.status(200).json({ message: 'Room Booked!', updatedBooking });
        } else {
            res.status(400).json({ message: 'Invalid booking status' });
        }
    } catch(error){
        console.error('Failed to retrieve bookings', error);
        res.status(500).send('Error retrieving bookings');
    }
}