const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const { runScanner } = require('./services/scannerJob');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes/stockRoutes'));

// Root endpoint
app.get('/', (req, res) => {
    res.send('Stock Scanner API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);

    // Start Cron Job immediately when server starts (Optional but good for fast testing)
    console.log('Starting initial scan...');
    runScanner();

    // Schedule scanner job
    cron.schedule('*/5 * * * *', () => {
        runScanner();
    });
});
