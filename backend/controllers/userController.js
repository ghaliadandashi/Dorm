const User = require('../models/User')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const Dorm = require("../models/Dorm");
const admin = require('firebase-admin');
const Booking = require('../models/Booking')
const Review = require('../models/Review')

const serviceAccount = require('../dorm-2aa81-firebase-adminsdk-88ye5-597ead691c.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'https://console.firebase.google.com/u/0/project/dorm-2aa81/storage/dorm-2aa81.appspot.com'
});
const bucket = admin.storage().bucket();


exports.register = async (req, res) => {
    const validationRules = [
        check('email').isEmail().withMessage('Enter a valid email address'),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        check('password').isStrongPassword().withMessage('Weak Password'),
        check('firstName').not().isEmpty().withMessage('First name is required'),
        check('lastName').not().isEmpty().withMessage('Last name is required'),
        check('dob').isDate().withMessage('Enter a valid date of birth'),
        check('phoneNo').isMobilePhone('tr-TR').withMessage('Enter a valid phone number')
    ];

    await Promise.all(validationRules.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation errors: ", errors.array());
        const formattedErrors = errors.array().map(err => ({
            type: 'field',
            msg: err.msg,
        }));
        return res.status(422).json({ errors: formattedErrors });
    }

    const { files } = req.body;
    const { personalFile, ownershipFile, dormPics } = files || {};

    try {

        const newUser = new User({
            name: `${req.body.firstName} ${req.body.lastName}`,
            email: req.body.email,
            password: req.body.password,
            dob: req.body.dob,
            phoneNo: req.body.phoneNo,
            role: 'dormOwner',
            status: 'Pending',
            personalFiles: personalFile,
            ownershipFiles: ownershipFile
        });

        const savedUser = await newUser.save();

        const dorm = new Dorm({
            dormName: req.body.dormName,
            owner: savedUser._id,
            services: req.body.services,
            capacity: req.body.capacity,
            location: `${req.body.streetName} ${req.body.cityName}`,
            type: req.body.dormType.toLowerCase(),
            dormPics: dormPics
        });

        await dorm.save();

        const token = jwt.sign({
            id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role
        }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: "User registered successfully",
            userId: savedUser._id,
            token: token
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Error during registration' });
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.status !== 'Valid') {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });

        res.json({ message: 'Authentication successful' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    // if (!refreshToken) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.sendStatus(403);
        }

        const newAccessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax'
        });

        res.send('Access token refreshed');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error refreshing access token');
    }
};



exports.logout = async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        console.error('No user information in request');
        return res.status(400).send('No user information available');
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        user.refreshToken = '';
        await user.save();
        res.cookie('accessToken', '', { httpOnly: true, expires: new Date(0), secure: false, sameSite: 'strict' });
        res.cookie('refreshToken', '', { httpOnly: true, expires: new Date(0), secure: false, sameSite: 'strict' });

        res.send('Logged out successfully');
    } catch (error) {
        console.error('Logout Error:', error);
        res.status(500).send('Error during logout');
    }
};



exports.user = async(req,res)=>{
    const { uid, email, name } = req.body;

    try {
        const existingUser = await User.findOne({ microsoftID: uid });
        if (existingUser) {
            const accessToken = jwt.sign(
                { userId: existingUser._id, role: existingUser.role, status: existingUser.status },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const refreshToken = jwt.sign(
                { userId: existingUser._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '7d' }
            );

            existingUser.refreshToken = refreshToken;
            existingUser.save();

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax'
            });
            return res.status(201).send(existingUser);
        }
        const newUser = new User({
            microsoftID: uid,
            email,
            name,
            role:'student',
            status: 'Valid'
        });

        const savedUser = await newUser.save();
        const accessToken = jwt.sign(
            { userId: savedUser._id, role: savedUser.role, status: savedUser.status },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { userId: savedUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        savedUser.refreshToken = refreshToken;
        savedUser.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax'
        });
        res.status(201).send(savedUser);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err);
    }
}


exports.validate = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).send("Access Denied: No token provided!");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send("Invalid Token");
        }
        res.status(200).json({
            message: "Token is valid",
            user: {
                userId: decoded.userId,
                role: decoded.role,
                status: decoded.status
            }
        });
    });
};

