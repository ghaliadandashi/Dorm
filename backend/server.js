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
const chatRoutes = require('./routes/ChatRoutes')

const reviewRoutes = require('./routes/ReviewRoutes')
const User = require("./models/User");
const Room = require("./models/Room");
const Dorm = require("./models/Dorm");
const Booking = require('./models/Booking')
const Chat = require('./models/Chat');

const http = require('http');


const server = http.createServer(app);

const getSemesterStartDate = require('../backend/middleware/calenderIntegration');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

cron.schedule('0 * * * *', async () => {
    console.log('Running an hourly check to update booking statuses...');
    const today = new Date();

    try {
        const bookingsToUpdate = await Booking.find({
            endDate: { $lt: today },
            isActive: true
        }).populate('dorm room');

        for (const booking of bookingsToUpdate) {
            await Dorm.findByIdAndUpdate(booking.dorm._id, {
                $inc: { occupancy: -1 }
            });

            await Room.findByIdAndUpdate(booking.room._id, {
                $inc: { availability: 1 }
            });

            booking.isActive = false;
            await booking.save();
        }

        console.log('Hourly check completed. Booking statuses updated successfully.');
    } catch (error) {
        console.error('Error updating booking statuses:', error);
    }
});



app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', userRoutes);
app.use('/dorms',dormRoutes);
app.use('/booking',bookingRoutes);
app.use('/reviews',reviewRoutes);
app.use('/chat',chatRoutes)



mongoose.connect(process.env.DB_URI)
    .then(()=>console.log("DATABASE CONNECTED <3"))
    .catch(err => console.error('MongoDB connection error:', err));

//UNCOMMENT THIS TO ADD USER, DORM, AND ROOMS
const seedDatabase = async ()=>{
    try{
        const admin = new User({
            name:'Admin',
            email:'admin@mail.com',
            role:'admin',
            password:'admin1',
            status:'Valid'
        })
        const savedAdmin = await admin.save()
    }catch (error){
        console.error(error)
    }
}
// const seedDatabase = async () => {
//     try {
//         const dormOwner = new User({
//             name: 'Dorm Owner',
//             email: 'dormowner@example.com',
//             role: 'dormOwner',
//             password: 'dormOwnie',
//             status: 'Valid',
            
//         });

//         const savedDormOwner = await dormOwner.save();
//         const dorm = new Dorm({
//             dormName: 'Lotus',
//             owner: savedDormOwner._id,
//             services: ['WiFi', 'Laundry'],
//             capacity: 100,
//             occupancy: 0,
//             location: 'Dorm Location',
//             type: 'off-campus',
//             isActive:true
//         });

//         const savedDorm = await dorm.save();

//         const rooms = [
//             { roomName: '101', roomType: 'Single', services: ['Balcony'], pricePerSemester: 500,summerPrice: 300,extraFee:50,viewType:'SeaView', availability: 50,space:23 },
//             { roomName: '102', roomType: 'Double', services: ['Private Bathroom'], pricePerSemester: 1500,summerPrice: 300,extraFee:0,viewType:'CampusView', availability: 120,space:54 },
//         ];

//         const roomPromises = rooms.map(async roomData => {
//             const room = new Room({ ...roomData, dorm: savedDorm._id });
//             return room.save();
//         });

//         const savedRooms = await Promise.all(roomPromises);

//         savedDorm.rooms = savedRooms.map(room => room._id);
//         await savedDorm.save();

//         console.log('Database seeded successfully!');
//     } catch (error) {
//         console.error('Error seeding database:', error);
//     } finally {
//         mongoose.disconnect();
//     }
// };


// Socket.IO setup
// io.on('connection', (socket) => {
//     console.log('a user connected');
  
//     socket.on('chat message', async (msg) => {
//       const chat = new Chat({ content: msg, user: 'SULAIMON INOMOV' }); // Adjust to include actual user data
//       await chat.save();
//       io.emit('chat message', msg);
//     });
  
//     socket.on('disconnect', () => {
//       console.log('user disconnected');
//     });
//   });
  
  // Seed database with initial messages
// const seedDatabase = async () => {
//     try {
//       const initialMessages = [
//         { content: 'Welcome to the chat!', sender: 'SULAIMON INOMOV', receiver: 'Dorm Owner' },
//         { content: 'Feel free to start a conversation.', sender: 'SULAIMON INOMOV', receiver: 'Dorm Owner' },
//       ];
//
//       await Chat.insertMany(initialMessages);
//       console.log('Database seeded with initial messages');
//     } catch (error) {
//       console.error('Error seeding database:', error);
//     }
//   };

//seedDatabase();

// app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send('backend working?')
})

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
