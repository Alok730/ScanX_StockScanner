const mongoose = require('mongoose');

const scanResultSchema = mongoose.Schema({
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    symbol: { type: String, required: true },
    price: { type: Number },
    ema9: { type: Number },
    ema15: { type: Number },
    rsi: { type: Number },
    volume: { type: Number },
    volumeStatus: { type: String, enum: ['High', 'Normal'], default: 'Normal' },
    signal: { type: String, enum: ['Bullish', 'Bearish', 'Buy', 'Sell', 'Neutral'] },
    timeframe: { type: String, default: '1D' }
}, {
    timestamps: true,
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);
module.exports = ScanResult;
