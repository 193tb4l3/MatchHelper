document.addEventListener('DOMContentLoaded', function() {
    const displayInput = document.getElementById('calc-input');
    const displayResult = document.getElementById('calc-result');
    const buttons = document.querySelectorAll('.calc-btn');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    
    // Format number with thousand separators
    function formatNumber(numberStr) {
        // Remove existing separators
        const numWithoutSeparators = numberStr.replace(/\./g, '');
        
        // Format with separators
        return numWithoutSeparators.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Parse formatted number back to float
    function parseFormattedNumber(formattedNum) {
        return parseFloat(formattedNum.replace(/\./g, ''));
    }
    
    // Update calculator display
    function updateDisplay() {
        // Format current input for display
        const formattedCurrent = currentInput.includes('.') ? 
            formatNumber(currentInput.split('.')[0]) + '.' + currentInput.split('.')[1] :
            formatNumber(currentInput);
            
        displayInput.value = previousInput + (operation ? ' ' + operation + ' ' : '') + 
                            (currentInput !== '0' ? formattedCurrent : '');
        displayResult.textContent = formattedCurrent;
    }
    
    // Reset calculator
    function resetCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetScreen = false;
        updateDisplay();
    }
    
    // Append number to current input
    function appendNumber(number) {
        if (currentInput === '0' || resetScreen) {
            currentInput = number;
            resetScreen = false;
        } else {
            // Remove separators before appending new number
            const rawNumber = currentInput.replace(/\./g, '');
            currentInput = rawNumber + number;
        }
        updateDisplay();
    }
    
    // Choose operation
    function chooseOperation(op) {
        // Parse current input without separators for calculations
        const currentNumber = parseFormattedNumber(currentInput);
        if (currentNumber === 0 && op !== 'C' && op !== '±' && op !== '%') return;
        
        switch(op) {
            case 'C':
                resetCalculator();
                break;
            case '±':
                currentInput = (currentNumber * -1).toString();
                updateDisplay();
                break;
            case '%':
                currentInput = (currentNumber / 100).toString();
                updateDisplay();
                break;
            case '=':
                if (operation === null || resetScreen) return;
                compute();
                operation = null;
                previousInput = '';
                resetScreen = true;
                break;
            default:
                if (operation !== null) compute();
                previousInput = currentInput;
                operation = op;
                resetScreen = true;
                updateDisplay();
        }
    }
    
    // Compute calculation
    function compute() {
        let computation;
        const prev = parseFormattedNumber(previousInput);
        const current = parseFormattedNumber(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        currentInput = computation.toString();
        updateDisplay();
    }
    
    // Add decimal point
    function addDecimal() {
        if (resetScreen) {
            currentInput = '0';
            resetScreen = false;
        }
        if (currentInput.includes('.')) return;
        currentInput += '.';
        updateDisplay();
    }
    
    // Button click event listeners
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');
            
            if (!isNaN(value) || value === '0') {
                appendNumber(value);
            } else if (value === '.') {
                addDecimal();
            } else {
                chooseOperation(value);
            }
        });
    });
    
    // Advanced calculator buttons (unchanged)
    document.getElementById('quadratic-solver').addEventListener('click', function() {
        alert('Fitur Solver Persamaan Kuadrat akan segera hadir!');
    });
    
    document.getElementById('geometry-calc').addEventListener('click', function() {
        alert('Fitur Kalkulator Geometri akan segera hadir!');
    });
    
    document.getElementById('graph-plotter').addEventListener('click', function() {
        alert('Fitur Pembuat Grafik akan segera hadir!');
    });
    
    document.getElementById('statistics-tool').addEventListener('click', function() {
        alert('Fitur Alat Statistika akan segera hadir!');
    });
    
    // Initialize calculator
    resetCalculator();
});