const dotenv = require('dotenv').config();
const express = require('express');
const db = require('./db/connect');
const cors = require('cors');
const http = require('http'); //default http package
const {Server} = require('socket.io');

const cookieParser = require('cookie-parser');
const app = express();

//ex for http socket connection
const server = http.createServer(app);

//socket connection
const io = new Server(server,{
    cors: {
        origin :'https://localhost:3000',
        methods : ['GET', 'POST']
    }
});

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

//on -> receiving side
//emit -> sending side

io.on('connection',(socket) =>{
    console.log("User connected :", socket.id);
    // socket.emit('join-room' ,'215565'); //frontend //join room address
    socket.on('join-room', (data)=>{
        socket.join(data);
        console.log(`User ${socket.id} has joined the room ${data}`);
    });

    //here down data like "Hii" - message send in receive end
    socket.on('send-message', (data)=>{
        socket.to(data.room).emit('receive-message', data);
    });

    //once out from chat 
    socket.on('disconnect',()=>{
        console.log("User disconnected", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT , () => {
    console.log(`App is running on port ${PORT}`);            
});

