const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const db = require('./db/connect');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

//importing routes
const authRoutes = require('./routes/auth.routes');//custom middleware
const chatRoutes= require('./routes/chat.routes');
const userRoutes = require('./routes/user.routes');

//connecting DB
db();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials : true,
}));


app.get('/',(req,res)=>{
    res.send("Chat App Home Page");
});


//Routes
app.use('/api', authRoutes);
app.use('/api',chatRoutes);
app.use('/api',userRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`server running on port ${PORT}`);            
});

