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
        return response.data['Weekly Time Series'];
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
        // Assuming you want the whole monthly time series data
        const monthlyData = response.data['Monthly Time Series'];
        return monthlyData;
    } catch (error) {
        console.error(`Error fetching monthly data from Alpha Vantage for ${symbol}: ${error}`);
        return null;
    }
};

module.exports = { getLatestPrice, getWeeklyTimeSeries, getMonthlyTimeSeries };
