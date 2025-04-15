// quadratic.js
document.addEventListener('DOMContentLoaded', function() {
    const solveBtn = document.getElementById('solve-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exampleBtns = document.querySelectorAll('.example-buttons button');
    
    solveBtn.addEventListener('click', solveQuadratic);
    resetBtn.addEventListener('click', resetSolver);
    
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('a').value = this.dataset.a;
            document.getElementById('b').value = this.dataset.b;
            document.getElementById('c').value = this.dataset.c;
        });
    });
    
    function solveQuadratic() {
        const a = parseFloat(document.getElementById('a').value);
        const b = parseFloat(document.getElementById('b').value);
        const c = parseFloat(document.getElementById('c').value);
        
        if (isNaN(a) || isNaN(b) || isNaN(c)) {
            alert('Masukkan koefisien yang valid!');
            return;
        }
        
        const rootsResult = document.getElementById('roots-result');
        const stepsResult = document.getElementById('steps-result');
        
        rootsResult.innerHTML = '';
        stepsResult.innerHTML = '';
        
        // Calculate discriminant
        const discriminant = b*b - 4*a*c;
        
        // Add steps
        addStep(stepsResult, `1. Persamaan: ${a}x² + ${b}x + ${c} = 0`);
        addStep(stepsResult, `2. Menghitung diskriminan (D) = b² - 4ac`);
        addStep(stepsResult, `   D = ${b}² - 4 × ${a} × ${c} = ${discriminant}`);
        
        if (discriminant > 0) {
            const root1 = (-b + Math.sqrt(discriminant)) / (2*a);
            const root2 = (-b - Math.sqrt(discriminant)) / (2*a);
            
            addStep(stepsResult, `3. Karena D > 0, persamaan memiliki 2 akar real berbeda`);
            addStep(stepsResult, `4. Menghitung akar-akar menggunakan rumus kuadrat:`);
            addStep(stepsResult, `   x = [-b ± √D] / 2a`);
            addStep(stepsResult, `   x₁ = [${-b} + √${discriminant}] / ${2*a} = ${root1.toFixed(2)}`);
            addStep(stepsResult, `   x₂ = [${-b} - √${discriminant}] / ${2*a} = ${root2.toFixed(2)}`);
            
            rootsResult.innerHTML = `
                <p>Akar-akar persamaan:</p>
                <p>x₁ = ${root1.toFixed(4)}</p>
                <p>x₂ = ${root2.toFixed(4)}</p>
            `;
        } 
        else if (discriminant === 0) {
            const root = -b / (2*a);
            
            addStep(stepsResult, `3. Karena D = 0, persamaan memiliki 1 akar real kembar`);
            addStep(stepsResult, `4. Menghitung akar menggunakan rumus kuadrat:`);
            addStep(stepsResult, `   x = -b / 2a`);
            addStep(stepsResult, `   x = ${-b} / ${2*a} = ${root.toFixed(2)}`);
            
            rootsResult.innerHTML = `
                <p>Akar persamaan:</p>
                <p>x = ${root.toFixed(4)} (akar kembar)</p>
            `;
        } 
        else {
            const realPart = (-b / (2*a)).toFixed(2);
            const imagPart = (Math.sqrt(-discriminant) / (2*a)).toFixed(2);
            
            addStep(stepsResult, `3. Karena D < 0, persamaan memiliki akar kompleks`);
            addStep(stepsResult, `4. Menghitung akar kompleks:`);
            addStep(stepsResult, `   x = [${-b} ± √${discriminant}] / ${2*a}`);
            addStep(stepsResult, `   x = ${realPart} ± ${imagPart}i`);
            
            rootsResult.innerHTML = `
                <p>Akar-akar kompleks:</p>
                <p>x₁ = ${realPart} + ${imagPart}i</p>
                <p>x₂ = ${realPart} - ${imagPart}i</p>
            `;
        }
    }
    
    function addStep(container, text) {
        const step = document.createElement('p');
        step.innerHTML = text;
        container.appendChild(step);
    }
    
    function resetSolver() {
        document.getElementById('a').value = '';
        document.getElementById('b').value = '';
        document.getElementById('c').value = '';
        document.getElementById('roots-result').innerHTML = '';
        document.getElementById('steps-result').innerHTML = '';
    }
});

