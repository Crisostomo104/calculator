const units = {
    length: {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
    },
    weight: {
        kilogram: 1,
        gram: 0.001,
        milligram: 0.000001,
        pound: 0.453592,
        ounce: 0.0283495
    }
};

let currentCategory = 'length';

function init() {
    populateSelects();
}

function switchCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    document.getElementById('inputValue').value = '';
    document.getElementById('outputValue').value = '';
    
    populateSelects();
}

function populateSelects() {
    const inSelect = document.getElementById('inputUnit');
    const outSelect = document.getElementById('outputUnit');
    inSelect.innerHTML = '';
    outSelect.innerHTML = '';
    
    const catUnits = Object.keys(units[currentCategory]);
    
    catUnits.forEach(u => {
        const title = u.charAt(0).toUpperCase() + u.slice(1);
        inSelect.add(new Option(title, u));
        outSelect.add(new Option(title, u));
    });
    
    if (catUnits.length > 1) {
        outSelect.selectedIndex = 1; // Pick second option as default output
    }
}

function convert() {
    const val = parseFloat(document.getElementById('inputValue').value);
    if (isNaN(val)) {
        document.getElementById('outputValue').value = '';
        return;
    }
    
    const inUnit = document.getElementById('inputUnit').value;
    const outUnit = document.getElementById('outputUnit').value;
    
    // Convert to base unit first (meter or kilogram)
    const baseVal = val * units[currentCategory][inUnit];
    
    // Convert base to output unit
    let result = baseVal / units[currentCategory][outUnit];
    
    // Format to avoid long decimals
    if(result % 1 !== 0) {
        result = parseFloat(result.toFixed(6));
    }
    
    document.getElementById('outputValue').value = result;
}

// Run init on load
window.onload = init;
