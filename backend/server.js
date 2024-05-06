require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cors = require('cors');
const app = express()
const multer = require('multer');
const cookieParser = require('cookie-parser');
const cron = require('node-cron');
const userRoutes = require('./routes/UserRoutes')
const dormRoutes = require('./routes/DormRoutes')
const bookingRoutes = require('./routes/BookingRoutes')
const User = require("./models/User");
const Room = require("./models/Room");
const Dorm = require("./models/Dorm");
const Booking = require('./models/Booking')

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

cron.schedule('0 0 * * *', async () => { // This runs at midnight every day
    console.log('Running a daily check to update booking statuses...');
    const today = new Date();
    await Booking.updateMany({
        endDate: { $lt: today },
        isActive: true
    }, {
        $set: { isActive: false }
    });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', userRoutes);
app.use('/dorms',dormRoutes);
app.use('/booking',bookingRoutes)

mongoose.connect(process.env.DB_URI)
    .then(()=>console.log("DATABASE CONNECTED <3"))
    .catch(err => console.log(err))

//UNCOMMENT THIS TO ADD USER, DORM, AND ROOMS

// const seedDatabase = async () => {
//     try {
//         const dormOwner = new User({
//             name: 'Dorm Owner Name',
//             email: 'dormowner@example.com',
//             role: 'dormOwner',
//             password: 'dormOwnie',
//             status: 'Valid'
//         });
//
//         const savedDormOwner = await dormOwner.save();
//         const dorm = new Dorm({
//             dormName: 'Lotus',
//             owner: savedDormOwner._id,
//             services: ['WiFi', 'Laundry'],
//             capacity: 100,
//             occupancy: 0,
//             location: 'Dorm Location',
//             type: 'off-campus'
//         });
//
//         const savedDorm = await dorm.save();
//
//         const rooms = [
//             { roomName: '101', roomType: 'Single', services: ['Balcony'], price: 500, availability: 1 },
//             { roomName: '102', roomType: 'Double', services: ['Private Bathroom'], price: 750, availability: 2 },
//         ];
//
//         const roomPromises = rooms.map(async roomData => {
//             const room = new Room({ ...roomData, dorm: savedDorm._id });
//             return room.save();
//         });
//
//         const savedRooms = await Promise.all(roomPromises);
//
//         savedDorm.rooms = savedRooms.map(room => room._id);
//         await savedDorm.save();
//
//         console.log('Database seeded successfully!');
//     } catch (error) {
//         console.error('Error seeding database:', error);
//     } finally {
//         mongoose.disconnect();
//     }
// };
//
// seedDatabase();

app.get('/',(req,res)=>{
    res.send('backend working?')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
