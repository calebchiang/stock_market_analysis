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

// Route for weekly price, adjusted to return JSON
router.get('/weekly', async (req, res) => {
    const symbol = req.query.symbol ? req.query.symbol.toUpperCase() : '';
    try {
        if (symbol) {
            const data = await getWeeklyTimeSeries(symbol);
            if (data && Object.keys(data).length > 0 && data['Weekly Time Series']) {
                const weeklyData = Object.entries(data['Weekly Time Series']).map(([date, details]) => ({
                    date,
                    open: details['1. open'],
                    high: details['2. high'],
                    low: details['3. low'],
                    close: details['4. close'],
                    volume: details['5. volume'],
                    percentageChange: (((details['4. close'] - details['1. open']) / details['1. open']) * 100).toFixed(2),
                }));
                res.json({ symbol: symbol, weeklyData: weeklyData });
            } else {
                res.status(404).json({ error: 'No weekly data found' });
            }
        } else {
            res.status(400).json({ error: 'Symbol query parameter is required' });
        }
    } catch (error) {
        console.error(`Error fetching weekly data for ${symbol}: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
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
