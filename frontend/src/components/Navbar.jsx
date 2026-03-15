import React from 'react';
import { Activity } from 'lucide-react';

export default function Navbar() {
    return (
        <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                                ScanX
                            </span>
                            <span className="text-sm text-slate-400 ml-2 shadow-sm">EMA Strategy</span>
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-4">
                            <a href="#" className="bg-slate-800 text-white px-3 py-2 rounded-md text-sm font-medium">Dashboard</a>
                            <a href="#" className="text-slate-300 hover:bg-slate-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">Settings</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
