const YF = require('yahoo-finance2').default;
const yahooFinance = typeof YF === 'function' ? new YF() : YF;

// Notices suppressed by default or not needed

exports.fetchHistoricalData = async (symbol) => {
    try {
        const period1 = new Date();
        period1.setDate(period1.getDate() - 30); // get last 30 days of data
        const period2 = new Date();

        const queryOptions = {
            period1: period1.toISOString().split('T')[0],
            period2: period2.toISOString().split('T')[0]
        };
        const result = await yahooFinance.historical(symbol, queryOptions);

        if (!result || result.length === 0) return null;

        // We need closes for EMA and volumes for High Volume check
        const closes = result.map(q => q.close);
        const volumes = result.map(q => q.volume);
        const lastPrice = closes[closes.length - 1];
        const volume = volumes[volumes.length - 1];

        return { closes, volumes, lastPrice, volume };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
        return null;
    }
};
