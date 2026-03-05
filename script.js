// ===== COUNTDOWN =====

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

    const days = Math.floor(difference/(1000*60*60*24));
    const hours = Math.floor((difference/(1000*60*60))%24);
    const minutes = Math.floor((difference/(1000*60))%60);
    const seconds = Math.floor((difference/1000)%60);

    countdownElement.textContent =
      `${days}D ${hours}H ${minutes}M ${seconds}S`;

  },1000);
}

startCountdown();


// ===== LOAD LEADERBOARD =====

function loadLeaderboard() {

  fetch('./data.json?t=' + new Date().getTime())

  .then(response => response.json())

  .then(data => {

    const board = document.getElementById("leaderboard");
    board.innerHTML = "";

    let totalPoints = 0;

    // SORT

    data.sort((a,b) => {

      if (a.eliminated && !b.eliminated) return 1;
      if (!a.eliminated && b.eliminated) return -1;

      if (b.score !== a.score) return b.score - a.score;

      return a.id.localeCompare(b.id);
    });

    data.forEach(player => {

      totalPoints += player.score;

      const tile = document.createElement("div");
      tile.className = "player";
      tile.textContent = player.id;

      if (player.score === 0) tile.classList.add("zero-score");
      if (player.eliminated) tile.classList.add("eliminated");

      tile.addEventListener("click", () => {

        tile.classList.add("reveal");

        tile.innerHTML =
          `${player.name} <span class="won">₩</span>${player.score.toLocaleString()}`;
      });

      tile.addEventListener("mouseleave", () => {

        tile.classList.remove("reveal");
        tile.textContent = player.id;
      });

      board.appendChild(tile);
    });

    // UPDATE PRIZE POOL

    const pool = document.getElementById("prizePool");
    if (pool) {
      pool.innerHTML = `TOTAL PRIZE POOL : ₩${totalPoints.toLocaleString()}`;
    }

  })

  .catch(error => {
    console.error("Error loading leaderboard:", error);
  });

}


// FIRST LOAD

loadLeaderboard();


// AUTO REFRESH EVERY 10 SECONDS

setInterval(loadLeaderboard,10000);
