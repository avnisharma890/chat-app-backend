const cors = require('cors');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectToDB = require('./config/db');
const userRoute = require('./routes/userRoutes');
const messageRoute = require('./routes/messageRoutes');
const { server, app } = require('./socket/socket.js');


// middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// routes
app.use('/api/v1/user', userRoute);
app.use('/api/v1/message', messageRoute);

const PORT = process.env.PORT;
server.listen(PORT,()=> {
    connectToDB();
    console.log(`Server is running on port: ${PORT}`);
});

