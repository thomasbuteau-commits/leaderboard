// Countdown Timer

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


// ===== LEADERBOARD =====

let previousScores = {};

function loadLeaderboard() {

  fetch("./data.json?nocache=" + Date.now())
    .then(response => response.json())
    .then(data => {

      // Sort leaderboard
      data.sort((a, b) => {

        if (a.eliminated && !b.eliminated) return 1;
        if (!a.eliminated && b.eliminated) return -1;

        if (b.score !== a.score) return b.score - a.score;

        return a.id.localeCompare(b.id);

      });

      const board = document.getElementById("leaderboard");
      board.innerHTML = "";

      data.forEach((player, index) => {

        const row = document.createElement("div");
        row.className = "player";
        row.textContent = player.id;

        if (player.score === 0) {
          row.classList.add("zero-score");
        }

        if (player.eliminated === true) {
          row.classList.add("eliminated");
        }

        // ===== SCORE CHANGE DETECTION =====

        const oldScore = previousScores[player.id];

        if (oldScore !== undefined) {

          if (player.score > oldScore) {
            row.classList.add("score-up");
          }

          if (player.score < oldScore) {
            row.classList.add("score-down");
          }

        }

        // ===== NEW LEADER EFFECT =====

        if (index === 0) {
          const oldLeader = Object.keys(previousScores).find(id =>
            previousScores[id] === Math.max(...Object.values(previousScores))
          );

          if (oldLeader && oldLeader !== player.id) {
            row.classList.add("new-leader");
          }
        }

        previousScores[player.id] = player.score;

        // ===== CLICK TO OPEN TILE =====

        row.addEventListener("click", () => {

          row.innerHTML = `
            <div>${player.id}</div>
            <div style="font-size:22px; margin-top:10px;">
              ${player.name}
            </div>
            <div style="font-size:18px; margin-top:5px;">
              ${player.score.toLocaleString()}
            </div>
          `;

        });

        row.addEventListener("mouseleave", () => {
          row.textContent = player.id;
        });

        board.appendChild(row);

      });

    })
    .catch(error => {
      console.error("Error loading leaderboard:", error);
    });

}


// First load
loadLeaderboard();

// Refresh every 10 seconds
setInterval(loadLeaderboard, 10000);
