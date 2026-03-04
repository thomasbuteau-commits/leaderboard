fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.sort((a, b) => b.score - a.score);

    const board = document.getElementById('leaderboard');
    board.innerHTML = "";

    data.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'player';

      const rankNumber = String(index + 1).padStart(3, '0');

      row.textContent = rankNumber;

      let expanded = false;

      row.addEventListener('click', () => {
        if (!expanded) {
          row.innerHTML = `
            <div>${rankNumber}</div>
            <div style="font-size:24px; margin-top:10px;">
              ${player.name}
            </div>
            <div style="font-size:20px; margin-top:5px;">
              ${player.score.toLocaleString()}
            </div>
          `;
          expanded = true;
        } else {
          row.textContent = rankNumber;
          expanded = false;
        }
      });

      board.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading leaderboard:", error);
  });
