const Dorm = require('../models/Dorm');
const User = require('../models/User');
const Room = require('../models/Room')
const { validationResult } = require('express-validator');


exports.add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const { dormName, owner, services, capacity, type } = req.body;

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
            dormPics:req.body.dormPics
        });

        // Save dorm to db
        const savedDorm = await dorm.save();

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
            availability: req.body.noOfRooms,
            viewType: req.body.viewType,
            space: req.body.space,
            roomPics: req.body.roomPics
        })
        const savedRoom = await room.save();

        const dorm = await Dorm.findOneAndUpdate({dormName: req.body.dorm}, {$push: {rooms: savedRoom._id}})
        res.status(201).json({ message: "Room added successfully", dorm });
    }catch (error) {
        console.error('Error adding room to dorm:', error);
        res.status(500).json({ message: "Error adding room", error });
    }
}

exports.show= async (req,res)=>{
    try{
        const dorms = await Dorm.find({}).populate('owner')
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