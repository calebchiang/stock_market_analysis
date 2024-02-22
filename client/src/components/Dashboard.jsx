import React from 'react';
import StockSearch from './StockSearch';

function Dashboard() {
    return (
        <div className="container mt-5">
            <h2>Dashboard</h2>
            {/* Placeholder for stock data and other info */}
            <p>Welcome to the dashboard! Here you will find all the stock data and information.</p>
            <StockSearch />
        </div>
    );
}
export default Dashboard;
