/**
 * This JavaScript file orchestrates authentication processes and stock data
 * retrieval for a web application. It enables users to sign up and sign in securely,
 * handles user input validation, and provides seamless access to the latest stock prices,
 * weekly, and monthly data for specified stock symbols.
 * @author Caleb Chiang
 * @version 1.0.0
 */
document.addEventListener('DOMContentLoaded', function() {
    // Authentication related elements and events
    const triggerSignInButton = document.getElementById('triggerSignIn');
    const authFormContainer = document.getElementById('authFormContainer');
    const signInArea = document.getElementById('signInArea');
    const signUpArea = document.getElementById('signUpArea');
    const switchToSignUp = document.getElementById('switchToSignUp');
    const switchToSignIn = document.getElementById('switchToSignIn');
    const signInButton = document.getElementById('signInButton'); // Ensure this exists in your HTML
    const signInEmail = document.getElementById('signInEmail');
    const signInPassword = document.getElementById('signInPassword');

    const signUpButton = document.getElementById('signUpButton'); // Make sure this ID matches your HTML
    const signUpEmail = document.getElementById('signUpEmail');
    const signUpPassword = document.getElementById('signUpPassword');
    const signUpUsername = document.getElementById('signUpUsername'); // If you're collecting usernames

    signUpButton.addEventListener('click', function() {
        const email = signUpEmail.value.trim();
        const password = signUpPassword.value;
        const username = signUpUsername.value.trim(); // If you're collecting usernames
        if (email && password && username) { // Include username in this check if you're collecting it
            signUpUser(email, password, username);
        } else {
            alert('Please enter email, password, and username.');
        }
    });

    function signUpUser(email, password, username) {
        // Show loading indicator
        document.getElementById('loadingIndicator').style.display = 'block';

        fetch('/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                username: username, // Include this if you're collecting usernames
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

                if (data.message === 'User created successfully!') {
                    alert('Successfully signed up! Please sign in.');
                    toggleAuthForms(); // Switch back to the sign-in form
                } else {
                    alert('Sign up failed. ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';
            });
    }
    // Function to toggle visibility of sign-in and sign-up forms
    function toggleAuthForms(showSignIn = true) {
        authFormContainer.style.display = 'block';
        signInArea.style.display = showSignIn ? 'block' : 'none';
        signUpArea.style.display = showSignIn ? 'none' : 'block';
    }

    triggerSignInButton.addEventListener('click', () => toggleAuthForms());
    switchToSignUp.addEventListener('click', () => toggleAuthForms(false));
    switchToSignIn.addEventListener('click', () => toggleAuthForms());



    signInButton.addEventListener('click', function () {
        const email = signInEmail.value.trim();
        const password = signInPassword.value;
        if (email && password) {
            signInUser(email, password);
        } else {
            alert('Please enter both email and password.');
        }
    });

    function signInUser(email, password) {
        // Show loading indicator
        document.getElementById('loadingIndicator').style.display = 'block';

        fetch('/auth/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then(response => response.json())
            .then(data => {
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

                if (data.message === 'Login successful!') {
                    // Update UI or redirect as needed
                    alert('Successfully signed in!');
                    // Hide the authentication form container
                    document.getElementById('authFormContainer').style.display = 'none';
                    // Hide the authentication form container
                    document.getElementById('triggerSignIn').style.display = 'none';
                    // Display the welcome message
                    const welcomeMessage = document.createElement('div');
                    welcomeMessage.id = 'welcomeMessage';
                    welcomeMessage.innerHTML = `<h2>Welcome ${data.username}!</h2>`; // Adjust this line if the property name for username is different
                    document.body.insertBefore(welcomeMessage, document.body.firstChild);

                } else {
                    alert('Sign in failed. Please check your credentials.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';
            });


    }


});

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
        // Show loading indicator
        document.getElementById('loadingIndicator').style.display = 'block';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

                displayData(data, dataType);
                // Enable weekly and monthly buttons after successful latest data fetch
                if (dataType === 'Latest Price') {
                    weeklyButton.disabled = false;
                    monthlyButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // Hide loading indicator
                document.getElementById('loadingIndicator').style.display = 'none';

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
