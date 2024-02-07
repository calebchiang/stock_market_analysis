document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    const weeklyButton = document.getElementById('weeklyButton');
    const monthlyButton = document.getElementById('monthlyButton');
    const stockSymbolInput = document.getElementById('stockSymbol');
    const dataDisplay = document.getElementById('dataDisplay');

    // Initially disable weekly and monthly buttons
    weeklyButton.disabled = true;
    monthlyButton.disabled = true;

    // Search button click event
    searchButton.addEventListener('click', function () {
        const symbol = stockSymbolInput.value.trim().toUpperCase();
        if (symbol) {
            fetchLatestData(symbol);
        } else {
            alert('Please enter a stock symbol.');
        }
    });

    // Weekly button click event
    weeklyButton.addEventListener('click', function () {
        const symbol = stockSymbolInput.value.trim().toUpperCase();
        fetchData(`/stocks/weekly?symbol=${symbol}`, 'Weekly Data');
    });

    // Monthly button click event
    monthlyButton.addEventListener('click', function () {
        const symbol = stockSymbolInput.value.trim().toUpperCase();
        fetchData(`/stocks/monthly/${symbol}`, 'Monthly Data');
    });

    // Function to fetch the latest data
    function fetchLatestData(symbol) {
        fetchData(`/stocks/latest/${symbol}`, 'Latest Price');
    }

    // General function to fetch data
    function fetchData(url, dataType) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                displayData(data, dataType);
                // Enable weekly and monthly buttons after successful latest data fetch
                if (dataType === 'Latest Price') {
                    weeklyButton.disabled = false;
                    monthlyButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                dataDisplay.textContent = `Failed to load ${dataType}.`;
            });
    }

    // Function to display data
    function displayData(data, dataType) {
        dataDisplay.innerHTML = `<h2>${dataType}</h2>`;
        if (dataType === 'Latest Price' && data) {
            const content = `<p>Close Price: ${data.closePrice} (as of ${data.date})</p>`;
            dataDisplay.innerHTML += content;
        } else if (data && (dataType === 'Weekly Data' || dataType === 'Monthly Data')) {
            const dataList = data.weeklyData || data.monthlyData;
            const listItems = dataList.map(item =>
                `<li>${item.date}: Open(${item.open}), High(${item.high}), Low(${item.low}), Close(${item.close}), Volume(${item.volume}), % Change(${item.percentageChange}%)</li>`
            ).join('');
            dataDisplay.innerHTML += `<ul>${listItems}</ul>`;
        } else {
            dataDisplay.innerHTML += `<p>No data available for ${stockSymbolInput.value.trim().toUpperCase()}.</p>`;
        }
    }
});
