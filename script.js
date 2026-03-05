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
const tiles = {}; // Keep references to tile elements

function loadLeaderboard() {
  fetch('./data.json?timestamp=' + new Date().getTime())
    .then(response => response.json())
    .then(data => {

      // Sort: non-eliminated first, highest score first, then ID ascending
      data.sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        if (b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
      });

      data.forEach((player, index) => {
        let tile = tiles[player.id];

        if (!tile) {
          // Create tile once
          tile = document.createElement('div');
          tile.id = player.id;
          tile.className = 'player';
          tile.style.transition = 'all 0.5s ease';
          board.appendChild(tile);

          // Click to reveal score
          tile.addEventListener('click', () => {
            tile.classList.add("open");
            tile.innerHTML = `
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
          tile.addEventListener('mouseleave', () => {
            tile.classList.remove("open");
            tile.textContent = player.id;
          });

          tiles[player.id] = tile;
        }

        // Update classes
        tile.classList.toggle("zero-score", player.score === 0);
        tile.classList.toggle("eliminated", player.eliminated);

        // Update content if not open
        if (!tile.classList.contains("open")) {
          tile.textContent = player.id;
        }

        // Reorder tile using flex/grid order
        tile.style.order = index;
      });

    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

// Initial load
loadLeaderboard();

// Auto-update every 10 seconds
setInterval(loadLeaderboard, 10000);
