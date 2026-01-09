const data = [
    ["👑", "Rahul Sharma", "RELIANCE", "UP", "+3.42%", "72.5%", 15],
    ["🥈", "Priya Patel", "TCS", "UP", "+2.89%", "68.3%", 12],
    ["🥉", "Amit Kumar", "INFY", "DOWN", "+2.15%", "65.0%", 8],
    ["4", "Sneha Reddy", "HDFCBANK", "UP", "+1.98%", "61.2%", 6],
    ["5", "Vikram Singh", "ICICIBANK", "UP", "+1.75%", "58.7%", 4]
  ];
  
  const tbody = document.getElementById("rows");
  
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row[0]}</td>
      <td>${row[1]}</td>
      <td>${row[2]}</td>
      <td><span class="badge ${row[3] === "UP" ? "up" : "down"}">${row[3]}</span></td>
      <td class="green">${row[4]}</td>
      <td>${row[5]}</td>
      <td>${row[6]}</td>
    `;
    tbody.appendChild(tr);
  });
  