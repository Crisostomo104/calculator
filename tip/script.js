function calculateTip() {
    const bill = parseFloat(document.getElementById('bill').value);
    const tipPercent = parseFloat(document.getElementById('tipPercent').value);
    const people = parseInt(document.getElementById('people').value);

    if (isNaN(bill) || isNaN(tipPercent) || isNaN(people) || bill <= 0 || people <= 0 || tipPercent < 0) {
        document.getElementById('totalTip').textContent = '$0.00';
        document.getElementById('totalBill').textContent = '$0.00';
        document.getElementById('perPerson').textContent = '$0.00';
        return;
    }

    const tipAmount = (bill * tipPercent) / 100;
    const totalAmount = bill + tipAmount;
    const perPerson = totalAmount / people;

    document.getElementById('totalTip').textContent = '$' + tipAmount.toFixed(2);
    document.getElementById('totalBill').textContent = '$' + totalAmount.toFixed(2);
    document.getElementById('perPerson').textContent = '$' + perPerson.toFixed(2);
}
