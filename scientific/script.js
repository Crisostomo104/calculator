let currentInput = '0';
let historyStr = '';
let waitingForExponent = false;

const currentDisplay = document.getElementById('current');
const historyDisplay = document.getElementById('history');

function updateDisplay() {
    currentDisplay.textContent = currentInput;
    historyDisplay.textContent = historyStr;
}

function appendChar(char) {
    if (waitingForExponent) {
        currentInput += '**' + char;
        waitingForExponent = false;
        updateDisplay();
        return;
    }

    if (currentInput === '0' && char !== '.' && char !== 'Math.PI' && char !== 'Math.E') {
        currentInput = char;
    } else {
        currentInput += char;
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    historyStr = '';
    waitingForExponent = false;
    updateDisplay();
}

function deleteChar() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate(fn) {
    try {
        let val = eval(currentInput.replace(/Math.PI/g, Math.PI).replace(/Math.E/g, Math.E));
        let res;
        switch(fn) {
            case 'sin': res = Math.sin(val); break;
            case 'cos': res = Math.cos(val); break;
            case 'tan': res = Math.tan(val); break;
            case 'sqrt': res = Math.sqrt(val); break;
            case 'square': res = Math.pow(val, 2); break;
            case 'log': res = Math.log10(val); break;
            case 'ln': res = Math.log(val); break;
            case 'pow': 
                currentInput += '**';
                waitingForExponent = true;
                updateDisplay();
                return;
        }
        historyStr = `${fn}(${currentInput}) =`;
        currentInput = res.toString();
        // Handle precision issues
        if(currentInput.length > 12) currentInput = parseFloat(res).toPrecision(12).replace(/\.?0+$/,"");
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(clearAll, 1500);
    }
}

function evaluateExpr() {
    try {
        let exprToEval = currentInput.replace(/Math.PI/g, Math.PI).replace(/Math.E/g, Math.E);
        let res = eval(exprToEval);
        historyStr = currentInput + ' =';
        currentInput = res.toString();
        // Handle long decimals
        if(currentInput.includes('.') && currentInput.length > 12) {
             currentInput = parseFloat(res).toPrecision(12).replace(/\.?0+$/,"");
        }
        updateDisplay();
    } catch (e) {
        currentInput = 'Error';
        updateDisplay();
        setTimeout(clearAll, 1500);
    }
}
