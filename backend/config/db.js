const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n======================================================\n`);
        console.error(`❌ MONGODB CONNECTION ERROR: ${error.message}`);
        console.error(`\n👉 Please ensure MongoDB is installed and running locally on port 27017.`);
        console.error(`👉 Or update the MONGO_URI in backend/.env to your MongoDB Atlas cluster URI.\n`);
        console.error(`======================================================\n`);
    }
};

module.exports = connectDB;
