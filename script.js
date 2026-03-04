// Countdown Timer to April 13, 2026 at 1:00 PM JST (UTC+9)

function startCountdown() {
  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2026-04-13T13:00:00+09:00").getTime();

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

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    data.sort((a, b) => b.score - a.score);

    const board = document.getElementById('leaderboard');
    board.innerHTML = "";

    let currentlyOpen = null;

    data.forEach((player, index) => {
      const row = document.createElement('div');
      row.className = 'player';

      const rankNumber = String(index + 1).padStart(3, '0');
      row.textContent = rankNumber;
      row.dataset.rank = rankNumber;

      // Zero score → pulse red
      if (player.score === 0) {
        row.classList.add("zero-score");
      }

      // Eliminated flag
      if (player.eliminated === true) {
        row.classList.add("eliminated");
      }

      row.addEventListener('click', () => {
        if (currentlyOpen && currentlyOpen !== row) {
          currentlyOpen.textContent =
            String(currentlyOpen.dataset.rank).padStart(3, '0');
        }

        if (currentlyOpen === row) {
          row.textContent = rankNumber;
          currentlyOpen = null;
        } else {
          row.innerHTML = `
            <div>${rankNumber}</div>
            <div style="font-size:22px; margin-top:10px;">
              ${player.name}
            </div>
            <div style="font-size:18px; margin-top:5px;">
              ${player.score.toLocaleString()}
            </div>
          `;
          currentlyOpen = row;
        }
      });

      board.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading leaderboard:", error);
  });
