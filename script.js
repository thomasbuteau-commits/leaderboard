async function loadLeaderboard() {

  const response = await fetch("leaderboard.json");
  const data = await response.json();

  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  data.players.forEach(player => {

    const tile = document.createElement("div");
    tile.className = "tile";

    if (player.revealed) {
      tile.classList.add("revealed");
    }

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
}

loadLeaderboard();

/* ===== COUNTDOWN CLOCK ===== */

function startCountdown() {

  const targetDate = new Date("2026-04-01T20:00:00");

  function updateClock() {

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("countdown").innerText = "Event Live!";
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("countdown").innerText =
      `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateClock();
  setInterval(updateClock, 1000);
}

startCountdown();
