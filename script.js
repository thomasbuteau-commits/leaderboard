fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.sort((a, b) => b.score - a.score);

    const board = document.getElementById('leaderboard');

    data.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'player';

      row.innerHTML = `
        <div class="rank">${String(index + 1).padStart(3, '0')}</div>
        <div class="name">${player.name}</div>
        <div class="score">${player.score.toLocaleString()}</div>
      `;

      board.appendChild(row);
    });
  });
