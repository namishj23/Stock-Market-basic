// Mock Data (In a real app, this comes from your DB/API)
const traders = [
    { name: "Namish", pnl: 1250.50, returns: 12.5 },
    { name: "CryptoWhale", pnl: -450.20, returns: -4.2 },
    { name: "StockMaster", pnl: 3400.00, returns: 25.8 },
    { name: "AlphaTrader", pnl: 890.00, returns: 8.1 },
    { name: "DayWalker", pnl: 150.00, returns: 1.5 }
];

function updateLeaderboard() {
    const tableBody = document.getElementById('leaderboard-body');
    
    // 1. Sort traders by Profit (Descending)
    const sortedTraders = traders.sort((a, b) => b.pnl - a.pnl);

    // 2. Clear existing rows
    tableBody.innerHTML = "";

    // 3. Loop through data and create rows
    sortedTraders.forEach((trader, index) => {
        const rank = index + 1;
        const row = document.createElement('tr');
        
        // Apply special classes for top 3
        let rankClass = "";
        if (rank === 1) rankClass = "rank-1";
        else if (rank === 2) rankClass = "rank-2";
        else if (rank === 3) rankClass = "rank-3";

        const pnlClass = trader.pnl >= 0 ? "profit-positive" : "profit-negative";

        row.innerHTML = `
            <td class="${rankClass}">#${rank}</td>
            <td>${trader.name}</td>
            <td class="${pnlClass}">$${trader.pnl.toFixed(2)}</td>
            <td class="${pnlClass}">${trader.returns > 0 ? '+' : ''}${trader.returns}%</td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Initialize the table on load
document.addEventListener('DOMContentLoaded', updateLeaderboard);