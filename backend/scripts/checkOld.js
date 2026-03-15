const mongoose = require('mongoose');
const ScanResult = require('../models/ScanResult');
require('dotenv').config();

async function checkOldest() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const oldestDocs = await ScanResult.find().sort({ createdAt: 1 }).limit(5);
        if (oldestDocs.length > 0) {
            console.log("Oldest document created at: ", oldestDocs[0].createdAt);
            const minutesOld = (Date.now() - oldestDocs[0].createdAt.getTime()) / (1000 * 60);
            console.log(`Which is ${minutesOld.toFixed(2)} minutes old.`);
        } else {
            console.log("No documents found.");
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkOldest();