exports.profile = async (req, res) => {
    const userId = req.user.userId;
    try {
        const owner = await User.findById(userId);
        if (!owner) {
            return res.status(404).send('User not found');
        }
        res.json({
            user: {
                name: owner.name,
                email: owner.email,
                dob: owner.dob,
                phoneNo: owner.phoneNo,
                profilePic:owner.profilePic
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).send('Error retrieving dorm owner data');
    }
};

exports.profileEdit = async(req,res) => {
    console.log(req.body)
    try{
        const user = await User.findByIdAndUpdate(req.user.userId, req.body,{new:true,runValidators:true})
        res.status(200).json(user)
    }catch(error){
        console.error('Database error:',error)
        res.status(500).send('Error updating profile!')
    }
}

exports.changeProfilePic = async (req,res)=>{
    const {pictureUrl} = req.body
    try{
        const user = await User.findByIdAndUpdate(req.user.userId,{profilePic:pictureUrl},{new:true,runValidators:true})
        res.status(200).send('Profile picture successfully changed/added!')
    }catch(error){
        console.error('Database error:',error);
        res.status(500).send('Error changing picture')
    }
}

exports.deleteProfilePic = async (req,res)=>{
    try{
        const user = await User.findByIdAndUpdate(req.user.userId,{profilePic:''},{new:true,runValidators:true})
        res.status(200).send('Profile picture has been deleted!')
    }catch(error){
        console.error('Database Error:',error);
        res.status(500).send('Error Deleting picture')
    }
}


exports.getUsers = async (req,res)=>{
    try{
        const users = await User.find({})
        res.status(200).json(users)
    }catch(error){
        console.error('Failed to retrieve users:', error);
        res.status(500).send('Error retrieving all users');
    }

}

exports.getDorm = async (req,res)=>{
    const userid = req.user.userId;
    const user = await User.findById(userid)
    // console.log(user)
    try{
        const dorms = await Dorm.find({owner:user._id}).populate('rooms')
        if(!dorms){
            res.status(200).send('Owner doesnt own any dorms!')
        }
        // const responseDorms = dorms.map(dorm => ({
        //     dormName: dorm.dormName,
        //     services: dorm.services,
        //     capacity: dorm.capacity,
        //     location: dorm.location,
        //     dormType: dorm.type
        // }));
        res.json(dorms);
    }catch (error){
        console.error('Database error:',error);
        res.status(500).send('Error retrieving dorm data')
    }
}

exports.getInsights= async (req, res) => {
    try {
        const dormId = req.params.dormId;

       
        const dorm = await Dorm.findById(dormId).populate('rooms');
        if (!dorm) {
            return res.status(404).json({ message: 'Dormitory not found' });
        }

        
        const totalOccupancy = await Booking.countDocuments({ dorm: dormId, status: { $in: ['Reserved', 'Booked'] } });
        const occupancyRate = (totalOccupancy / dorm.capacity) * 100;

        
        const bookings = await Booking.find({ dorm: dormId, status: 'Booked' }).populate('room');
        const totalRevenue = bookings.reduce((sum, booking) => {
            const stayDuration = booking.stayDuration;
            const room = booking.room;
            const semesterRevenue = room.pricePerSemester;
        
            const additionalRevenue = 
                (stayDuration === 4.5) ? 0 :
                (stayDuration === 9) ? semesterRevenue :
                (stayDuration === 12) ? semesterRevenue + room.summerPrice * 3 :
                (stayDuration === 3) ? room.summerPrice * 3 : 0;
        
            return sum + (stayDuration !== 3)?semesterRevenue:0 + additionalRevenue;
        }, 0);

        const reviews = await Review.find({ dorm: dormId }).populate('student');

        res.json({
            occupancyRate,
            totalRevenue,
            reviews
        });
    } catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.search=  async (req, res) => {
    try {
        const { location, minPrice, maxPrice, services } = req.query;

        const query = {
            ...(location && { location }),
            ...(minPrice && { 'rooms.pricePerSemester': { $gte: minPrice } }),
            ...(maxPrice && { 'rooms.pricePerSemester': { $lte: maxPrice } }),
            ...(services && { services: { $all: services.split(',') } })
        };

        const dorms = await Dorm.find(query).populate('rooms');
        res.json(dorms);
    } catch (error) {
        console.error('Error searching dormitories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};