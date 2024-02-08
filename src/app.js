/**
 * This Express.js application file configures middleware and routes for a web server.
 * It establishes connections to MongoDB for stock data storage, sets up CORS handling for
 * cross-origin requests, and serves static files from the 'public' directory.
 * @author: Caleb Chiang
 * @version: 1.0.0
 *
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const stockRoutes = require('./api/stockRoutes'); // Ensure this path is correct
const mongoose = require('mongoose');
const authRoutes = require('./api/authRoutes');


const app = express() // Creates instance of an Express application

mongoose.connect('mongodb://localhost/stockData')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/stocks', stockRoutes);
app.use('/auth', authRoutes);



app.set('view engine', 'ejs'); // Set EJS as template engine for this application
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => res.send('Hello from the server!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
