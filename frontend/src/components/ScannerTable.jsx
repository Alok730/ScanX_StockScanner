import React, { useState, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, ArrowUpDown } from 'lucide-react';

export default function ScannerTable({ stocks, onSelectStock, selectedSymbol }) {
    const [sortConfig, setSortConfig] = useState({ key: 'changePercent', direction: 'desc' });

    const sortedStocks = useMemo(() => {
        let sortableItems = [...stocks];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [stocks, sortConfig]);

    const requestSort = (key) => {
        let direction = 'desc';
        if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    if (stocks.length === 0) {
        return (
            <div className="bg-darkCard rounded-xl border border-slate-700 p-8 text-center text-slate-400">
                No stocks matching the current filters were found.
            </div>
        );
    }

    return (
        <div className="bg-darkCard rounded-xl border border-slate-700 overflow-hidden shadow-xl">
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-xs uppercase bg-slate-800/50 text-slate-400 sticky top-0 z-10 backdrop-blur-md">
                        <tr>
                            <th className="px-6 py-4 font-medium">Symbol</th>
                            <th className="px-6 py-4 font-medium text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('lastPrice')}>
                                <div className="flex items-center justify-end gap-1">
                                    Price (₹) <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-medium text-right cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('change')}>
                                <div className="flex items-center justify-end gap-1">
                                    Change <ArrowUpDown className="w-3 h-3" />
                                </div>
                            </th>
                            <th className="px-6 py-4 font-medium text-right">EMA 9</th>
                            <th className="px-6 py-4 font-medium text-right">EMA 15</th>
                            <th className="px-6 py-4 font-medium text-right">RSI (14)</th>
                            <th className="px-6 py-4 font-medium text-center">Volume Status</th>
                            <th className="px-6 py-4 font-medium text-center">Signal</th>
                            <th className="px-6 py-4 font-medium text-right">Last Scan</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {sortedStocks.map((stock) => {
                            const isBullish = stock.signal === 'Bullish' || stock.signal === 'Buy';
                            const isBearish = stock.signal === 'Bearish' || stock.signal === 'Sell';
                            const isStrong = stock.signal === 'Buy' || stock.signal === 'Sell';
                            const isSelected = selectedSymbol === stock.symbol;

                            const priceColor = stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400';
                            
                            // Color-code RSI: Overbought > 70 (red), Oversold < 30 (green)
                            let rsiColor = 'text-slate-400';
                            if (stock.rsi >= 70) rsiColor = 'text-rose-400 font-bold';
                            else if (stock.rsi <= 30) rsiColor = 'text-emerald-400 font-bold';
                            else if (stock.rsi > 50) rsiColor = 'text-emerald-400/80';
                            else if (stock.rsi < 50) rsiColor = 'text-rose-400/80';

                            return (
                                <tr
                                    key={stock.symbol}
                                    onClick={() => onSelectStock(stock.symbol)}
                                    className={`hover:bg-slate-700/30 cursor-pointer transition-colors ${isSelected ? 'bg-slate-700/50 border-l-2 border-emerald-500' : 'border-l-2 border-transparent'}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-white">{stock.name || stock.symbol}</span>
                                            <span className="text-xs text-slate-500">{stock.exchange}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 font-mono text-right font-bold ${priceColor}`}>
                                        {stock.lastPrice?.toFixed(2) || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right">
                                        <div className={`flex flex-col ${priceColor}`}>
                                            <span className="font-bold">{stock.change >= 0 ? '+' : ''}{stock.change?.toFixed(2)}</span>
                                            <span className="text-[10px] opacity-80">{stock.changePercent?.toFixed(2)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right text-slate-400">
                                        {stock.ema9?.toFixed(2) || '-'}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-right text-slate-400">
                                        {stock.ema15?.toFixed(2) || '-'}
                                    </td>
                                    <td className={`px-6 py-4 font-mono text-right ${rsiColor}`}>
                                        {stock.rsi?.toFixed(2) || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                            ${stock.volumeStatus === 'High' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-700/50 text-slate-500 border border-slate-600/30'}`}>
                                            {stock.volumeStatus || 'Normal'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                      ${isBullish ? (isStrong ? 'bg-emerald-500 text-slate-900 border border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20') :
                                                isBearish ? (isStrong ? 'bg-rose-500 text-white border border-rose-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20') :
                                                    'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                            {isBullish ? <ArrowUpRight className={`w-3.5 h-3.5 ${isStrong ? 'stroke-[3]' : ''}`} /> :
                                                isBearish ? <ArrowDownRight className={`w-3.5 h-3.5 ${isStrong ? 'stroke-[3]' : ''}`} /> :
                                                    <Minus className="w-3.5 h-3.5" />}
                                            {stock.signal}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-right text-slate-500">
                                        {stock.lastScannedTime ? new Date(stock.lastScannedTime).toLocaleTimeString() : '-'}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
