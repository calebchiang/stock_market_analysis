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
    const symbol = req.query.symbol ? req.query.symbol.toUpperCase() : '';

    // Initialize weeklyData as an empty array by default
    let weeklyData = [];

    try {
        if (symbol) {
            const data = await getWeeklyTimeSeries(symbol);
            console.log("Raw data:", data); // Confirms raw data is received

            if (data && Object.keys(data).length > 0 && data['Weekly Time Series']) {
                console.log("Accessing 'Weekly Time Series':", data['Weekly Time Series']); // Verifies access to the correct part of the response

                weeklyData = Object.entries(data['Weekly Time Series']).map(([date, details]) => {
                    const week = {
                        date,
                        open: details['1. open'],
                        high: details['2. high'],
                        low: details['3. low'],
                        close: details['4. close'],
                        volume: details['5. volume'],
                        percentageChange: (((details['4. close'] - details['1. open']) / details['1. open']) * 100).toFixed(2),
                    };
                    console.log("Transformed week data:", week); // Shows each transformed week entry
                    return week;
                });

                console.log("Final weeklyData:", weeklyData); // Shows the final state of weeklyData before rendering
            } else {
                console.log("No 'Weekly Time Series' data found or data is empty.");
            }
        }


        // Render the template with weeklyData
        console.log({ weeklyData, symbol });
        res.render('weekly', {
            symbol: symbol,
            weeklyData: weeklyData // Pass the data whether it's empty or filled
        });
    } catch (error) {
        console.error(`Error fetching weekly data for ${symbol}: ${error}`);
        console.log({ weeklyData, symbol });
        res.render('weekly', {
            error: 'Failed to fetch data due to an error.',
            symbol: symbol,
            weeklyData: [] // Ensure weeklyData is defined even in error cases
        });
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
