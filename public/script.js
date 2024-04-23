const form = document.getElementById('countryForm');
const countryInput = document.getElementById('countryInput');
const countryDetails = document.getElementById('countryDetails');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const country = countryInput.value;
    try {
        const response = await axios.get(`http://localhost:3000/country/${country}`);
        displayCountryDetails(response.data);
    } catch (error) {
        console.error(error);
    }
});

function displayCountryDetails(data) {
    const { country, weather, exchangeRate } = data;
    const currencyCode = Object.keys(country.currencies)[0];
    countryDetails.innerHTML = `
        <h2>${country.name.official}</h2>
        <p><strong>Capital:</strong> ${country.capital}</p>
        <p><strong>Currency:</strong> ${country.currencies[currencyCode].name} (${currencyCode})</p>
        <p><strong>Weather:</strong> ${weather.weather[0].description}</p>
        <p><strong>Exchange Rate (USD to ${currencyCode}):</strong> ${exchangeRate}</p>
    `;
}
