const cron = require('node-cron');
const Stock = require('../models/Stock');
const ScanResult = require('../models/ScanResult');
const { fetchHistoricalData } = require('./yahooFinanceService');
const { calculateMetrics } = require('./technicalIndicators');

// List of Top NSE Stocks to scan to avoid rate limits
// .NS indicates NSE on Yahoo Finance
const STOCKS_TO_SCAN = [
    // Original 25
    'RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS', 'ICICIBANK.NS', 'INFY.NS',
    'SBI.NS', 'BHARTIARTL.NS', 'ITC.NS', 'HINDUNILVR.NS', 'LT.NS',
    'BAJFINANCE.NS', 'HCLTECH.NS', 'MARUTI.NS', 'SUNPHARMA.NS', 'AXISBANK.NS',
    'TITAN.NS', 'ULTRACEMCO.NS', 'KOTAKBANK.NS', 'WIPRO.NS', 'ONGC.NS',
    'NTPC.NS', 'TATAMOTORS.NS', 'ASIANPAINT.NS', 'POWERGRID.NS', 'M&M.NS',

    // New 25
    'BAJAJFINSV.NS', 'TATASTEEL.NS', 'HINDALCO.NS', 'JSWSTEEL.NS', 'GRASIM.NS',
    'CIPLA.NS', 'ADANIENT.NS', 'ADANIPORTS.NS', 'COALINDIA.NS', 'DIVISLAB.NS',
    'DRREDDY.NS', 'EICHERMOT.NS', 'APOLLOHOSP.NS', 'BRITANNIA.NS', 'TECHM.NS',
    'INDUSINDBK.NS', 'HEROMOTOCO.NS', 'HDFCLIFE.NS', 'NESTLEIND.NS', 'SBILIFE.NS',
    'SHREECEM.NS', 'TATACONSUM.NS', 'LTIM.NS', 'UPL.NS', 'BPCL.NS'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const runScanner = async () => {
    console.log(`[${new Date().toISOString()}] Cron Job: Starting Stock Scanner...`);

    try {
        // Delete scan results older than 10 minutes to prevent DB bloat
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        const deleteResult = await ScanResult.deleteMany({ createdAt: { $lt: tenMinutesAgo } });
        console.log(`[${new Date().toISOString()}] Cleaned up ${deleteResult.deletedCount} old scan results.`);
    } catch (error) {
        console.error(`Error cleaning up old scan results: ${error.message}`);
    }

    for (const symbol of STOCKS_TO_SCAN) {
        try {
            // Add a small delay to avoid rate limiting
            await sleep(500);

            const data = await fetchHistoricalData(symbol);
            if (!data) continue;

            const metrics = calculateMetrics(data.closes, data.volumes);
            if (!metrics) continue;

            const stockDetails = {
                symbol,
                name: symbol.replace('.NS', ''),
                exchange: 'NSE',
                lastPrice: data.lastPrice,
                change: data.change,
                changePercent: data.changePercent,
                volume: metrics.currentVolume,
                volumeStatus: metrics.volumeStatus,
                ema9: metrics.ema9,
                ema15: metrics.ema15,
                rsi: metrics.rsi,
                signal: metrics.signal,
                lastScannedTime: new Date()
            };

            // Upsert stock record
            const stock = await Stock.findOneAndUpdate(
                { symbol },
                stockDetails,
                { upsert: true, new: true }
            );

            // Log the result in ScanResult
            await ScanResult.create({
                stock: stock._id,
                symbol: stock.symbol,
                price: stock.lastPrice,
                change: stock.change,
                changePercent: stock.changePercent,
                ema9: stock.ema9,
                ema15: stock.ema15,
                rsi: stock.rsi,
                volume: stock.volume,
                volumeStatus: stock.volumeStatus,
                signal: stock.signal,
                timeframe: '1D'
            });

        } catch (error) {
            console.error(`Scanner error on ${symbol}: ${error.message}`);
        }
    }
    console.log(`[${new Date().toISOString()}] Cron Job: Scanning completed.`);
};

// Schedule job to run every 5 minutes
// cron.schedule('*/5 * * * *', runScanner);

// Export for manual or integration testing
module.exports = { runScanner };
