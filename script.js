// Countdown Timer

function startCountdown() {
  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2026-03-13T13:00:00+09:00").getTime();
  
  setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference <= 0) {
      countdownElement.textContent = "TIME'S UP.";
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / (1000 * 60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    countdownElement.textContent =
      `${days}D ${hours}H ${minutes}M ${seconds}S`;
  }, 1000);
}

startCountdown();


// Leaderboard

fetch('./data.json')
  .then(response => response.json())
  .then(data => {

    // Sort logic:
    // 1. Non-eliminated first
    // 2. Highest score first
    data.sort((a, b) => {
      if (a.eliminated && !b.eliminated) return 1;
      if (!a.eliminated && b.eliminated) return -1;
      return b.score - a.score;
    });

    const board = document.getElementById('leaderboard');
    board.innerHTML = "";

    data.forEach(player => {

      const row = document.createElement('div');
      row.className = 'player';
      row.textContent = player.id;

      if (player.score === 0) {
        row.classList.add("zero-score");
      }

      if (player.eliminated === true) {
        row.classList.add("eliminated");
      }

      row.addEventListener('click', () => {
        row.innerHTML = `
          <div>${player.id}</div>
          <div style="font-size:22px; margin-top:10px;">
            ${player.name}
          </div>
          <div style="font-size:18px; margin-top:5px;">
            ${player.score.toLocaleString()}
          </div>
        `;
      });

      // Auto close when mouse leaves
      row.addEventListener('mouseleave', () => {
        row.textContent = player.id;
      });

      board.appendChild(row);
    });

  })
  .catch(error => {
    console.error("Error loading leaderboard:", error);
  });
