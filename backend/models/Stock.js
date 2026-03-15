const mongoose = require('mongoose');

const stockSchema = mongoose.Schema({
    symbol: { type: String, required: true, unique: true },
    name: { type: String },
    exchange: { type: String, enum: ['NSE', 'BSE'], default: 'NSE' },
    lastPrice: { type: Number },
    ema9: { type: Number },
    ema15: { type: Number },
    rsi: { type: Number },
    volume: { type: Number },
    volumeStatus: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
    signal: { type: String, enum: ['Bullish', 'Bearish', 'Buy', 'Sell', 'Neutral'], default: 'Neutral' },
    lastScannedTime: { type: Date }
}, {
    timestamps: true,
});

const Stock = mongoose.model('Stock', stockSchema);
module.exports = Stock;
