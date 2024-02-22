import React, { useState } from 'react';

function StockSearch() {
    const [symbol, setSymbol] = useState('');
    // Initialize weeklyData as null or an empty object
    const [weeklyData, setWeeklyData] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        // Fetch logic remains the same
        fetch(`http://localhost:3000/stocks/weekly/${symbol.toUpperCase()}`)
            .then(response => response.json())
            .then(data => {
                // Assuming data.latestData is the object we receive
                setWeeklyData(data.latestData); // Directly store the received object
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
            });
    };

    return (
        <div>
            <h3>Search for Stock</h3>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Enter stock symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                />
                <button type="submit">Search</button>
            </form>
            {weeklyData && ( // Check if weeklyData is not null
                <div>
                    <h4>Weekly Data for {symbol.toUpperCase()}</h4>
                    {/* Directly display the data without mapping */}
                    <p>Date: {weeklyData.date}</p>
                    <p>Open: {weeklyData.open}</p>
                    <p>High: {weeklyData.high}</p>
                    <p>Low: {weeklyData.low}</p>
                    <p>Close: {weeklyData.close}</p>
                    <p>Volume: {weeklyData.volume}</p>
                    {/* Add any additional fields you expect to display */}
                </div>
            )}
        </div>
    );
}

export default StockSearch;
