// script-smp.js
function solveLinear() {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    
    if (a === 0) {
        document.getElementById('linear-solution').innerHTML = 
            "Nilai a tidak boleh 0 dalam persamaan linear.";
        return;
    }
    
    const x = (c - b) / a;
    document.getElementById('linear-solution').innerHTML = 
        `Penyelesaian: x = ${x.toFixed(2)}<br>` +
        `Langkah: ${a}x + ${b} = ${c}<br>` +
        `=> ${a}x = ${c} - ${b}<br>` +
        `=> ${a}x = ${c - b}<br>` +
        `=> x = ${c - b} / ${a}<br>` +
        `=> x = ${x.toFixed(2)}`;
}

function calculateHypotenuse() {
    const a = parseFloat(document.getElementById('side-a').value);
    const b = parseFloat(document.getElementById('side-b').value);
    
    if (a <= 0 || b <= 0) {
        document.getElementById('hypotenuse-result').textContent = 
            "Panjang sisi harus lebih besar dari 0";
        return;
    }
    
    const c = Math.sqrt(a*a + b*b);
    document.getElementById('hypotenuse-result').innerHTML = 
        `Sisi miring (c) = √(${a}² + ${b}²) = √(${a*a} + ${b*b}) = √${a*a + b*b} ≈ ${c.toFixed(2)}`;
}

function calculateCircleArea() {
    const radius = parseFloat(document.getElementById('radius').value);
    
    if (radius <= 0) {
        document.getElementById('circle-area-result').textContent = 
            "Jari-jari harus lebih besar dari 0";
        return;
    }
    
    const area = Math.PI * radius * radius;
    document.getElementById('circle-area-result').innerHTML = 
        `Luas lingkaran = π × r² = 3.1416 × ${radius}² = 3.1416 × ${radius*radius} ≈ ${area.toFixed(2)}`;
}

