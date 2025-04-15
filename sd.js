// script.js untuk SD
function hitung() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const num2 = parseFloat(document.getElementById('num2').value);
    const operator = document.getElementById('operator').value;
    let hasil;
    
    switch(operator) {
        case '+':
            hasil = num1 + num2;
            break;
        case '-':
            hasil = num1 - num2;
            break;
        case '*':
            hasil = num1 * num2;
            break;
        case '/':
            hasil = num1 / num2;
            break;
        default:
            hasil = "Operasi tidak valid";
    }
    
    document.getElementById('hasil').textContent = `Hasil: ${hasil}`;
}

function showInfo(shape) {
    const infoDiv = document.getElementById('shape-info');
    let info = '';
    
    switch(shape) {
        case 'persegi':
            info = '<h3>Persegi</h3><p>Persegi memiliki 4 sisi yang sama panjang.</p><p>Luas = sisi × sisi</p><p>Keliling = 4 × sisi</p>';
            break;
        case 'segitiga':
            info = '<h3>Segitiga</h3><p>Segitiga memiliki 3 sisi.</p><p>Luas = ½ × alas × tinggi</p><p>Keliling = jumlah semua sisi</p>';
            break;
        case 'lingkaran':
            info = '<h3>Lingkaran</h3><p>Lingkaran adalah bentuk bulat sempurna.</p><p>Luas = π × r²</p><p>Keliling = 2 × π × r</p>';
            break;
    }
    
    infoDiv.innerHTML = info;
}

