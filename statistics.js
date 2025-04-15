// statistics.js
document.addEventListener('DOMContentLoaded', function() {
    const calculateBtn = document.getElementById('calculate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const generateRandomBtn = document.getElementById('generate-random');
    const switchBtns = document.querySelectorAll('.switch-btn');
    const chartTabs = document.querySelectorAll('.chart-tab');
    const dataInput = document.getElementById('data-input');
    const chartCanvas = document.getElementById('statistics-chart');
    
    let statisticsChart = null;
    let currentData = [];
    let currentChartType = 'histogram';
    
    // Event listeners
    calculateBtn.addEventListener('click', calculateStatistics);
    clearBtn.addEventListener('click', clearData);
    generateRandomBtn.addEventListener('click', generateRandomData);
    
    // Switch between input methods
    switchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.dataset.method;
            
            // Update active button
            switchBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding input method
            document.querySelectorAll('.input-method').forEach(m => {
                m.classList.remove('active');
                if (m.id === `${method}-input`) {
                    m.classList.add('active');
                }
            });
        });
    });
    
    // Switch between chart types
    chartTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const chartType = this.dataset.chart;
            
            // Update active tab
            chartTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart
            currentChartType = chartType;
            updateChart();
        });
    });
    
    // Calculate statistics
    function calculateStatistics() {
        // Get data from input
        let inputText = dataInput.value.trim();
        
        if (!inputText) {
            alert('Masukkan data terlebih dahulu!');
            return;
        }
        
        // Parse input data (comma or space separated)
        currentData = inputText.split(/[,\s]+/).map(Number).filter(n => !isNaN(n));
        
        if (currentData.length === 0) {
            alert('Tidak ada data yang valid!');
            return;
        }
        
        // Sort data
        currentData.sort((a, b) => a - b);
        
        // Calculate statistics
        const mean = calculateMean(currentData);
        const median = calculateMedian(currentData);
        const mode = calculateMode(currentData);
        const range = calculateRange(currentData);
        const variance = calculateVariance(currentData, mean);
        const stdDev = Math.sqrt(variance);
        const q1 = calculateQuantile(currentData, 0.25);
        const q3 = calculateQuantile(currentData, 0.75);
        const iqr = q3 - q1;
        
        // Display results
        document.getElementById('mean-result').textContent = mean.toFixed(4);
        document.getElementById('median-result').textContent = median.toFixed(4);
        document.getElementById('mode-result').textContent = mode.length > 0 ? mode.join(', ') : 'Tidak ada';
        document.getElementById('range-result').textContent = range.toFixed(4);
        document.getElementById('variance-result').textContent = variance.toFixed(4);
        document.getElementById('stddev-result').textContent = stdDev.toFixed(4);
        document.getElementById('q1-result').textContent = q1.toFixed(4);
        document.getElementById('q3-result').textContent = q3.toFixed(4);
        document.getElementById('iqr-result').textContent = iqr.toFixed(4);
        
        // Update chart
        updateChart();
    }
    
    // Generate random data
    function generateRandomData() {
        const count = parseInt(document.getElementById('data-count').value);
        const min = parseFloat(document.getElementById('min-value').value);
        const max = parseFloat(document.getElementById('max-value').value);
        
        if (isNaN(count) || isNaN(min) || isNaN(max) || count < 5 || min >= max) {
            alert('Masukkan parameter yang valid!');
            return;
        }
        
        currentData = [];
        for (let i = 0; i < count; i++) {
            currentData.push(+(min + Math.random() * (max - min)).toFixed(2));
        }
        
        // Update input field
        dataInput.value = currentData.join(', ');
        
        // Calculate statistics
        calculateStatistics();
    }
    
    // Clear data
    function clearData() {
        dataInput.value = '';
        currentData = [];
        
        // Clear results
        document.querySelectorAll('.result-card p').forEach(p => {
            p.textContent = '-';
        });
        
        // Clear chart
        if (statisticsChart) {
            statisticsChart.destroy();
            statisticsChart = null;
        }
    }
    
    // Update chart based on current data and chart type
    function updateChart() {
        if (currentData.length === 0) return;
        
        const ctx = chartCanvas.getContext('2d');
        
        // Destroy previous chart if exists
        if (statisticsChart) {
            statisticsChart.destroy();
        }
        
        // Create new chart based on type
        switch(currentChartType) {
            case 'histogram':
                createHistogram(ctx);
                break;
            case 'boxplot':
                createBoxPlot(ctx);
                break;
            case 'scatter':
                createScatterPlot(ctx);
                break;
        }
    }
    
    // Create histogram chart
    function createHistogram(ctx) {
        // Calculate number of bins (using Sturges' formula)
        const binCount = Math.ceil(Math.log2(currentData.length)) + 1;
        
        // Find min and max values
        const minValue = Math.min(...currentData);
        const maxValue = Math.max(...currentData);
        const range = maxValue - minValue;
        const binSize = range / binCount;
        
        // Create bins
        const bins = Array(binCount).fill(0);
        const binLabels = [];
        
        for (let i = 0; i < binCount; i++) {
            const binStart = minValue + i * binSize;
            const binEnd = binStart + binSize;
            binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
            
            // Count values in this bin
            for (const value of currentData) {
                if (value >= binStart && (i === binCount - 1 ? value <= binEnd : value < binEnd)) {
                    bins[i]++;
                }
            }
        }
        
        statisticsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: 'Frekuensi',
                    data: bins,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frekuensi'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Nilai'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Histogram Distribusi Data'
                    }
                }
            }
        });
    }
    
    // Create box plot chart
    function createBoxPlot(ctx) {
        const sortedData = [...currentData].sort((a, b) => a - b);
        const q1 = calculateQuantile(sortedData, 0.25);
        const median = calculateMedian(sortedData);
        const q3 = calculateQuantile(sortedData, 0.75);
        const iqr = q3 - q1;
        
        const lowerWhisker = Math.max(sortedData[0], q1 - 1.5 * iqr);
        const upperWhisker = Math.min(sortedData[sortedData.length - 1], q3 + 1.5 * iqr);
        
        // Find outliers
        const outliers = sortedData.filter(x => x < lowerWhisker || x > upperWhisker);
        
        statisticsChart = new Chart(ctx, {
            type: 'boxplot',
            data: {
                labels: ['Data'],
                datasets: [{
                    label: 'Distribusi Data',
                    data: [{
                        min: sortedData[0],
                        q1: q1,
                        median: median,
                        q3: q3,
                        max: sortedData[sortedData.length - 1],
                        outliers: outliers
                    }],
                    backgroundColor: 'rgba(52, 152, 219, 0.5)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Nilai'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Box Plot Distribusi Data'
                    }
                }
            }
        });
    }
    
    // Create scatter plot chart
    function createScatterPlot(ctx) {
        const dataPoints = currentData.map((value, index) => ({
            x: index + 1,
            y: value
        }));
        
        statisticsChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Data Points',
                    data: dataPoints,
                    backgroundColor: 'rgba(52, 152, 219, 0.7)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 1,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Nilai'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Index'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Scatter Plot Data'
                    }
                }
            }
        });
    }
    
    // Statistics calculation functions
    function calculateMean(data) {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }
    
    function calculateMedian(data) {
        const mid = Math.floor(data.length / 2);
        return data.length % 2 !== 0 ? data[mid] : (data[mid - 1] + data[mid]) / 2;
    }
    
    function calculateMode(data) {
        const frequencyMap = {};
        let maxFrequency = 0;
        const modes = [];
        
        data.forEach(num => {
            frequencyMap[num] = (frequencyMap[num] || 0) + 1;
            
            if (frequencyMap[num] > maxFrequency) {
                maxFrequency = frequencyMap[num];
            }
        });
        
        for (const num in frequencyMap) {
            if (frequencyMap[num] === maxFrequency) {
                modes.push(Number(num));
            }
        }
        
        return modes.length === Object.keys(frequencyMap).length ? [] : modes;
    }
    
    function calculateRange(data) {
        return data[data.length - 1] - data[0];
    }
    
    function calculateVariance(data, mean) {
        return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    }
    
    function calculateQuantile(data, q) {
        const pos = (data.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        
        if (data[base + 1] !== undefined) {
            return data[base] + rest * (data[base + 1] - data[base]);
        } else {
            return data[base];
        }
    }
    
    // Initialize with manual input
    document.getElementById('manual-input').classList.add('active');
});

