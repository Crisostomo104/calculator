function calculateLoan() {
    const principal = parseFloat(document.getElementById('principal').value);
    const interestRate = parseFloat(document.getElementById('interest').value);
    const years = parseFloat(document.getElementById('years').value);
    const resultsDiv = document.getElementById('results');

    if (isNaN(principal) || isNaN(interestRate) || isNaN(years) || principal <= 0 || interestRate <= 0 || years <= 0) {
        resultsDiv.style.display = 'none';
        return;
    }

    const principalAmount = principal;
    const calculatedInterest = interestRate / 100 / 12;
    const calculatedPayments = years * 12;

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principalAmount * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
        const monthlyPayment = monthly.toFixed(2);
        const totalPayment = (monthly * calculatedPayments).toFixed(2);
        const totalInterest = ((monthly * calculatedPayments) - principalAmount).toFixed(2);

        document.getElementById('monthlyPayment').textContent = '$' + Number(monthlyPayment).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('totalPayment').textContent = '$' + Number(totalPayment).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        document.getElementById('totalInterest').textContent = '$' + Number(totalInterest).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        resultsDiv.style.display = 'block';
    } else {
        resultsDiv.style.display = 'none';
    }
}
