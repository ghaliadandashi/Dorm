const Dorm = require('../models/Dorm');
const User = require('../models/User');
const Room = require('../models/Room')
const { validationResult } = require('express-validator');


exports.add = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { dormName, owner, services, capacity, location, dormType } = req.body;

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
            location: `${req.body.streetName} ${req.body.cityName}`,
            type: dormType.toLowerCase()
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
