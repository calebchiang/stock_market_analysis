const express = require('express');
const cors = require('cors');
const path = require('path');
const stockRoutes = require('./api/stockRoutes'); // Ensure this path is correct


const app = express() // Creates instance of an Express application

app.set('view engine', 'ejs'); // Set EJS as template engine for this application
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Directly use stockRoutes for handling '/stocks/weekly' without '/api/stocks' prefix
app.use('/stocks', stockRoutes);


app.get('/', (req, res) => res.send('Hello from the server!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
