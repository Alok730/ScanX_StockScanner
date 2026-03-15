const mongoose = require('mongoose');
const Stock = require('../models/Stock');
require('dotenv').config();

async function checkSignals() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const stocks = await Stock.find({
            symbol: { $in: ['COALINDIA.NS', 'NTPC.NS'] }
        });

        stocks.forEach(s => {
            console.log(`Symbol: ${s.symbol}, Signal: ${s.signal}, VolumeStatus: ${s.volumeStatus}, RSI: ${s.rsi}`);
        });

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkSignals();
