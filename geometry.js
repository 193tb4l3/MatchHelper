document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const shapeBtns = document.querySelectorAll('.shape-btn');
    const shapeForms = document.querySelectorAll('.shape-form');
    const calculateBtns = document.querySelectorAll('.calculate-btn');
    const svg = document.getElementById('shape-svg');
    
    // Initialize calculator
    initCalculator();
    
    // Event Listeners
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', switchShape);
    });
    
    calculateBtns.forEach(btn => {
        btn.addEventListener('click', calculateShape);
    });
    
    // Initialize with square
    updateVisualization('square');
    
    // Functions
    function initCalculator() {
        // Set default values
        document.getElementById('square-side').value = '10';
        document.getElementById('rectangle-length').value = '10';
        document.getElementById('rectangle-width').value = '5';
        document.getElementById('triangle-base').value = '10';
        document.getElementById('triangle-height').value = '8';
        document.getElementById('triangle-side1').value = '6';
        document.getElementById('triangle-side2').value = '6';
        document.getElementById('circle-radius').value = '7';
        
        // Calculate default shapes
        calculateSquare();
        calculateRectangle();
        calculateTriangle();
        calculateCircle();
    }
    
    function switchShape(e) {
        // Update active button
        shapeBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        
        // Show corresponding form
        const shape = e.target.getAttribute('data-shape');
        shapeForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`${shape}-form`).classList.add('active');
        
        // Update visualization
        updateVisualization(shape);
    }
    
    function calculateShape(e) {
        const form = e.target.closest('.shape-form');
        const shape = form.id.replace('-form', '');
        
        switch(shape) {
            case 'square':
                calculateSquare();
                break;
            case 'rectangle':
                calculateRectangle();
                break;
            case 'triangle':
                calculateTriangle();
                break;
            case 'circle':
                calculateCircle();
                break;
        }
        
        updateVisualization(shape);
    }
    
    function calculateSquare() {
        const side = parseFloat(document.getElementById('square-side').value) || 0;
        const area = side * side;
        const perimeter = 4 * side;
        
        document.getElementById('square-area').textContent = area.toFixed(2);
        document.getElementById('square-perimeter').textContent = perimeter.toFixed(2);
    }
    
    function calculateRectangle() {
        const length = parseFloat(document.getElementById('rectangle-length').value) || 0;
        const width = parseFloat(document.getElementById('rectangle-width').value) || 0;
        const area = length * width;
        const perimeter = 2 * (length + width);
        
        document.getElementById('rectangle-area').textContent = area.toFixed(2);
        document.getElementById('rectangle-perimeter').textContent = perimeter.toFixed(2);
    }
    
    function calculateTriangle() {
        const base = parseFloat(document.getElementById('triangle-base').value) || 0;
        const height = parseFloat(document.getElementById('triangle-height').value) || 0;
        const side1 = parseFloat(document.getElementById('triangle-side1').value) || 0;
        const side2 = parseFloat(document.getElementById('triangle-side2').value) || 0;
        const area = 0.5 * base * height;
        const perimeter = base + side1 + side2;
        
        document.getElementById('triangle-area').textContent = area.toFixed(2);
        document.getElementById('triangle-perimeter').textContent = perimeter.toFixed(2);
    }
    
    function calculateCircle() {
        const radius = parseFloat(document.getElementById('circle-radius').value) || 0;
        const area = Math.PI * radius * radius;
        const circumference = 2 * Math.PI * radius;
        
        document.getElementById('circle-area').textContent = area.toFixed(2);
        document.getElementById('circle-circumference').textContent = circumference.toFixed(2);
    }
    
    function updateVisualization(shape) {
        // Clear previous SVG
        svg.innerHTML = '';
        
        // Update shape info
        updateShapeInfo(shape);
        
        // Draw the shape
        switch(shape) {
            case 'square':
                drawSquare();
                break;
            case 'rectangle':
                drawRectangle();
                break;
            case 'triangle':
                drawTriangle();
                break;
            case 'circle':
                drawCircle();
                break;
        }
    }
    
    function updateShapeInfo(shape) {
        // Set current shape name
        const shapeNames = {
            'square': 'Persegi',
            'rectangle': 'Persegi Panjang',
            'triangle': 'Segitiga',
            'circle': 'Lingkaran'
        };
        document.getElementById('current-shape').textContent = shapeNames[shape];
        
        // Set dimensions
        let dimensions = '';
        switch(shape) {
            case 'square':
                const side = document.getElementById('square-side').value || '0';
                dimensions = `Sisi: ${side}`;
                break;
            case 'rectangle':
                const length = document.getElementById('rectangle-length').value || '0';
                const width = document.getElementById('rectangle-width').value || '0';
                dimensions = `Panjang: ${length}<br>Lebar: ${width}`;
                break;
            case 'triangle':
                const base = document.getElementById('triangle-base').value || '0';
                const height = document.getElementById('triangle-height').value || '0';
                const side1 = document.getElementById('triangle-side1').value || '0';
                const side2 = document.getElementById('triangle-side2').value || '0';
                dimensions = `Alas: ${base}<br>Tinggi: ${height}<br>Sisi 1: ${side1}<br>Sisi 2: ${side2}`;
                break;
            case 'circle':
                const radius = document.getElementById('circle-radius').value || '0';
                dimensions = `Jari-jari: ${radius}`;
                break;
        }
        document.getElementById('shape-dimensions').innerHTML = dimensions;
        
        // Set calculation results
        const areaElement = document.getElementById(`${shape}-area`);
        const perimeterElement = document.getElementById(`${shape}-perimeter`) || 
                              document.getElementById(`${shape}-circumference`);
        
        document.getElementById('visual-area').textContent = 
            areaElement ? areaElement.textContent : '-';
        document.getElementById('visual-perimeter').textContent = 
            perimeterElement ? perimeterElement.textContent : '-';
    }
    
    function drawSquare() {
        const side = parseFloat(document.getElementById('square-side').value) || 100;
        const scale = 180 / Math.max(side, 1);
        const scaledSide = side * scale;
        const x = (220 - scaledSide) / 2;
        const y = (220 - scaledSide) / 2;
        
        // Draw square
        const square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        square.setAttribute("x", x);
        square.setAttribute("y", y);
        square.setAttribute("width", scaledSide);
        square.setAttribute("height", scaledSide);
        square.setAttribute("fill", "#3498db");
        square.setAttribute("stroke", "#2980b9");
        square.setAttribute("stroke-width", "2");
        svg.appendChild(square);
        
        // Add side label
        addLabel(x + scaledSide/2, y - 10, `sisi = ${side}`);
    }
    
    function drawRectangle() {
        const length = parseFloat(document.getElementById('rectangle-length').value) || 150;
        const width = parseFloat(document.getElementById('rectangle-width').value) || 80;
        const maxDim = Math.max(length, width);
        const scale = 180 / maxDim;
        const scaledLength = length * scale;
        const scaledWidth = width * scale;
        const x = (220 - scaledLength) / 2;
        const y = (220 - scaledWidth) / 2;
        
        // Draw rectangle
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", scaledLength);
        rect.setAttribute("height", scaledWidth);
        rect.setAttribute("fill", "#3498db");
        rect.setAttribute("stroke", "#2980b9");
        rect.setAttribute("stroke-width", "2");
        svg.appendChild(rect);
        
        // Add labels
        addLabel(x + scaledLength/2, y - 10, `panjang = ${length}`);
        addLabel(x + scaledLength + 15, y + scaledWidth/2, `lebar = ${width}`);
    }
    
    function drawTriangle() {
        const base = parseFloat(document.getElementById('triangle-base').value) || 100;
        const height = parseFloat(document.getElementById('triangle-height').value) || 80;
        const scale = 150 / Math.max(base, height);
        const scaledBase = base * scale;
        const scaledHeight = height * scale;
        
        const x1 = (220 - scaledBase) / 2;
        const y1 = (220 + scaledHeight) / 2;
        const x2 = x1 + scaledBase;
        const y2 = y1;
        const x3 = x1 + scaledBase / 2;
        const y3 = y1 - scaledHeight;
        
        // Draw triangle
        const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        triangle.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
        triangle.setAttribute("fill", "#3498db");
        triangle.setAttribute("stroke", "#2980b9");
        triangle.setAttribute("stroke-width", "2");
        svg.appendChild(triangle);
        
        // Add labels
        addLabel((x1 + x2) / 2, y1 + 15, `alas = ${base}`);
        addLabel(x3 + 15, (y1 + y3) / 2, `tinggi = ${height}`);
    }
    
    function drawCircle() {
        const radius = parseFloat(document.getElementById('circle-radius').value) || 80;
        const scale = 90 / Math.max(radius, 1);
        const scaledRadius = radius * scale;
        
        // Draw circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "110");
        circle.setAttribute("cy", "110");
        circle.setAttribute("r", scaledRadius);
        circle.setAttribute("fill", "#3498db");
        circle.setAttribute("stroke", "#2980b9");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
        
        // Draw radius line
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", "110");
        line.setAttribute("y1", "110");
        line.setAttribute("x2", 110 + scaledRadius);
        line.setAttribute("y2", "110");
        line.setAttribute("stroke", "#e74c3c");
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);
        
        // Add radius label
        addLabel(110 + scaledRadius/2, 100, `jari-jari = ${radius}`);
    }
    
    function addLabel(x, y, text) {
        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y);
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("font-size", "12");
        label.setAttribute("fill", "#2c3e50");
        label.textContent = text;
        svg.appendChild(label);
    }
});