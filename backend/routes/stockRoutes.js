const express = require('express');
const router = express.Router();
const { getStocks, getBullishStocks, getBearishStocks } = require('../controllers/stockController');

router.get('/stocks', getStocks);
router.get('/bullish', getBullishStocks);
router.get('/bearish', getBearishStocks);

module.exports = router;
