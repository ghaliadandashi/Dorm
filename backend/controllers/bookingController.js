const getSemesterStartDate = require("../middleware/calenderIntegration");
const Booking = require("../models/Booking");
const Dorm = require('../models/Dorm')
const User = require('../models/User')
const Room = require('../models/Room')
const mongoose = require('mongoose');

exports.addBooking = async (req, res) => {
    const userid = req.user.userId
    const roomId = req.params.roomID;
    const dormId = req.params.dormID;
    const stay = req.params.stay
    const semester = req.params.semester
    
    try {
        const bookings = await Booking.find({user:userid,status:'Booked',isActive:true})
        const reservations = await Booking.find({user:userid,dorm:dormId,status:'Reserved',isActive:true})
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
                user:userid,
                isActive:true
            }).populate('dorm').populate('room')

            res.json(bookings)
        }else if(role === 'dormOwner'){
            const userDorms = await Dorm.find({owner: userid})
            const dormIds = userDorms.map(dorm => dorm._id);
            // console.log("Dorm IDs:", dormIds);
            const bookings = await Booking.find({
                dorm: {$in: dormIds},
                isActive:'true'
                // status:'Reserved'
            }).populate('user').populate('dorm').populate('room');
            res.json(bookings);
        }else{
            const bookings = await Booking.find({isActive:'true'})
            res.status(200).json(bookings)
        }

    }catch (error){
        console.error('Failed to retrieve bookings', error);
        res.status(500).send('Error retrieving bookings');
    }
}

exports.handleStatus = async (req, res) => {
    try {
        const dates = await getSemesterStartDate();
        if (dates.length === 0) {
            return res.status(500).json({ message: 'Failed to fetch semester start dates' });
        }

        const booking = await Booking.findById(req.params.bookingID);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // At the time of reservation
        if (booking.status === 'Requested') {
            const userBookings = await Booking.find({ user: booking.user });
            const activeBookings = userBookings.filter(b => b.status === 'Reserved' || b.status === 'Booked' && b.isActive==='true');

            if (activeBookings.length > 0) {
                await Booking.deleteMany({ user: booking.user, status: 'Requested' });
                return res.status(400).json({ message: 'User already has an active booking/reservation. All other requests have been cancelled.' });
            }

            const updatedBooking = await Booking.findByIdAndUpdate(
                req.params.bookingID,
                { status: 'Reserved' },
                { new: true }
            );

            return res.status(200).json({ message: 'Room Reserved!', updatedBooking });
        }

        // At the time of confirmation
        else if (booking.status === 'Reserved') {
            const userActiveBookings = await Booking.find({ user: booking.user, _id: { $ne: req.params.bookingID } });
            if (userActiveBookings.some(b => b.status === 'Reserved' || b.status === 'Booked' && b.isActive ===true)) {
                return res.status(400).json({ message: 'User already has an active booking/reservation.' });
            }

            const tempDate = booking.semester === 'fall' ? dates[0] : booking.semester === 'spring' ? dates[1] : dates[2];
            const endDate = new Date(tempDate);
            endDate.setMonth(endDate.getMonth() + booking.stayDuration);

            const updatedBooking = await Booking.findByIdAndUpdate(
                req.params.bookingID,
                {
                    status: 'Booked',
                    startDate: tempDate,
                    endDate: endDate,
                    bookingDate: new Date()
                },
                { new: true }
            );

            const updatedDorm = await Dorm.findByIdAndUpdate(
                booking.dorm,
                { $inc: { occupancy: 1 } },
                { new: true, runValidators: true }
            );

            const updatedRoom = await Room.findByIdAndUpdate(
                booking.room,
                { $inc: { availability: -1, occupancy: 1 } },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ message: 'Room Booked!', updatedBooking });
        } else {
            return res.status(400).json({ message: 'Invalid booking status' });
        }
    } catch (error) {
        console.error('Failed to update booking status', error);
        return res.status(500).json({ message: 'Error processing request', error: error.message });
    }
};

exports.deleteRequest = async (req,res)=>{
    try{
        const deletedRequest = await Booking.findByIdAndDelete(req.params.bookingID);
    }catch (error){
        console.error('Failed to delete booking',error);
        return res.status(500).json({message:'Error processing request',error:error.message})
    }
}