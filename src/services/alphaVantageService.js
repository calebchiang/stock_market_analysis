const axios = require('axios');
require('dotenv').config();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

const getDailyTimeSeries = async (symbol) => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Alpha Vantage: ${error}`);
        return null;
    }
};

module.exports = {
    getDailyTimeSeries,
};
