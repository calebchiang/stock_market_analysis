const express = require('express');
const cors = require('cors');
const path = require('path'); // Import the path module
require('dotenv').config();

const stockRoutes = require('./api/stockRoutes'); // Adjust the path as necessary

const app = express();

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Correctly set the views directory
// This assumes app.js is inside the src directory
app.set('views', path.join(__dirname, 'views'));
console.log('Resolved views directory:', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies

// Use your stock routes for any request that starts with '/api/stocks'
app.use('/api/stocks', stockRoutes);

// Define a simple route for the root to test the server
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

const PORT = process.env.PORT || 3000; // Use the port from environment variables or default to 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
