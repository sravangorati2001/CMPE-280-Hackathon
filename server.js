// server.js

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Helper function to map country codes to country names
const countryCodes = {
  '1': 'USA',
  '2': 'India',
  '3': 'China',
  '4': 'Ecuador',
  // Add more countries as needed
};

// Since datasets are now in the same directory as server.js
const basePath = path.join(__dirname, 'datasets');

const indicatorFiles = {
  'gdp': path.join(basePath, 'GDP-USD.csV'), // Renamed to match "GDP-USD.csV"
  'gdp_growth': path.join(basePath, 'GDP-Growth-Rate.csv'), // Renamed to "GDP-Growth-Rate.csv"
  'fdi_in': path.join(basePath, 'Foreign-direct-investment-net-inflows-GDP.csv'), // Renamed to match "Foreign-direct-investment-net-inflows-GDP.csv"
  'fdi_out': path.join(basePath, 'Foreign-direct-investment-net-outflows-BoP-current-US.csv'), // Renamed to "Foreign-direct-investment-net-outflows-BoP-current-US.csv"
  'agri_growth': path.join(basePath, 'Agriculture-forestry-fishing.csv'), // Renamed to match "Agriculture-forestry-fishing.csv"
  'manufacturing': path.join(basePath, 'Manufacturing-GDP.csv'), // Renamed to "Manufacturing-GDP.csv"
  'fertilizer_consumption': path.join(basePath, 'Fertilizer-consumption-hectare-arable-land.csv'), // Renamed to match "Fertilizer-consumption-hectare-arable-land.csv"
  'fertilizer_production': path.join(basePath, 'Fertilizer-consumption-fertilizer-production.csv'), // Renamed to match "Fertilizer-consumption-fertilizer-production.csv"
  'current_account_balance': path.join(basePath, 'CurrentAccountBalance.csv'), // Renamed to "CurrentAccountBalance.csv"
  'fdi_net_outflows_percent_gdp': path.join(basePath, 'FDI-NetOutflows.csv'), // Renamed to "FDI-NetOutflows.csv"
  'debt': path.join(basePath, 'DEBT_API_20.xls'), // Renamed to "DEBT_API_20.xls"
  // Add more indicators as needed
};

function getColumnName(indicator, countryName) {
  switch (indicator) {
    case 'gdp':
      return `GDP (current US$) ${countryName}`;
    case 'gdp_growth':
      return `GDP Growth Rate (%) ${countryName}`;
    // Add cases for other indicators
    default:
      return null;
  }
}

app.post('/api/data', (req, res) => {
    const { country, indicator, startYear, endYear } = req.body;

    // Validate input
    if (!country || !indicator) {
        return res.status(400).json({ error: 'Country and indicator are required.' });
    }

    // Map country code to country name
    const countryName = countryCodes[country];
    if (!countryName) {
        return res.status(400).json({ error: 'Invalid country.' });
    }

    // Get the file path for the indicator
    const filePath = indicatorFiles[indicator];
    if (!filePath) {
        return res.status(400).json({ error: 'Invalid indicator.' });
    }

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        console.error('Data file not found:', filePath);
        return res.status(404).json({ error: 'Data not found.' });
    }

    // Handle Excel files separately if any (not shown here)

   const results = [];

fs.createReadStream(filePath)
  .pipe(csv({ bom: true }))
  .on('data', (data) => {
    console.log('Row data:', data); // Log to inspect keys

    // Convert keys to lowercase and trim them for consistent access
    const row = {};
    for (const key in data) {
      row[key.trim().toLowerCase()] = data[key];
    }

    const year = parseInt(row['year'], 10); // Access 'year' in lowercase

    const columnName = getColumnName(indicator, countryName);
    if (!columnName) {
      console.error('Invalid indicator or country for column mapping.');
      return;
    }

    console.log(`Processing Year: ${year}, Column: ${columnName}`);
    
    const value = parseFloat(row[columnName.trim().toLowerCase()].replace(/,/g, ''));

    if (!isNaN(value) && !isNaN(year)) {
      if ((!startYear || year >= startYear) && (!endYear || year <= endYear)) {
        results.push({ Year: year, Value: value });
        console.log(`Added data point: Year ${year}, Value ${value}`);
      } else {
        console.log(`Year ${year} is outside the range ${startYear}-${endYear}`);
      }
    } else {
      console.log(`Invalid value or year for ${columnName} in year ${year}`);
    }
  })
  .on('end', () => {
    if (results.length === 0) {
      console.error('No data was collected.');
      return res.status(404).json({ error: 'No data available for the selected parameters.' });
    }
    results.sort((a, b) => a.Year - b.Year);
    res.json(results);
  })
  .on('error', (err) => {
    console.error('Error reading CSV file:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

})

    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });

