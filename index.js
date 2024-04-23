const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 3000;
app.use(express.static(path.join(__dirname, 'public')));
const exchangeRateApiKey = '78ea022381197826acb38795';

app.get('/country/:name', async (req, res) => {
    try {
        const countryName = req.params.name;
        const countryDetailsResponse = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (countryDetailsResponse.data.length === 0) {
            return res.status(404).json({ error: 'Country not found' });
        }
        const countryDetails = countryDetailsResponse.data[0];
        const latitude = countryDetails.latlng[0];
        const longitude = countryDetails.latlng[1];
        const weatherDetailsResponse = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=8d37aaa3afee684c372e4831dc7f5597`);
        const weatherDetails = weatherDetailsResponse.data.current;
        const currencyCode = Object.keys(countryDetails.currencies)[0];
       const exchangeRatesResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/pair/USD/${currencyCode}`);
        if (!exchangeRatesResponse.data || exchangeRatesResponse.data.result === 'error') {
            return res.status(500).json({ error: 'Failed to fetch exchange rates' });
        }

        const exchangeRate = exchangeRatesResponse.data.conversion_rate;
        
        res.json({
            country: countryDetails,
            weather: weatherDetails,
            exchangeRate: exchangeRate
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
