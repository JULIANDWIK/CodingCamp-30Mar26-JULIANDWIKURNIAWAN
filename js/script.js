
const balanceDisplay = document.getElementById('total-balance');
const form = document.getElementById('expense-form');
const list = document.getElementById('transaction-list');
const ctx = document.getElementById('expenseChart').getContext('2d');


let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart;


function updateUI() {
    list.innerHTML = '';
    let total = 0;
    const categoryTotals = { Food: 0, Transport: 0, Fun: 0 };

    transactions.forEach((t, index) => {
        const amt = parseFloat(t.amount);
        total += amt;
        categoryTotals[t.category] += amt;

        const div = document.createElement('div');
        div.className = 'transaction-item';
        div.innerHTML = `
            <div class="item-info">
                <span class="name">${t.name}</span>
                <span class="price">$${amt.toFixed(2)}</span>
                <span class="cat-tag">${t.category}</span>
            </div>
            <button class="btn-delete" onclick="deleteItem(${index})">Delete</button>
        `;
        list.appendChild(div);
    });

    balanceDisplay.innerText = `$${total.toFixed(2)}`;
    updateChart(categoryTotals);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


function updateChart(data) {
    if (myChart) myChart.destroy();
    
    myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Food', 'Transport', 'Fun'],
            datasets: [{
                data: [data.Food, data.Transport, data.Fun],
                backgroundColor: ['#2ecc71', '#3498db', '#e67e22'],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } },
            responsive: true
        }
    });
}


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('item-name').value;
    const amount = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    if (name && amount && category) {
        transactions.push({ name, amount, category });
        form.reset();
        updateUI();
    }
});


window.deleteItem = (index) => {
    transactions.splice(index, 1);
    updateUI();
};

updateUI();