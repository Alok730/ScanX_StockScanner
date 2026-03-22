import React, { useEffect, useRef, memo } from 'react';
import { ExternalLink } from 'lucide-react';

function ChartWidget({ symbol }) {
    const containerRef = useRef(null);

    const cleanSymbol = symbol ? symbol.replace('.NS', '') : '';
    const liveUrl = `https://www.tradingview.com/chart/?symbol=NSE:${cleanSymbol}`;

    useEffect(() => {
        // Only fetch for actual symbol
        if (!symbol) return;

        // TradingView requires symbol in EXACT format like: "BSE:RELIANCE" or "NSE:RELIANCE"
        // Note: NSE symbols are restricted in free external widgets.
        // We use BSE here to at least show a working chart (EOD/Delayed).
        const tvSymbol = symbol.endsWith('.NS')
            ? `BSE:${cleanSymbol}`
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

    }, [symbol, cleanSymbol]);

    if (!symbol) return null;

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 italic">Note: Embedded charts may have 1-day delay</span>
                <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20"
                >
                    <ExternalLink className="w-3 h-3" />
                    View Live NSE Chart
                </a>
            </div>
            
            <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-2xl bg-darkCard border border-slate-700 p-1">
                <div
                    id="tradingview_cfb97"
                    className="tradingview-widget-container h-full w-full"
                    ref={containerRef}
                >
                    <div className="tradingview-widget-container__widget h-full w-full"></div>
                </div>
            </div>
        </div>
    );
}

export default memo(ChartWidget);
