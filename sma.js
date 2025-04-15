document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');
    const functionInput = document.getElementById('function');
    const xMinInput = document.getElementById('x-min');
    const xMaxInput = document.getElementById('x-max');
    const stepWhole = document.getElementById('step-whole');
    const stepNumerator = document.getElementById('step-numerator');
    const stepDenominator = document.getElementById('step-denominator');
    const plotBtn = document.getElementById('plot-btn');

    // Initialize with default function
    functionInput.value = 'sin(x)';
    
    // Set canvas size
    function resizeCanvas() {
        const container = document.querySelector('.graph');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        plotGraph();
    }

    // Calculate step size from fraction inputs
    function getStepSize() {
        const whole = parseFloat(stepWhole.value) || 0;
        const numerator = parseFloat(stepNumerator.value) || 0;
        const denominator = parseFloat(stepDenominator.value) || 1;
        return whole + (numerator / denominator);
    }

    // Main plotting function
    function plotGraph() {
        const funcStr = functionInput.value.trim() || 'sin(x)';
        const xMin = parseFloat(xMinInput.value) || -10;
        const xMax = parseFloat(xMaxInput.value) || 10;
        const step = getStepSize();
        
        // Validate inputs
        if (xMin >= xMax) {
            alert('Nilai X minimum harus lebih kecil dari X maximum');
            return;
        }
        
        if (step <= 0) {
            alert('Nilai presisi harus lebih besar dari 0');
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw axes and grid
        drawAxes(xMin, xMax);
        
        // Plot the function
        plotFunction(funcStr, xMin, xMax, step);
    }

    // Draw x and y axes with grid
    function drawAxes(xMin, xMax) {
        const width = canvas.width;
        const height = canvas.height;
        const xRange = xMax - xMin;
        const xScale = width / xRange;
        const yScale = height / 20; // Shows range from -10 to 10 by default
        
        // Calculate origin position
        const originX = -xMin * xScale;
        const originY = height / 2;
        
        // Set styles
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.fillStyle = '#666';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Draw vertical grid lines
        const xStep = calculateGridStep(xRange);
        for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
            const screenX = originX + x * xScale;
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
            
            // Draw x-axis labels
            ctx.fillText(x.toFixed(1), screenX, originY + 15);
        }
        
        // Draw horizontal grid lines
        const yStep = 2;
        for (let y = -10; y <= 10; y += yStep) {
            const screenY = originY - y * yScale;
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
            
            // Draw y-axis labels
            if (y !== 0) {
                ctx.textAlign = 'right';
                ctx.fillText(y.toString(), originX - 5, screenY);
                ctx.textAlign = 'center';
            }
        }
        
        // Draw axes
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // X axis
        ctx.moveTo(0, originY);
        ctx.lineTo(width, originY);
        
        // Y axis
        ctx.moveTo(originX, 0);
        ctx.lineTo(originX, height);
        
        ctx.stroke();
        
        // Draw axis labels
        ctx.font = '14px Arial';
        ctx.fillStyle = '#000';
        ctx.fillText('x', width - 10, originY + 20);
        ctx.textAlign = 'left';
        ctx.fillText('y', originX + 10, 10);
    }

    // Plot the mathematical function
    function plotFunction(funcStr, xMin, xMax, step) {
        const width = canvas.width;
        const height = canvas.height;
        const xRange = xMax - xMin;
        const xScale = width / xRange;
        const yScale = height / 20; // Shows range from -10 to 10 by default
        const originX = -xMin * xScale;
        const originY = height / 2;
        
        // Prepare function
        const sanitizedFunc = funcStr
            .replace(/\^/g, '**')  // Handle exponents
            .replace(/sin\(/g, 'Math.sin(')
            .replace(/cos\(/g, 'Math.cos(')
            .replace(/tan\(/g, 'Math.tan(')
            .replace(/sqrt\(/g, 'Math.sqrt(')
            .replace(/log\(/g, 'Math.log10(')
            .replace(/ln\(/g, 'Math.log(');
        
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let firstPoint = true;
        for (let x = xMin; x <= xMax; x += step) {
            try {
                const y = eval(sanitizedFunc.replace(/x/g, `(${x})`));
                
                if (isNaN(y) || !isFinite(y)) {
                    firstPoint = true;
                    continue;
                }
                
                const screenX = originX + x * xScale;
                const screenY = originY - y * yScale;
                
                if (firstPoint) {
                    ctx.moveTo(screenX, screenY);
                    firstPoint = false;
                } else {
                    ctx.lineTo(screenX, screenY);
                }
            } catch (e) {
                console.error('Error evaluating function:', e);
                firstPoint = true;
            }
        }
        
        ctx.stroke();
    }

    // Calculate appropriate grid step based on range
    function calculateGridStep(range) {
        const log10 = Math.log10(range);
        const power = Math.floor(log10);
        const fraction = range / Math.pow(10, power);
        
        if (fraction <= 2) return 0.2 * Math.pow(10, power);
        if (fraction <= 5) return 0.5 * Math.pow(10, power);
        return 1 * Math.pow(10, power);
    }

    // Event listeners
    plotBtn.addEventListener('click', plotGraph);
    window.addEventListener('resize', resizeCanvas);
    
    // Initial plot
    resizeCanvas();
});