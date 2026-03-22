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
        const [history, quote] = await Promise.all([
            yahooFinance.historical(symbol, queryOptions),
            yahooFinance.quote(symbol)
        ]);

        if (!history || history.length === 0) return null;

        // We need closes for EMA and volumes for High Volume check
        const closes = history.map(q => q.close);
        const volumes = history.map(q => q.volume);
        
        // Use quote for more accurate "real-time" data
        const lastPrice = quote?.regularMarketPrice || closes[closes.length - 1];
        const change = quote?.regularMarketChange || 0;
        const changePercent = quote?.regularMarketChangePercent || 0;
        const volume = quote?.regularMarketVolume || volumes[volumes.length - 1];

        return { closes, volumes, lastPrice, change, changePercent, volume };
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error.message);
        return null;
    }
};
