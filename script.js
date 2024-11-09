document.addEventListener('DOMContentLoaded', () => {
    // Global variables
    let cloneId;
    let cnt = 0;

    // API Functions
    function getDataFromAPI(country, indicator) {
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

    // Chart Functions
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
            series: [{
                name: indicator.toUpperCase(),
                data: values,
            }],
        });
    }

    // Drag and Drop Functions
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

        getDataFromAPI(country, indicator).then((data) => {
            if (data.error) {
                alert(data.error);
                return;
            }
            const chartContainerId = `chart_${indicator}_${country}_${cnt++}`;
            const chartDiv = document.createElement('div');
            chartDiv.id = chartContainerId;
            chartDiv.style.width = '100%';
            chartDiv.style.height = '400px';
            chartDiv.style.marginTop = '20px';

            ev.target.appendChild(chartDiv);
            renderChart(data, indicator, chartContainerId);
        });
    }

    // Menu Functions
    function onClickMenuItem(indicator) {
        const country = document.querySelector('#countrySelect').value || '1';

        getDataFromAPI(country, indicator).then((data) => {
            if (data.error) {
                alert(data.error);
                return;
            }
            const chartContainerId = `chart_${indicator}_${country}_${cnt++}`;
            const chartDiv = document.createElement('div');
            chartDiv.id = chartContainerId;
            chartDiv.style.width = '100%';
            chartDiv.style.height = '400px';
            chartDiv.style.marginTop = '20px';

            const area = document.getElementsByClassName('div1')[0];
            area.innerHTML = '';
            area.appendChild(chartDiv);

            renderChart(data, indicator, chartContainerId);
        });
    }

    // Slider Functions
    function slideOne() {
        const sliderOne = document.getElementById('slider-1');
        const sliderTwo = document.getElementById('slider-2');
        const displayValOne = document.getElementById('range1');
        const minGap = 1;

        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
            sliderOne.value = parseInt(sliderTwo.value) - minGap;
        }
        displayValOne.textContent = sliderOne.value;
        fillColor();
    }

    function slideTwo() {
        const sliderOne = document.getElementById('slider-1');
        const sliderTwo = document.getElementById('slider-2');
        const displayValTwo = document.getElementById('range2');
        const minGap = 1;

        if (parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap) {
            sliderTwo.value = parseInt(sliderOne.value) + minGap;
        }
        displayValTwo.textContent = sliderTwo.value;
        fillColor();
    }

    function fillColor() {
        const sliderOne = document.getElementById('slider-1');
        const sliderTwo = document.getElementById('slider-2');
        const sliderTrack = document.querySelector('.slider-track');
        
        const percent1 = ((sliderOne.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) * 100;
        const percent2 = ((sliderTwo.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) * 100;
        
        sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #2C3E50 ${percent1}%, #007bc2 ${percent2}%, #dadae5 ${percent2}%)`;
    }

    // Chat Functions
    function toggleChat() {
        const chatBox = document.getElementById('chatBox');
        if (chatBox) {
            chatBox.classList.toggle('show');
        } else {
            console.error("Chat box element not found.");
        }
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    function sendMessage() {
        const userInput = document.getElementById("userInput");
        const chatContent = document.getElementById("chatContent");
        const message = userInput.value.trim();

        if (!message) return;

        const userMessage = document.createElement("p");
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatContent.appendChild(userMessage);

        fetch("http://127.0.0.1:5000/query", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ "query": message })
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = document.createElement("p");
            botMessage.innerHTML = `<strong>Bot:</strong> ${data.answer}`;
            chatContent.appendChild(botMessage);
            userInput.value = "";
            chatContent.scrollTop = chatContent.scrollHeight;
        })
        .catch(error => {
            console.error("Error:", error);
            const errorMessage = document.createElement("p");
            errorMessage.innerHTML = `<strong>Bot:</strong> Sorry, something went wrong. Please try again later.`;
            chatContent.appendChild(errorMessage);
        });
    }

    // Initialize Components
    function init() {
        slideOne();
        slideTwo();
        
        // Initialize feather icons if available
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    }

    // Expose functions to global scope
    window.allowDrop = allowDrop;
    window.drag = drag;
    window.drop = drop;
    window.onClickMenuItem = onClickMenuItem;
    window.slideOne = slideOne;
    window.slideTwo = slideTwo;
    window.toggleChat = toggleChat;
    window.handleKeyPress = handleKeyPress;
    window.sendMessage = sendMessage;

    // Initialize on page load
    window.onload = init;
});