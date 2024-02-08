/**
 * This module provides functions to retrieve stock data from the Alpha Vantage API.
 * It includes methods to fetch the latest price, weekly data, and monthly data for a
 * specified stock symbol. Utilizing the Axios library, it sends requests to the Alpha
 * Vantage API with the provided API key stored in a secure environment variable. The
 * module handles responses gracefully and formats the data for consumption by the
 * application. Additionally, it includes a helper function to calculate the percentage change
 * in stock prices. Overall, this module facilitates seamless integration of financial data
 * from Alpha Vantage into the web application.
 * @author: Caleb Chiang
 * @version:1.0
 */

const axios = require('axios');
require('dotenv').config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Returns the latest price of a stock
const getLatestPrice = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;
        // Extract the latest date
        const latestDate = Object.keys(data['Time Series (Daily)'])[0];
        // Extract the closing price for the latest date
        const latestClosePrice = data['Time Series (Daily)'][latestDate]['4. close'];
        return {
            date: latestDate,
            closePrice: latestClosePrice
        };
    } catch (error) {
        console.error(`Error fetching latest price from Alpha Vantage for ${symbol}: ${error}`);
        return null;
    }
};

// Returns the weekly price of a stock
const getWeeklyTimeSeries = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching weekly data from Alpha Vantage for ${symbol}: ${error}`);
        return null;
    }
};

// Returns the monthly price of a stock
const getMonthlyTimeSeries = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Check if the 'Monthly Time Series' key exists in the response
        if (data && Object.keys(data).length > 0 && data['Monthly Time Series']) {
            const monthlyData = Object.entries(data['Monthly Time Series']).map(([date, details]) => ({
                date,
                open: details['1. open'],
                high: details['2. high'],
                low: details['3. low'],
                close: details['4. close'],
                volume: details['5. volume'],
                percentageChange: calculatePercentageChange(details).toFixed(2),
            }));

            // Notice the change here: directly return the array without wrapping in an object
            return monthlyData;
        } else {
            console.log("No 'Monthly Time Series' data found or data is empty.");
            return null;
        }
    } catch (error) {
        console.error(`Error fetching monthly data from Alpha Vantage for ${symbol}: ${error}`);
        return null;
    }
};


// Helper function to calculate the percentage change
function calculatePercentageChange(details) {
    const open = parseFloat(details['1. open']);
    const close = parseFloat(details['4. close']);
    return ((close - open) / open) * 100;
}


module.exports = { getLatestPrice, getWeeklyTimeSeries, getMonthlyTimeSeries };
