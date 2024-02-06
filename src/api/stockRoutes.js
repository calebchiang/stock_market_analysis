const express = require('express');
const router = express.Router();
const { getDailyTimeSeries } = require('../services/alphaVantageService');

// Route to get daily time series data for a stock symbol
router.get('/daily/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const data = await getDailyTimeSeries(symbol);
    if (data) {
        res.json(data); // Send the data as a JSON response
    } else {
        res.status(500).send('Error fetching stock data');
    }
});

module.exports = router;
