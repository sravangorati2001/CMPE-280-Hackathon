
## Project Overview

This project is a web-based dashboard that visualizes macroeconomic and food security data, featuring time series graphs and a chatbot interface for data queries. It was developed as part of the CMPE 280 Hackathon.

## Project Demo

## Link: https://youtu.be/elJIw6k2PEA

https://github.com/user-attachments/assets/18032f95-454a-417a-a684-c7bff5715403

## Features

- Interactive time series visualization of economic indicators (GDP, FDI, Imports)
- Country selection (USA, China, India)
- Year range selection (2019-2021)
- Indicator selection (GDP, FDI Inflows, FDI Outflows, Imports)
- Chat interface for data queries
- Responsive web design

## Technology Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Python (Flask)
- Data Visualization: Chart.js
- Chat Interface: Custom implementation

## Setup and Installation

1. Clone the repository:
   git clone https://github.com/sravangorati2001/CMPE-280-Hackathon.git

2. Install dependencies:
   pip install -r requirements.txt

3. Run the Flask server:
   python app.py

4. Open `index.html` in a web browser

## Usage

1. Select a country from the dropdown menu
2. Choose the year range you want to visualize
3. Select economic indicators to display on the graph
4. Use the chat interface to query specific data points or trends

## Project Structure

- `app.py`: Flask server and API endpoints
- `index.html`: Main webpage
- `index.css`: Stylesheet
- `script.js`: Frontend JavaScript
- `datasets/`: Contains CSV files with economic data

## API Endpoints

- `/get_data`: Retrieves economic data for visualization
- `/chat`: Handles chat queries and responses

## Contributors

Sravan Kumar Gorati [017441749]

Kapil Gulani [017461314]

Varshith Pabbisetty [017416477]

Mahendra Chittupolu [016990558]




