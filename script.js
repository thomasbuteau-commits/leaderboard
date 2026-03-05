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
const tiles = {};

function loadLeaderboard() {

  fetch('./data.json?cache=' + Date.now())
    .then(response => response.json())
    .then(data => {

      // Sort: non-eliminated first, highest score first, ID ascending
      data.sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        if (b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
      });

      data.forEach((player, index) => {

        let tile = tiles[player.id];

        if (!tile) {
          tile = document.createElement('div');
          tile.className = 'player';
          tile.dataset.id = player.id;
          tile.style.transition = 'all 0.5s ease';

          board.appendChild(tile);
          tiles[player.id] = tile;

          // Click behavior uses CURRENT dataset values
          tile.addEventListener('click', () => {
            tile.innerHTML = `
              <div>${tile.dataset.id}</div>
              <div style="font-size:22px; margin-top:10px;">
                ${tile.dataset.name}
              </div>
              <div style="font-size:18px; margin-top:5px;">
                ${Number(tile.dataset.score).toLocaleString()}
              </div>
            `;
          });

          tile.addEventListener('mouseleave', () => {
            tile.textContent = tile.dataset.id;
          });
        }

        // Update dataset values EVERY refresh
        tile.dataset.id = player.id;
        tile.dataset.name = player.name;
        tile.dataset.score = player.score;

        // Update styling
        tile.classList.toggle("zero-score", player.score === 0);
        tile.classList.toggle("eliminated", player.eliminated);

        // If not open, keep it simple
        if (!tile.querySelector("div:nth-child(2)")) {
          tile.textContent = player.id;
        }

        // Reorder smoothly
        tile.style.order = index;
      });

    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

loadLeaderboard();
setInterval(loadLeaderboard, 10000);
