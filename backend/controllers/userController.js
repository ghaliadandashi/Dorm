const User = require('../models/User')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const Dorm = require("../models/Dorm");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });
exports.upload = upload.fields([
    { name: 'personalFile', maxCount: 3 },
    { name: 'ownershipFile', maxCount: 1 },
    { name: 'dormPics', maxCount: 10 }
]);
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

    try {
        const newUser = new User({
            name: `${req.body.firstName} ${req.body.lastName}`,
            email: req.body.email,
            password: req.body.password,
            dob: req.body.dob,
            phoneNo: req.body.phoneNo,
            role: 'dormOwner',
            status: 'Pending',
        });

        const savedUser = await newUser.save();

        const dorm = new Dorm({
            dormName: req.body.dormName,
            owner: savedUser._id,
            services: req.body.services,
            capacity: req.body.capacity,
            location: `${req.body.streetName} ${req.body.cityName}`,
            type: req.body.dormType.toLowerCase()
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
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, status: user.status },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ token, role: user.role, status: user.status });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.user = async(req,res)=>{
    const { uid, email, name } = req.body;

    try {
        const existingUser = await User.findOne({ microsoftID: uid });
        if (existingUser) {
            return res.status(409).send('User already exists.');
        }
        const newUser = new User({
            microsoftID: uid,
            email,
            name,
            role:'student',
            status: 'Valid'
        });

        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send(err);
    }
}
