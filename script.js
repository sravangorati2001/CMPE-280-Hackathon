document.addEventListener('DOMContentLoaded', () => {
    // Global variables
    let cloneId;
    let cnt = 0;
    let playbackInterval;
    let isPlaying = false;
    let chartInstance;

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
        .then((data) => {
            console.log('Data received from API:', data); // Debugging line
            return data;
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
    }

    // Update Chart
    function updateChart() {
        const country = document.querySelector('#countrySelect').value;
        const indicator = cloneId; // or set this to the selected indicator

        getDataFromAPI(country, indicator).then((data) => {
            if (data && data.length > 0) {
                renderChart(data, indicator, 'chartContainer');
            } else {
                console.warn("No data available to render chart.");
            }
        });
    }

    // Chart Functions
    function renderChart(data, indicator, containerId) {
        const years = data.map((item) => item.Year);
        const values = data.map((item) => parseFloat(item.Value));

        if (chartInstance) {
            // Update the existing chart if it already exists
            chartInstance.series[0].setData(values, true);
            chartInstance.xAxis[0].setCategories(years, true);
        } else {
            // Create a new chart instance if it doesn't exist
            chartInstance = Highcharts.chart(containerId, {
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
        const country = document.querySelector('#countrySelect').value;
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
        const country = document.querySelector('#countrySelect').value;

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
        updateChart();
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
        updateChart();
    }

    function fillColor() {
        const sliderOne = document.getElementById('slider-1');
        const sliderTwo = document.getElementById('slider-2');
        const sliderTrack = document.querySelector('.slider-track');
        
        const percent1 = ((sliderOne.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) * 100;
        const percent2 = ((sliderTwo.value - sliderOne.min) / (sliderOne.max - sliderOne.min)) * 100;
        
        sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}%, #2C3E50 ${percent1}%, #007bc2 ${percent2}%, #dadae5 ${percent2}%)`;
    }

    // Playback Functions
    function startPlayback() {
        const playbackIcon = document.getElementById("playbackIcon");

        if (isPlaying) {
            stopPlayback();
            playbackIcon.src = "https://icons.veryicon.com/png/o/miscellaneous/block-icon-library/video-playback-3.png"; // Play icon
            playbackIcon.alt = "Play";
            return;
        }

        isPlaying = true;
        playbackIcon.src = "https://icons.veryicon.com/png/o/miscellaneous/block-icon-library/video-pause-3.png"; // Pause icon
        playbackIcon.alt = "Pause";

        const startYear = parseInt(document.getElementById("slider-1").value);
        const endYear = parseInt(document.getElementById("slider-2").value);
        let currentYear = startYear;

        playbackInterval = setInterval(() => {
            if (currentYear > endYear) {
                stopPlayback();
                playbackIcon.src = "https://icons.veryicon.com/png/o/miscellaneous/block-icon-library/video-playback-3.png"; // Reset to play icon
                playbackIcon.alt = "Play";
                return;
            }

            document.getElementById("slider-1").value = currentYear;
            document.getElementById("range1").innerText = currentYear; // Update displayed start year
            slideOne(); // Call existing function to handle other updates
            currentYear++;
        }, 500); // Adjust interval time for speed
    }

    function stopPlayback() {
        clearInterval(playbackInterval);
        isPlaying = false;
    }

    // Chat and Message Functions
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
    window.startPlayback = startPlayback;
    window.stopPlayback = stopPlayback;

    // Initialize Components on page load
    init();
    function init() {
        slideOne();
        slideTwo();
    }

    // Event listeners for sliders
    document.getElementById('slider-1').addEventListener('input', slideOne);
    document.getElementById('slider-2').addEventListener('input', slideTwo);
});
