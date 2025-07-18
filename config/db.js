const mongoose = require('mongoose');

const connectToDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('DB connection established');
    } catch (error) {
        console.log('DB connection failed');
        process.exit(1);
    }
};

module.exports = connectToDB;