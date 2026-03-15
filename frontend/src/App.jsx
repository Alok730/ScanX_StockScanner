import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import ScannerTable from './components/ScannerTable';
import ChartWidget from './components/ChartWidget';
import { fetchStocks } from './services/api';
import { RefreshCw } from 'lucide-react';

function App() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ market: '', signal: '', search: '' });
  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchStocks({ market: filters.market, signal: filters.signal });
    setStocks(data);

    // Auto-select first stock if none selected
    if (data.length > 0 && !selectedSymbol) {
      setSelectedSymbol(data[0].symbol);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 5 minutes (300000 ms) to sync with backend cron
    const interval = setInterval(() => {
      loadData();
    }, 300000);
    return () => clearInterval(interval);
  }, [filters.market, filters.signal]);

  const filteredStocks = stocks.filter(s => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const sym = s.symbol.toLowerCase();
      const n = (s.name || '').toLowerCase();
      if (!sym.includes(searchTerm) && !n.includes(searchTerm)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-darkBg text-white pt-20 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Market Scanner</h1>
            <p className="text-slate-400 mt-1">Live AI-driven EMA 9/15 Crossover Analysis</p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <FilterBar filters={filters} setFilters={setFilters} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading && stocks.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <ScannerTable
                stocks={filteredStocks}
                onSelectStock={setSelectedSymbol}
                selectedSymbol={selectedSymbol}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h3 className="text-lg font-semibold mb-4 text-slate-200">
                {selectedSymbol ? `Technical Analysis: ${selectedSymbol.replace('.NS', '')}` : 'Select a stock to view chart'}
              </h3>
              {selectedSymbol ? (
                <ChartWidget symbol={selectedSymbol} />
              ) : (
                <div className="w-full h-[500px] rounded-xl border border-slate-700 bg-slate-800/20 flex flex-col items-center justify-center text-slate-500">
                  <div className="mb-2">📊</div>
                  Chart Preview Available Empty
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
