const dotenv = require('dotenv').config();
const express = require('express');
const db = require('./db/connect');
const cors = require('cors');
const http = require('http'); //default http package
const { Server } = require('socket.io');

const cookieParser = require('cookie-parser');
const app = express();

//ex for http socket connection
const server = http.createServer(app);

//socket connection
const io = new Server(server,{
    cors: {
        origin :'http://localhost:3000',
        methods : ['GET', 'POST']
    }
});

//importing routes
const authRoutes = require('./routes/auth.routes');//custom middleware
// const chatRoutes= require('./routes/chat.routes');
const userRoutes = require('./routes/user.routes');

//connecting DB
db();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials : true
}));

// app.get('/',(req,res)=>{
//     res.send("Chat App Home Page");
// });

//Routes

app.use('/api', authRoutes);
// app.use('/api',chatRoutes);
app.use('/api',userRoutes);

// chatRoutes(io); //chat routes require here 
// require('./routes/chat.routes')(io);

io.on('connection', (socket) => {

    socket.on('join-room', (data) => {
        socket.join(data);
        console.log(`user ${socket.id} has joined the room ${data}`);
    });

    socket.on('send-message', (data) => {
        console.log('Data: ', data );
        socket.to(data.room).emit('receive-message', data);
    } );

    socket.on('disconnect', () => {
        console.log('User Disconnected: ', socket.id);
    })
})

const PORT = process.env.PORT || 5000;

server.listen(PORT , () => {
    console.log(`App is running on port ${PORT}`);            
});

