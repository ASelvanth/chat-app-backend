const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db/connect');
const cors = require('cors');
const app = express();

//importing routes
const authRoutes = require('./routes/auth.routes');
const chatRoutes= require('./routes/chat.routes');

//connecting DB
db();

app.use(express.json());
app.use(cors());


app.use('/api', authRoutes);
app.use('/api',chatRoutes);


//Routes
app.get('/',(req,res)=>{
    res.send("Chat App Home Page");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);            
});

