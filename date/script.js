// Set today as default start date
document.getElementById('startDate').valueAsDate = new Date();

function calculateDateDiff() {
    const startInput = document.getElementById('startDate').value;
    const endInput = document.getElementById('endDate').value;
    const resultsDiv = document.getElementById('results');

    if (!startInput || !endInput) {
        resultsDiv.style.display = 'none';
        return;
    }

    const startDate = new Date(startInput);
    const endDate = new Date(endInput);
    
    // Ignore time zone issues by just taking UTC days
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const diffWeeks = (diffDays / 7).toFixed(1);
    
    // Approximate months and years
    const diffMonths = (diffDays / 30.44).toFixed(1);
    const diffYears = (diffDays / 365.25).toFixed(1);

    document.getElementById('daysDiff').textContent = diffDays.toLocaleString();
    document.getElementById('weeksDiff').textContent = Number(diffWeeks).toLocaleString();
    document.getElementById('monthsDiff').textContent = Number(diffMonths).toLocaleString();
    document.getElementById('yearsDiff').textContent = Number(diffYears).toLocaleString();

    resultsDiv.style.display = 'block';
}
