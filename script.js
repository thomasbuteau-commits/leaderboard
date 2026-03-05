async function loadLeaderboard() {

  try {

    const response = await fetch("leaderboard.json");
    const data = await response.json();

    const board = document.getElementById("leaderboard");
    board.innerHTML = "";

    data.players.forEach(player => {

      const tile = document.createElement("div");
      tile.className = "tile";

      if (player.eliminated) {
        tile.classList.add("eliminated");
      }

      if (player.winner) {
        tile.classList.add("winner");
      }

      tile.innerHTML = `
        <div class="name">${player.name}</div>
        <div class="points">${player.points}</div>
      `;

      board.appendChild(tile);

    });

  } catch (err) {

    console.log("Leaderboard load error:", err);

  }
}


/* ===== AUTO REFRESH EVERY 10 SECONDS ===== */

loadLeaderboard();
setInterval(loadLeaderboard, 10000);



/* ===== COUNTDOWN TIMER ===== */

function startCountdown() {

  const target = new Date("2026-04-01T20:00:00");

  function updateCountdown() {

    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerText = "LIVE";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").innerText =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

startCountdown();
