import React, { useEffect, useRef, memo } from 'react';

function ChartWidget({ symbol }) {
    const containerRef = useRef(null);

    useEffect(() => {
        // Only fetch for actual symbol
        if (!symbol) return;

        // TradingView requires symbol in EXACT format like: "BSE:RELIANCE" or "NSE:RELIANCE"
        // Our DB stores "RELIANCE.NS" or "RELIANCE.BO"
        const tvSymbol = symbol.endsWith('.NS')
            ? `BSE:${symbol.replace('.NS', '')}` // TV uses BSE or NSE, let's use BSE for Indian stocks or NSE if available
            : symbol;

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${tvSymbol}",
        "interval": "D",
        "timezone": "Asia/Kolkata",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(30, 41, 59, 1)",
        "gridColor": "rgba(51, 65, 85, 0.2)",
        "hide_top_toolbar": false,
        "hide_legend": false,
        "save_image": false,
        "container_id": "tradingview_cfb97",
        "studies": [
          "STD;EMA"
        ]
      }`;

        if (containerRef.current) {
            containerRef.current.innerHTML = ''; // clear old chart
            containerRef.current.appendChild(script);
        }

    }, [symbol]);

    return (
        <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl bg-darkCard border border-slate-700 p-1">
            <div
                id="tradingview_cfb97"
                className="tradingview-widget-container h-full w-full"
                ref={containerRef}
            >
                <div className="tradingview-widget-container__widget h-full w-full"></div>
            </div>
        </div>
    );
}

export default memo(ChartWidget);
