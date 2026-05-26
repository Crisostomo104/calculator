let currentUnit = 'metric'; // 'metric' or 'imperial'

function switchUnit(unit) {
    currentUnit = unit;
    
    // Update tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update labels and placeholders
    const wLabel = document.getElementById('weightLabel');
    const hLabel = document.getElementById('heightLabel');
    const wInput = document.getElementById('weight');
    const hInput = document.getElementById('height');
    
    if (unit === 'metric') {
        wLabel.textContent = 'Weight (kg)';
        hLabel.textContent = 'Height (cm)';
        wInput.placeholder = 'e.g. 70';
        hInput.placeholder = 'e.g. 175';
    } else {
        wLabel.textContent = 'Weight (lbs)';
        hLabel.textContent = 'Height (in)';
        wInput.placeholder = 'e.g. 150';
        hInput.placeholder = 'e.g. 68';
    }
    
    // Clear inputs when switching units
    wInput.value = '';
    hInput.value = '';
    document.getElementById('results').style.display = 'none';
}

function calculateBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const resultsDiv = document.getElementById('results');
    
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        resultsDiv.style.display = 'none';
        return;
    }
    
    let bmi = 0;
    
    if (currentUnit === 'metric') {
        // height in meters
        const heightInMeters = height / 100;
        bmi = weight / (heightInMeters * heightInMeters);
    } else {
        bmi = (weight / (height * height)) * 703;
    }
    
    displayResult(bmi);
}

function displayResult(bmi) {
    const scoreEl = document.getElementById('bmiScore');
    const catEl = document.getElementById('bmiCategory');
    const resultsDiv = document.getElementById('results');
    
    scoreEl.textContent = bmi.toFixed(1);
    
    // Reset classes
    scoreEl.className = 'bmi-score';
    catEl.className = 'bmi-category';
    
    if (bmi < 18.5) {
        catEl.textContent = 'Underweight';
        scoreEl.classList.add('underweight');
        catEl.classList.add('underweight');
    } else if (bmi >= 18.5 && bmi < 24.9) {
        catEl.textContent = 'Normal Weight';
        scoreEl.classList.add('normal');
        catEl.classList.add('normal');
    } else if (bmi >= 25 && bmi < 29.9) {
        catEl.textContent = 'Overweight';
        scoreEl.classList.add('overweight');
        catEl.classList.add('overweight');
    } else {
        catEl.textContent = 'Obese';
        scoreEl.classList.add('obese');
        catEl.classList.add('obese');
    }
    
    resultsDiv.style.display = 'block';
}
