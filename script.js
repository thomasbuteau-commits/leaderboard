// =========================
// COUNTDOWN TIMER
// =========================

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


// =========================
// LEADERBOARD SYSTEM
// =========================

const board = document.getElementById("leaderboard");
let tileMap = {}; // keeps track of tiles by player ID


function sortPlayers(data) {

  data.sort((a, b) => {

    if (a.eliminated && !b.eliminated) return 1;
    if (!a.eliminated && b.eliminated) return -1;

    if (b.score !== a.score) return b.score - a.score;

    return a.id.localeCompare(b.id);

  });

  return data;
}


// =========================
// CREATE TILE
// =========================

function createTile(player) {

  const tile = document.createElement("div");
  tile.className = "player";
  tile.dataset.id = player.id;

  tile.textContent = player.id;

  if (player.score === 0) tile.classList.add("zero-score");
  if (player.eliminated) tile.classList.add("eliminated");

  tile.addEventListener("click", () => {

    tile.innerHTML = `
      <div>${player.id}</div>
      <div style="font-size:22px;margin-top:10px;">
        ${player.name}
      </div>
      <div style="font-size:18px;margin-top:5px;">
        ${player.score.toLocaleString()}
      </div>
    `;

  });

  tile.addEventListener("mouseleave", () => {
    tile.textContent = player.id;
  });

  return tile;
}


// =========================
// UPDATE BOARD (FLIP)
// =========================

function updateBoard(data) {

  const players = sortPlayers(data);

  const firstPositions = {};

  board.querySelectorAll(".player").forEach(tile => {
    firstPositions[tile.dataset.id] = tile.getBoundingClientRect();
  });


  players.forEach(player => {

    let tile = tileMap[player.id];

    if (!tile) {
      tile = createTile(player);
      tileMap[player.id] = tile;
      board.appendChild(tile);
    }

    if (player.score === 0) tile.classList.add("zero-score");
    else tile.classList.remove("zero-score");

    if (player.eliminated) tile.classList.add("eliminated");
    else tile.classList.remove("eliminated");

  });


  players.forEach(player => {
    board.appendChild(tileMap[player.id]);
  });


  const tiles = board.querySelectorAll(".player");

  tiles.forEach(tile => {

    const first = firstPositions[tile.dataset.id];
    const last = tile.getBoundingClientRect();

    if (!first) return;

    const dx = first.left - last.left;
    const dy = first.top - last.top;

    tile.style.transform = `translate(${dx}px, ${dy}px)`;

    requestAnimationFrame(() => {

      tile.style.transition = "transform 0.6s ease";
      tile.style.transform = "";

    });

  });

}


// =========================
// FETCH DATA
// =========================

function loadLeaderboard() {

  fetch("./data.json?cache=" + Date.now())
    .then(response => response.json())
    .then(data => {
      updateBoard(data);
    })
    .catch(error => {
      console.error("Leaderboard error:", error);
    });

}


// =========================
// AUTO REFRESH
// =========================

loadLeaderboard();

setInterval(() => {
  loadLeaderboard();
}, 10000);
