/**
 * This Express.js router file defines routes for retrieving stock data
 * from the Alpha Vantage API. It includes routes to fetch the latest price,
 * weekly data, and monthly data for specified stock symbols. The routes handle
 * error responses and return JSON-formatted data to the client.
 * @author Caleb Chiang
 * @version 1.0
 *
 */
const express = require('express');
const router = express.Router();
const { getLatestPrice, getWeeklyTimeSeries, getMonthlyTimeSeries } = require('../services/alphaVantageService');

// Route for latest price
router.get('/latest/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const latestPriceData = await getLatestPrice(symbol);
        if (latestPriceData) {
            res.json(latestPriceData);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error(`Error fetching latest price for ${symbol}: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Adjusted route for weekly data to use URL parameters
router.get('/weekly/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase(); // Get the symbol from URL parameters and convert to uppercase
    try {
        const latestData = await getWeeklyTimeSeries(symbol); // This now returns only the latest entry
        if (latestData) {
            console.log({ symbol: symbol, latestData: latestData });
            res.json({ symbol: symbol, latestData: latestData }); // Return the symbol and its latest weekly data in JSON format
        } else {
            res.status(404).json({ error: 'No weekly data found for ' + symbol }); // Handle case where no data is found
        }
    } catch (error) {
        console.error(`Error fetching weekly data for ${symbol}: ${error}`);
        res.status(500).json({ error: 'Internal server error' }); // Handle any errors that occur during the request
    }
});


// Route for monthly price, adjusted to return JSON
router.get('/monthly/:symbol', async (req, res) => {
    const symbol = req.params.symbol.toUpperCase();
    try {
        const monthlyData = await getMonthlyTimeSeries(symbol);
        if (monthlyData && monthlyData.length > 0) {
            res.json({ symbol: symbol, monthlyData: monthlyData });
        } else {
            res.status(404).json({ error: 'No monthly data found for ' + symbol });
        }
    } catch (error) {
        console.error(`Error fetching monthly data for ${symbol}: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router;
