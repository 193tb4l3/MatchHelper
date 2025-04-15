// graph.js
document.addEventListener('DOMContentLoaded', function() {
    const functionType = document.getElementById('function-type');
    const inputGroups = document.querySelectorAll('.input-group');
    const plotBtn = document.getElementById('plot-btn');
    const resetBtn = document.getElementById('reset-btn');
    const graphCanvas = document.getElementById('function-graph');
    const graphDetails = document.getElementById('graph-details');
    
    let functionChart = null;
    
    // Change function type
    functionType.addEventListener('change', function() {
        const selectedType = this.value;
        
        // Hide all input groups
        inputGroups.forEach(group => {
            group.classList.remove('active');
        });
        
        // Show selected input group
        document.getElementById(`${selectedType}-inputs`).classList.add('active');
    });
    
    // Plot graph
    plotBtn.addEventListener('click', plotFunction);
    
    // Reset graph
    resetBtn.addEventListener('click', resetGraph);
    
    function plotFunction() {
        const type = functionType.value;
        const xMin = parseFloat(document.getElementById('x-min').value);
        const xMax = parseFloat(document.getElementById('x-max').value);
        const step = parseFloat(document.getElementById('step').value);
        
        if (isNaN(xMin) || isNaN(xMax) || isNaN(step)) {
            alert('Masukkan parameter yang valid!');
            return;
        }
        
        // Generate x values
        const xValues = [];
        for (let x = xMin; x <= xMax; x += step) {
            xValues.push(x);
        }
        
        // Calculate y values based on function type
        const yValues = calculateYValues(type, xValues);
        
        // Create or update chart
        createChart(xValues, yValues, type);
        
        // Show graph details
        showGraphDetails(type, yValues);
    }
    
    function calculateYValues(type, xValues) {
        switch(type) {
            case 'linear':
                const m = parseFloat(document.getElementById('linear-m').value);
                const c = parseFloat(document.getElementById('linear-c').value);
                return xValues.map(x => m * x + c);
                
            case 'quadratic':
                const a = parseFloat(document.getElementById('quadratic-a').value);
                const b = parseFloat(document.getElementById('quadratic-b').value);
                const c2 = parseFloat(document.getElementById('quadratic-c').value);
                return xValues.map(x => a * x * x + b * x + c2);
                
            case 'cubic':
                const a3 = parseFloat(document.getElementById('cubic-a').value);
                const b3 = parseFloat(document.getElementById('cubic-b').value);
                const c3 = parseFloat(document.getElementById('cubic-c').value);
                const d3 = parseFloat(document.getElementById('cubic-d').value);
                return xValues.map(x => a3 * x * x * x + b3 * x * x + c3 * x + d3);
                
            case 'trigonometric':
                const a4 = parseFloat(document.getElementById('trig-a').value);
                const b4 = parseFloat(document.getElementById('trig-b').value);
                const c4 = parseFloat(document.getElementById('trig-c').value);
                const d4 = parseFloat(document.getElementById('trig-d').value);
                return xValues.map(x => a4 * Math.sin(b4 * x + c4) + d4);
                
            case 'exponential':
                const a5 = parseFloat(document.getElementById('exp-a').value);
                const b5 = parseFloat(document.getElementById('exp-b').value);
                return xValues.map(x => a5 * Math.exp(b5 * x));
                
            default:
                return [];
        }
    }
    
    function createChart(xValues, yValues, type) {
        const ctx = graphCanvas.getContext('2d');
        
        // Destroy previous chart if exists
        if (functionChart) {
            functionChart.destroy();
        }
        
        // Create new chart
        functionChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues.map(x => x.toFixed(1)),
                datasets: [{
                    label: getFunctionLabel(type),
                    data: yValues,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: type === 'trigonometric' ? 0.4 : 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'y'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    function getFunctionLabel(type) {
        switch(type) {
            case 'linear':
                const m = document.getElementById('linear-m').value;
                const c = document.getElementById('linear-c').value;
                return `y = ${m}x + ${c}`;
                
            case 'quadratic':
                const a = document.getElementById('quadratic-a').value;
                const b = document.getElementById('quadratic-b').value;
                const c2 = document.getElementById('quadratic-c').value;
                return `y = ${a}x² + ${b}x + ${c2}`;
                
            case 'cubic':
                const a3 = document.getElementById('cubic-a').value;
                const b3 = document.getElementById('cubic-b').value;
                const c3 = document.getElementById('cubic-c').value;
                const d3 = document.getElementById('cubic-d').value;
                return `y = ${a3}x³ + ${b3}x² + ${c3}x + ${d3}`;
                
            case 'trigonometric':
                const a4 = document.getElementById('trig-a').value;
                const b4 = document.getElementById('trig-b').value;
                const c4 = document.getElementById('trig-c').value;
                const d4 = document.getElementById('trig-d').value;
                return `y = ${a4}sin(${b4}x + ${c4}) + ${d4}`;
                
            case 'exponential':
                const a5 = document.getElementById('exp-a').value;
                const b5 = document.getElementById('exp-b').value;
                return `y = ${a5}e^(${b5}x)`;
                
            default:
                return 'Fungsi';
        }
    }
    
    function showGraphDetails(type, yValues) {
        let details = '';
        
        // Find min and max y values
        const minY = Math.min(...yValues);
        const maxY = Math.max(...yValues);
        
        details += `<p><strong>Persamaan:</strong> ${getFunctionLabel(type)}</p>`;
        details += `<p><strong>Nilai minimum y:</strong> ${minY.toFixed(4)}</p>`;
        details += `<p><strong>Nilai maksimum y:</strong> ${maxY.toFixed(4)}</p>`;
        
        // Additional details based on function type
        if (type === 'quadratic') {
            const a = parseFloat(document.getElementById('quadratic-a').value);
            const b = parseFloat(document.getElementById('quadratic-b').value);
            const c = parseFloat(document.getElementById('quadratic-c').value);
            
            const vertexX = -b / (2 * a);
            const vertexY = a * vertexX * vertexX + b * vertexX + c;
            
            details += `<p><strong>Titik puncak:</strong> (${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})</p>`;
        }
        
        graphDetails.innerHTML = details;
    }
    
    function resetGraph() {
        if (functionChart) {
            functionChart.destroy();
            functionChart = null;
        }
        
        graphDetails.innerHTML = '';
        
        // Reset inputs to default values
        document.getElementById('linear-m').value = 1;
        document.getElementById('linear-c').value = 0;
        document.getElementById('quadratic-a').value = 1;
        document.getElementById('quadratic-b').value = 0;
        document.getElementById('quadratic-c').value = 0;
        document.getElementById('cubic-a').value = 1;
        document.getElementById('cubic-b').value = 0;
        document.getElementById('cubic-c').value = 0;
        document.getElementById('cubic-d').value = 0;
        document.getElementById('trig-a').value = 1;
        document.getElementById('trig-b').value = 1;
        document.getElementById('trig-c').value = 0;
        document.getElementById('trig-d').value = 0;
        document.getElementById('exp-a').value = 1;
        document.getElementById('exp-b').value = 1;
        document.getElementById('x-min').value = -10;
        document.getElementById('x-max').value = 10;
        document.getElementById('step').value = 0.1;
    }
    
    // Initialize with linear function
    document.getElementById('linear-inputs').classList.add('active');
});

