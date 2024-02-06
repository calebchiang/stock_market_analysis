const express = require('express');
const router = express.Router();
const { getLatestPrice, getWeeklyTimeSeries, getMonthlyTimeSeries } = require('../services/alphaVantageService');


// Route for latest price
router.get('/latest/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const latestPriceData = await getLatestPrice(symbol);
    if (latestPriceData) {
        res.json(latestPriceData);
    } else {
        res.status(404).send('Data not found');
    }
});

// Route for weekly price, adjusted to use query parameters
router.get('/weekly', async (req, res) => {
    // Use query parameter for symbol, since we're using a form with GET method
    const symbol = req.query.symbol ? req.query.symbol.toUpperCase() : null;

    // Check if symbol was provided, if not render page without data or with an error message
    if (!symbol) {
        return res.render('weekly', { error: 'Please provide a stock symbol.' });
    }

    try {
        const weeklyData = await getWeeklyTimeSeries(symbol);
        // Check if data is returned from the API
        if (Object.keys(weeklyData).length === 0) {
            return res.render('weekly', { error: 'No data found for the provided symbol.', symbol: symbol });
        }
        // Convert the object into an array and calculate percentage change
        const formattedData = Object.entries(weeklyData['Weekly Time Series'] || {}).map(([date, details]) => ({
            date,
            open: details['1. open'],
            high: details['2. high'],
            low: details['3. low'],
            close: details['4. close'],
            volume: details['5. volume'],
            percentageChange: (((details['4. close'] - details['1. open']) / details['1. open']) * 100).toFixed(2),
        }));

        // Render the EJS template with the data
        res.render('weekly', { symbol: symbol, weeklyData: formattedData });
    } catch (error) {
        console.error(`Error fetching weekly data for ${symbol}: ${error}`);
        res.status(500).render('weekly', { error: 'Failed to fetch data due to an error.', symbol: symbol });
    }
});

// Route for monthly price
router.get('/monthly/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    const monthlyData = await getMonthlyTimeSeries(symbol);
    if (monthlyData) {
        res.json(monthlyData);
    } else {
        res.status(404).send(`Error fetching monthly data for ${symbol}`);
    }
});



module.exports = router;
