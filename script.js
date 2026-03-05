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

const board = document.getElementById("leaderboard");
const tileMap = new Map();

function loadLeaderboard() {

  fetch("./data.json?cache=" + Date.now())
    .then(res => res.json())
    .then(data => {

      // Sort players
      data.sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        if (b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
      });

      data.forEach(player => {

        let tile = tileMap.get(player.id);

        // Create tile once
        if (!tile) {
          tile = document.createElement("div");
          tile.className = "player";
          tile.dataset.id = player.id;
          board.appendChild(tile);
          tileMap.set(player.id, tile);

          tile.addEventListener("click", () => {
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

          tile.addEventListener("mouseleave", () => {
            tile.textContent = tile.dataset.id;
          });
        }

        // Update stored data
        tile.dataset.name = player.name;
        tile.dataset.score = player.score;

        // Update styling
        tile.classList.toggle("zero-score", player.score === 0);
        tile.classList.toggle("eliminated", player.eliminated);

        // If tile not open, keep simple view
        if (!tile.querySelector("div:nth-child(2)")) {
          tile.textContent = player.id;
        }
      });

      // Reorder tiles smoothly (no clearing, no flashing)
      data.forEach(player => {
        const tile = tileMap.get(player.id);
        board.appendChild(tile);
      });

    })
    .catch(err => console.error("Leaderboard error:", err));
}

loadLeaderboard();
setInterval(loadLeaderboard, 10000);
