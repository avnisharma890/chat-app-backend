require('dotenv').config();
const express = require('express');
const connectToDB = require('./config/db');
const userRoute = require('./routes/userRoutes');

const app = express();

app.use(express.json());

// routes
app.use('/api/v1/user', userRoute);

const PORT = process.env.PORT;
app.listen(PORT,()=> {
    connectToDB();
    console.log(`Server is running on port: ${PORT}`);
});
