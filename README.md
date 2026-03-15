# 🚀 MERN Stack Stock Scanner (EMA 9/15 + RSI + Volume)

A professional, real-time stock market scanner built with the MERN stack. It monitors 50 prominent NSE stocks, analyzing price momentum and volume spikes to generate actionable **Buy, Sell, Bullish, and Bearish** signals.

## ✨ Key Features

- **Automated Scanning**: Scans 50 top NSE stocks every 5 minutes using `yahoo-finance2`.
- **Enhanced Signal Strategy**:
  - **Bullish/Bearish**: EMA 9/15 crossover confirmed by RSI (14).
  - **Strong Trade Signals**: "Buy" and "Sell" signals generated when price momentum is confirmed by **High Volume** (1.5x of 20-period average).
- **Volume Analysis**: Real-time monitoring of volume spikes to distinguish between trend follow-through and exhaustion.
- **Premium Dashboard**:
  - Sleek, dark-mode-first aesthetic with Glassmorphism.
  - Interactive table with color-coded signals and RSI indicators.
  - **TradingView Integration**: Advanced technical charts embedded for every selected stock.
- **Smart Data Management**: Automated cleanup routine that purges scan results older than **10 minutes** to maintain peak database performance.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas) with Mongoose.
- **Indicators**: `technicalindicators` library (EMA, RSI).
- **Scheduler**: `node-cron`.

## 📦 Project Structure

```text
project/
├── backend/            # Express server and scanner logic
│   ├── config/         # DB connection setup
│   ├── models/         # Mongoose schemas (Stock, ScanResult)
│   ├── routes/         # API endpoints
│   ├── services/       # ScannerJob, Yahoo Finance, Indicators
│   └── server.js       # Entry point
├── frontend/           # React dashboard
│   ├── src/
│   │   ├── components/ # Dashboard, Table, Filter, Charts
│   │   └── index.css   # Tailwind v4 configuration
└── README.md
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB URI (Atlas or Local)

### 2. Environment Setup
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 3. Installation
```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 4. Running the App
```bash
# Start Backend (Port 5000)
cd backend
npm start

# Start Frontend (in a new terminal)
cd frontend
npm run dev
```

## 📈 Strategy Logic
- **Bullish**: EMA 9 > EMA 15 AND RSI > 50.
- **Bearish**: EMA 9 < EMA 15 AND RSI < 50.
- **Buy (Strong)**: Bullish criteria + Volume > 1.5x Average.
- **Sell (Strong)**: Bearish criteria + Volume > 1.5x Average.

---
Built with ❤️ for professional traders.
