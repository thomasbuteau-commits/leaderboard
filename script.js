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
// LEADERBOARD
// =========================

const board = document.getElementById("leaderboard");
const tileMap = {};


// =========================
// SORT PLAYERS
// =========================

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
  tile.dataset.open = "false";

  tile.textContent = player.id;

  // click reveal
  tile.addEventListener("click", () => {

    const p = tile.playerData;

    tile.dataset.open = "true";

    tile.innerHTML = `
      <div>${p.id}</div>
      <div style="font-size:22px;margin-top:10px;">
        ${p.name}
      </div>
      <div style="font-size:18px;margin-top:5px;">
        ${p.score.toLocaleString()}
      </div>
    `;

  });

  // close on mouse leave
  tile.addEventListener("mouseleave", () => {

    tile.dataset.open = "false";
    tile.textContent = tile.playerData.id;

  });

  return tile;

}


// =========================
// UPDATE BOARD
// =========================

function updateBoard(data) {

  const players = sortPlayers(data);

  players.forEach(player => {

    let tile = tileMap[player.id];

    if (!tile) {

      tile = createTile(player);
      tileMap[player.id] = tile;
      board.appendChild(tile);

    }

    // store latest player data
    tile.playerData = player;

    // update colors
    if (player.score === 0)
      tile.classList.add("zero-score");
    else
      tile.classList.remove("zero-score");

    if (player.eliminated)
      tile.classList.add("eliminated");
    else
      tile.classList.remove("eliminated");

  });


  // reorder tiles by sorted list
  players.forEach(player => {

    const tile = tileMap[player.id];
    board.appendChild(tile);

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
// INITIAL LOAD + AUTO REFRESH
// =========================

loadLeaderboard();

setInterval(loadLeaderboard, 10000);
