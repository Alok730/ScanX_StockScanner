const Stock = require('../models/Stock');

// @desc    Get all scanned stocks
// @route   GET /api/stocks
// @access  Public
exports.getStocks = async (req, res) => {
    try {
        const { timeframe, market, signal } = req.query;
        let query = {};

        if (market) query.exchange = market;
        if (signal) {
            if (signal === 'Bullish') {
                query.signal = { $in: ['Bullish', 'Buy'] };
            } else if (signal === 'Bearish') {
                query.signal = { $in: ['Bearish', 'Sell'] };
            } else {
                query.signal = signal;
            }
        }

        const stocks = await Stock.find(query).sort({ symbol: 1 });
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bullish stocks only
// @route   GET /api/bullish
// @access  Public
exports.getBullishStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({ signal: 'Bullish' }).sort({ symbol: 1 });
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get bearish stocks only
// @route   GET /api/bearish
// @access  Public
exports.getBearishStocks = async (req, res) => {
    try {
        const stocks = await Stock.find({ signal: 'Bearish' }).sort({ symbol: 1 });
        res.json(stocks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
