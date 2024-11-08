// script.js

document.addEventListener('DOMContentLoaded', () => {
  // Variables for drag and drop
  let cloneId;
  let cnt = 0;

  // Function to fetch data from the backend API
  function getDataFromAPI(country, indicator) {
    // Get slider values for startYear and endYear
    const startYear = parseInt(document.getElementById('slider-1').value);
    const endYear = parseInt(document.getElementById('slider-2').value);

    return fetch('http://localhost:3000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country, indicator, startYear, endYear }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  // Function to render charts using Highcharts
  function renderChart(data, indicator, containerId) {
    const years = data.map((item) => item.Year);
    const values = data.map((item) => parseFloat(item.Value));

    Highcharts.chart(containerId, {
      chart: {
        type: 'line',
      },
      title: {
        text: `${indicator.toUpperCase()} Over Years`,
      },
      xAxis: {
        categories: years,
        title: {
          text: 'Year',
        },
      },
      yAxis: {
        title: {
          text: indicator.toUpperCase(),
        },
      },
      series: [
        {
          name: indicator.toUpperCase(),
          data: values,
        },
      ],
    });
  }

  // Drag and drop functions
  function allowDrop(ev) {
    ev.preventDefault();
  }

  function drag(ev) {
    cloneId = ev.target.id;
  }

  function drop(ev) {
    ev.preventDefault();
    const country = document.querySelector('#countrySelect').value || '1';
    const indicator = cloneId;

    // Get data from the API and render the chart
    getDataFromAPI(country, indicator).then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      // Create a container for the chart
      const chartContainerId = `chart_${indicator}_${country}_${cnt++}`;
      const chartDiv = document.createElement('div');
      chartDiv.id = chartContainerId;
      chartDiv.style.width = '100%';
      chartDiv.style.height = '400px';
      chartDiv.style.marginTop = '20px';

      // Append the chart container to the drop area
      ev.target.appendChild(chartDiv);

      // Render the chart
      renderChart(data, indicator, chartContainerId);
    });
  }
    
    function allowDrop(event) {
        event.preventDefault();
}
function toggleChat() {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            chatBox.classList.toggle('show'); // Add a CSS class for visibility
        } else {
            console.error("Chat box element not found.");
        }
    }
function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);

    if (draggedElement) {
        const dropTarget = event.target;
        
        // Check if it's already in the drop zone
        if (!dropTarget.contains(draggedElement)) {
            dropTarget.appendChild(draggedElement.cloneNode(true));
        }
    }
}

  // Menu item click handler
  function onClickMenuItem(indicator) {
    const country = document.querySelector('#countrySelect').value || '1';

    getDataFromAPI(country, indicator).then((data) => {
      if (data.error) {
        alert(data.error);
        return;
      }
      // Create a container for the chart
      const chartContainerId = `chart_${indicator}_${country}_${cnt++}`;
      const chartDiv = document.createElement('div');
      chartDiv.id = chartContainerId;
      chartDiv.style.width = '100%';
      chartDiv.style.height = '400px';
      chartDiv.style.marginTop = '20px';

      // Clear existing content in the area
      const area = document.getElementsByClassName('div1')[0];
      area.innerHTML = '';

      // Append the chart container
      area.appendChild(chartDiv);

      // Render the chart
      renderChart(data, indicator, chartContainerId);
    });
  }

  // Expose functions to the global scope
  window.allowDrop = allowDrop;
  window.drag = drag;
  window.drop = drop;
  window.onClickMenuItem = onClickMenuItem;

  // Functions for sliders
  window.slideOne = slideOne;
  window.slideTwo = slideTwo;

  function slideOne() {
    let sliderOne = document.getElementById('slider-1');
    let sliderTwo = document.getElementById('slider-2');
    let displayValOne = document.getElementById('range1');
    let minGap = 1;
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
      sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = sliderOne.value;
    fillColor();
  }

  function slideTwo() {
    let sliderOne = document.getElementById('slider-1');
    let sliderTwo = document.getElementById('slider-2');
    let displayValTwo = document.getElementById('range2');
    let minGap = 1;
    if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
      sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = sliderTwo.value;
    fillColor();
  }

  function fillColor() {
    let sliderOne = document.getElementById('slider-1');
    let sliderTwo = document.getElementById('slider-2');
    let sliderTrack = document.querySelector('.slider-track');
    let sliderMaxValue = document.getElementById('slider-1').max;
    let percent1 = ((sliderOne.value - sliderOne.min) / (sliderMaxValue - sliderOne.min)) * 100;
    let percent2 = ((sliderTwo.value - sliderOne.min) / (sliderMaxValue - sliderOne.min)) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #3264fe ${percent1}% , #3264fe ${percent2}%, #dadae5 ${percent2}%)`;
  }

  // Initialize sliders on page load
  window.onload = function () {
    slideOne();
    slideTwo();
  };
});
