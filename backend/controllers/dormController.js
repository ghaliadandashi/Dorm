const Dorm = require('../models/Dorm');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const PriceHistory = require('../models/PriceHistory');
const { validationResult } = require('express-validator');


exports.add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { dormName, services, capacity, type } = req.body;

    try {
        // Check if dorm with the same name already exists
        const existingDorm = await Dorm.findOne({ dormName });


        if (existingDorm) {
            return res.status(409).send('Dorm already exists.');
        }

        // Create new dorm instance
        const dorm = new Dorm({
            dormName,
            owner: req.user.userId,
            services,
            capacity,
            location: `${req.body.streetName} ${req.body.city}`,
            type: type.toLowerCase(),
            dormPics:req.body.dormPics,
            ownershipFiles:req.body.ownershipFiles,
            isActive:false
        });
        // Save dorm to db
        const savedDorm = await dorm.save();

        const owner = await User.findById(req.user.userId);
        owner.ownershipFiles = owner.ownershipFiles.concat(req.body.ownershipFiles);
        await owner.save();

        res.status(201).json({
            message: "Dorm added successfully",
            dorm_id: savedDorm._id,
        });
    } catch (error) {
        console.error('Error during adding a dorm:', error);
        res.status(500).json({ error: 'Error during adding a new dorm' });
    }
};

exports.addRoom = async (req,res)=>{
    try {
        const room = new Room({
            roomType: req.body.roomType,
            services: req.body.services,
            pricePerSemester: req.body.pricePerSemester,
            summerPrice: req.body.summerPrice,
            extraFee: req.body.extraFee,
            occupancy:0,
            availability: req.body.noOfRooms,
            viewType: req.body.viewType,
            space: req.body.space,
            roomPics: req.body.roomPics
        })
        const savedRoom = await room.save();
        const updatedDorm = await Dorm.findOneAndUpdate({dormName: req.body.dorm}, {$push: {rooms: savedRoom._id}})
        const dorm = await Dorm.find({dormName:req.body.dorm})
        const priceHistory = new PriceHistory({
            dorm: dorm[0]._id,
            room: savedRoom._id,
            pricePerSemester: req.body.pricePerSemester,
            summerPrice: req.body.summerPrice,
            date: new Date()
        });
        await priceHistory.save();

        res.status(201).json({ message: "Room added successfully", updatedDorm });
    }catch (error) {
        console.error('Error adding room to dorm:', error);
        res.status(500).json({ message: "Error adding room", error });
    }
}

exports.show= async (req,res)=>{
    try{
        const dorms = await Dorm.find({isActive:'true'}).populate('owner')
        res.status(200).json(dorms)
    }catch(error){
        console.error('Failed to retrieve dorms:', error);
        res.status(500).send('Error retrieving all dorms');
    }

}

exports.dormDetails = async (req, res) => {
    try {
        const dorm = await Dorm.findById(req.params.dormID).populate('rooms');
        if (!dorm) {
            return res.status(404).send('Dorm not found');
        }
        res.status(200).json({
            dorm,
        });

    } catch (error) {
        console.error('Failed to retrieve dorm', error);
        res.status(500).send('Error retrieving dorm details');
    }
}

exports.searchDormByName = async (req, res) => {
    try {
        const dormName = req.query.dormName;
        const regex = new RegExp(dormName, 'i'); // 'i' for case-insensitive
        const dorms = await Dorm.find({ dormName: regex }).populate('rooms');
        if (!dorms.length) {
            return res.status(404).send('Dorm not found');
        }
        res.status(200).json(dorms);
    } catch (error) {
        console.error('Failed to retrieve dorm', error);
        res.status(500).send('Error retrieving dorm details');
    }
}

exports.getRooms = async (req,res) =>{
    try{
        const dorm = await Dorm.findById(req.params.dormID).populate('rooms');
        const rooms = [];
        if(dorm.rooms.length >0) {
            rooms.push(dorm.rooms)
        }
        res.status(200).json(rooms)
    }catch (error){
        console.error('Failed to retrieve rooms',error);
        res.status(500).send('Error retrieving rooms')
    }
}

exports.editRoom = async (req,res) =>{
    const roomDetails = req.body
    const cleanRoomDetails = Object.entries(roomDetails).reduce((acc, [key, value]) => {
        if (value !== null && value !== '') { 
            acc[key] = value;
        }
        return acc;
    }, {});
    try{
        const editedRoom = await Room.findByIdAndUpdate(req.params.roomID,cleanRoomDetails,{ new: true, runValidators: true })
        res.status(200).json({message:'Room Edited!',editedRoom})

    }catch(error){
        console.error('Failed to edit room',error)
        res.status(500).send('Error editing room')
    }
}

exports.editDorm = async (req,res)=>{
    const dormDetails = req.body
    const location = `${req.body.city} ${req.body.streetName}`
    dormDetails.location = location
    const cleanDormDetails = Object.entries(dormDetails).reduce((acc, [key, value]) => {
        if (value !== null && value !== '') { 
            acc[key] = value;
        }
        return acc;
    }, {});
    try{
        const editedDorm = await Dorm.findByIdAndUpdate(req.params.dormID,cleanDormDetails,{new:true,runValidators:true})
        res.status(200).json({message:'Dorm Edited',editedDorm})
    }catch(error){
        console.error('Failed to edit Dorm',error)
        res.status(500).send('Error editing Dorm')
    }
}

exports.deleteDorm = async (req, res) => {
    try {
        const dorm = await Dorm.findById(req.params.dormID);

        if (dorm) {
            await Room.deleteMany({ _id: { $in: dorm.rooms } });
            await Booking.deleteMany({ dorm: req.params.dormID });
            await Dorm.findByIdAndDelete(req.params.dormID);
            res.status(200).json({ message: 'Dorm and associated rooms deleted!' });
        } else {
            res.status(404).json({ message: 'Dorm not found!' });
        }
    } catch (error) {
        console.error('Failed to delete Dorm', error);
        res.status(500).send('Error deleting Dorm');
    }
};


exports.deleteRoom = async (req,res)=>{
    try{
        await Booking.findOneAndDelete({ room: req.params.roomID });
        const room = await Room.findByIdAndDelete(req.params.roomID);
        await Dorm.findByIdAndUpdate(req.params.dormID, { $pull: { rooms: room._id } });
        res.status(200).json({message:'Room Deleted!',room})
    }catch(error){
        console.error('Failed to delete Room',error)
        res.status(500).send('Error deleting Dorm')
    }
}

exports.getPriceTrends = async (req, res) => {
    try {
        const { dormId } = req.params;
        const priceHistory = await PriceHistory.find({ dorm: dormId }).sort({ date: 1 });
        res.json(priceHistory);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

exports.getDormRequests = async (req,res)=>{
    try{
         const dorms = await Dorm.find({isActive:false}).populate('owner')
         res.status(200).json(dorms)
    }catch (error){
        console.error('Failed to delete Room',error)
        res.status(500).send('Error retrieving Dorms')
    }
}

exports.acceptDorm = async (req,res)=>{
    try{
        const dorm = await Dorm.findByIdAndUpdate(req.params.dormID,{isActive:true})
    }catch (error){
        console.error('Failed to delete Room',error)
        res.status(500).send('Error accepting Dorm')
    }
}

exports.rejectDorm = async (req,res)=>{
    try{
        const dorm = await Dorm.findByIdAndUpdate(req.params.dormID,{isActive:null})
    }catch (error){
        console.error('Failed to delete Room',error)
        res.status(500).send('Error accepting Dorm')
    }
}
