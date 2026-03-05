// ================== Countdown Timer ==================
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


// ================== Leaderboard ==================
const board = document.getElementById('leaderboard');

function loadLeaderboard() {
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {

      // Sort by eliminated first, then score descending, then numeric ID
      data.sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        if (b.score !== a.score) return b.score - a.score;
        return Number(a.id) - Number(b.id);
      });

      // Remove all existing tiles and recreate (simpler with growing tiles)
      board.innerHTML = "";

      data.forEach(player => {
        const tile = document.createElement('div');
        tile.className = 'player';

        // Add zero-score or eliminated classes
        if (player.score === 0) tile.classList.add("zero-score");
        if (player.eliminated) tile.classList.add("eliminated");

        // Build inner HTML with fade-in score
        tile.innerHTML = `
          <div class="initials">${player.name}</div>
          <div class="id">${player.id}</div>
          <div class="score extra">${player.score.toLocaleString()}</div>
        `;

        // Click to show/hide score (fade-in via CSS)
        tile.addEventListener('click', () => tile.classList.toggle("open"));
        tile.addEventListener('mouseleave', () => tile.classList.remove("open"));

        board.appendChild(tile);
      });
    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

// Initial load
loadLeaderboard();

// Auto-update every 10 seconds
setInterval(loadLeaderboard, 10000);
