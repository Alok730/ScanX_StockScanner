import React from 'react';
import { Filter, Search } from 'lucide-react';

export default function FilterBar({ filters, setFilters }) {
    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-darkCard border border-slate-700 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <Filter className="w-5 h-5 text-emerald-500" />
                    <span>Scanner Filters</span>
                </div>

                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search symbol..."
                            className="bg-slate-800 border-none rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500 w-48"
                            name="search"
                            onChange={handleChange}
                        />
                    </div>

                    <select
                        name="market"
                        className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                        onChange={handleChange}
                        value={filters.market}
                    >
                        <option value="">All Markets</option>
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                    </select>

                    <select
                        name="signal"
                        className="bg-slate-800 border-none rounded-lg px-4 py-2 text-sm text-white focus:ring-1 focus:ring-emerald-500"
                        onChange={handleChange}
                        value={filters.signal}
                    >
                        <option value="">All Signals</option>
                        <option value="Buy">Strong Buy (Bullish + High Volume)</option>
                        <option value="Sell">Strong Sell (Bearish + High Volume)</option>
                        <option value="Bullish">Bullish (EMA Cross + RSI)</option>
                        <option value="Bearish">Bearish (EMA Cross + RSI)</option>
                        <option value="Neutral">Neutral</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
