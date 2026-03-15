const { EMA, RSI } = require('technicalindicators');

exports.calculateMetrics = (prices, volumes) => {
    if (!prices || prices.length < 15 || !volumes || volumes.length < 2) return null;

    const ema9Result = EMA.calculate({ period: 9, values: prices });
    const ema15Result = EMA.calculate({ period: 15, values: prices });
    const rsiResult = RSI.calculate({ period: 14, values: prices });

    const ema9 = ema9Result.length > 0 ? ema9Result[ema9Result.length - 1] : null;
    const ema15 = ema15Result.length > 0 ? ema15Result[ema15Result.length - 1] : null;
    const rsi = rsiResult.length > 0 ? rsiResult[rsiResult.length - 1] : null;

    // Calculate Average Volume of last 20 periods (or available history)
    const volHistory = volumes.slice(-20);
    const avgVolume = volHistory.reduce((a, b) => a + b, 0) / volHistory.length;
    const currentVolume = volumes[volumes.length - 1];

    // Volume is "High" if current is 1.5x of average
    const isHighVolume = currentVolume > (avgVolume * 1.5);
    const volumeStatus = isHighVolume ? 'High' : 'Normal';

    if (avgVolume > 0 && isHighVolume) {
        console.log(`DEBUG: Volume Spike detected! Current: ${currentVolume}, Avg: ${avgVolume.toFixed(0)}, Ratio: ${(currentVolume / avgVolume).toFixed(2)}x`);
    }

    let signal = 'Neutral';

    if (ema9 && ema15 && rsi) {
        const isBullish = ema9 > ema15 && rsi > 50;
        const isBearish = ema9 < ema15 && rsi < 50;

        if (isBullish) {
            signal = isHighVolume ? 'Buy' : 'Bullish';
        } else if (isBearish) {
            signal = isHighVolume ? 'Sell' : 'Bearish';
        }
    }

    return { ema9, ema15, rsi, signal, volumeStatus, currentVolume };
};
