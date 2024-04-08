const countryInput = document.getElementById('country-input');
const searchButton = document.getElementById('search-button');
const countryNameElement = document.getElementById('country-name');
const capitalElement = document.getElementById('capital');
const populationElement = document.getElementById('population');
const regionElement = document.getElementById('region');
const coatOfArmsElement = document.getElementById('coat-of-arms');
const borderList = document.getElementById('border-list');
const errorMessageElement = document.getElementById('error-message');

// Function to display loading message
function displayLoadingMessage() {
  errorMessageElement.textContent = 'Loading...';
}

// Function to display country information
function displayCountryInfo(country) {
  countryNameElement.textContent = country.name.common;
  capitalElement.textContent = `Capital: ${country.capital || 'N/A'}`;
  populationElement.textContent = `Population: ${country.population || 'N/A'}`;
  regionElement.textContent = `Region: ${country.region || 'N/A'}`;

  // Update coat of arms image only after successful fetch
  if (country.coatOfArms && country.coatOfArms.svg) {
    coatOfArmsElement.src = country.coatOfArms.svg;
    coatOfArmsElement.alt = 'Coat of Arms'; // Set alt attribute for accessibility
    coatOfArmsElement.style.display = 'inline';
  } else {
    // Handle cases where the country might not have a coat of arms
    coatOfArmsElement.src = ""; // Set an empty string
    coatOfArmsElement.alt = ''; // Clear alt attribute
    console.warn("Country may not have a coat of arms:", country.name.common);
  }
}

// Function to handle errors
function handleError(error) {
  console.error('Error:', error);
  errorMessageElement.textContent = 'Error fetching data. Please try again later.';
}

// Function to fetch and display bordering countries
async function displayBorderingCountries(country) {
  try {
    const borders = country.borders || [];

    // Clear previous bordering countries
    borderList.innerHTML = '';

    // Display bordering countries
    const borderPromises = borders.map(async border => {
      const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
      if (!borderResponse.ok) {
        throw new Error('Border country data not found');
      }
      return borderResponse.json();
    });

    const borderCountries = await Promise.all(borderPromises);

    borderCountries.forEach(borderCountry => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <img src="${borderCountry.coatOfArms?.svg || 'placeholder.svg'}" alt="${borderCountry.name.common}" width="30" height="30">
        ${borderCountry.name.common}
      `;
      borderList.appendChild(listItem);
    });
  } catch (error) {
    handleError(error);
  }
}

// Event listener for search button
searchButton.addEventListener('click', async () => {
  const countryName = countryInput.value.trim();
  if (!countryName) {
    errorMessageElement.textContent = 'Please enter a country name';
    return;
  }

  displayLoadingMessage();

  try {
    // Fetch country data
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!response.ok) {
      throw new Error('Country not found');
    }
    const [countryData] = await response.json();

    // Display country information
    displayCountryInfo(countryData);

    // Fetch and display bordering countries
    await displayBorderingCountries(countryData);

    // Clear error message if successful
    errorMessageElement.textContent = '';
  } catch (error) {
    handleError(error);
  }
});
