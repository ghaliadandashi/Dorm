require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const { auth } = require('express-openid-connect');
const app = express()
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

mongoose.connect(process.env.DB_URI)
    .then(()=>console.log("DATABASE CONNECTED <3"))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('it works! wowowowwowoowwo');
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})