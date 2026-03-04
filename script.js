fetch('data.json')
  .then(response => response.json())
  .then(data => {
    // Sort highest score first
    data.sort((a, b) => b.score - a.score);

    const board = document.getElementById('leaderboard');
    board.innerHTML = "";

    data.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'player';

      const rankNumber = String(index + 1).padStart(3, '0');

      // Display number by default
      row.textContent = rankNumber;

      // Highlight 1st place slightly brighter
      if (index === 0) {
        row.style.boxShadow = "0 0 40px #00ff66";
        row.style.fontWeight = "bold";
      }

      // Click to toggle score
      let showingScore = false;

      row.addEventListener('click', () => {
        if (!showingScore) {
          row.textContent = player.score.toLocaleString();
          showingScore = true;
        } else {
          row.textContent = rankNumber;
          showingScore = false;
        }
      });

      board.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading leaderboard:", error);
  });
