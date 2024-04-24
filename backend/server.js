require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const cors = require('cors');
const app = express()
const multer = require('multer');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/UserRoutes')
const User = require("./models/User");

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', userRoutes);


mongoose.connect(process.env.DB_URI)
    .then(()=>console.log("DATABASE CONNECTED <3"))
    .catch(err => console.log(err))

const users = [
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin",
        password: "alice2023",
        status: "Valid"
    },
    {
        name: "Bob Smith",
        email: "bob@example.com",
        role: "student",
        status: "Pending"
    },
    {
        name: "Charlie Dormowner",
        email: "charlie@example.com",
        role: "dormOwner",
        password: "charlie2023",
        status: "Valid"
    }
];

 const addUsers = async () => {
    for (const userData of users) {
         const user = new User(userData);
        await user.save()
            .then(() => console.log(`User ${user.name} added successfully.`))
            .catch(err => console.error('Error adding user:', err));
    }
 };

app.get('/',(req,res)=>{
    res.send('backend working?')
})

addUsers();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})
