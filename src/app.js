const express = require('express');
const cors = require('cors');
const path = require('path');
const stockRoutes = require('./api/stockRoutes'); // Ensure this path is correct


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());

// Directly use stockRoutes for handling '/stocks/weekly' without '/api/stocks' prefix
app.use('/stocks', stockRoutes);

// If you have other routes that should be prefixed with '/api/stocks', define them separately
// app.use('/api/stocks', apiStockRoutes); // Hypothetical separate router for API-prefixed routes

app.get('/', (req, res) => res.send('Hello from the server!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
