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

      data.sort((a, b) => {
        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;
        if (b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
      });

      // STEP 1: Record current positions
      const firstPositions = new Map();
      tileMap.forEach((tile, id) => {
        firstPositions.set(id, tile.getBoundingClientRect());
      });

      // STEP 2: Create / Update tiles
      data.forEach(player => {

        let tile = tileMap.get(player.id);

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

        tile.dataset.name = player.name;
        tile.dataset.score = player.score;

        tile.classList.toggle("zero-score", player.score === 0);
        tile.classList.toggle("eliminated", player.eliminated);

        if (!tile.querySelector("div:nth-child(2)")) {
          tile.textContent = player.id;
        }
      });

      // STEP 3: Reorder in DOM
      data.forEach(player => {
        board.appendChild(tileMap.get(player.id));
      });

      // STEP 4: Animate movement (FLIP)
      data.forEach(player => {
        const tile = tileMap.get(player.id);
        const last = tile.getBoundingClientRect();
        const first = firstPositions.get(player.id);

        if (!first) return;

        const deltaX = first.left - last.left;
        const deltaY = first.top - last.top;

        if (deltaX !== 0 || deltaY !== 0) {
          tile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

          requestAnimationFrame(() => {
            tile.style.transition = "transform 0.5s ease";
            tile.style.transform = "translate(0, 0)";
          });
        }
      });

    })
    .catch(err => console.error("Leaderboard error:", err));
}

loadLeaderboard();
setInterval(loadLeaderboard, 10000);
