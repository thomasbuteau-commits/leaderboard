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



/* ============================= */
/* LEADERBOARD + AUTO REFRESH   */
/* ============================= */

let previousScores = {};

function loadLeaderboard() {

  fetch('./data.json?t=' + new Date().getTime())

  .then(response => response.json())

  .then(data => {

    /* ===== TOTAL POINTS ===== */

    let total = 0;

    data.forEach(player => {
      total += player.score || 0;
    });

    const totalBar = document.getElementById("totalPool");

    if (totalBar) {
      totalBar.textContent = "₩" + total.toLocaleString();
    }

    /* ===== SORT ===== */

    data.sort((a, b) => {

      if (a.eliminated && !b.eliminated) return 1;
      if (!a.eliminated && b.eliminated) return -1;

      if (b.score !== a.score) return b.score - a.score;

      return a.id.localeCompare(b.id);

    });

    const board = document.getElementById('leaderboard');

    board.innerHTML = "";

    data.forEach(player => {

      const row = document.createElement('div');

      row.className = 'player';

      row.textContent = player.id;

      if (player.score === 0) {
        row.classList.add("zero-score");
      }

      if (player.eliminated === true) {
        row.classList.add("eliminated");
      }

      /* ===== SCORE CHANGE EFFECT ===== */

      if (previousScores[player.id] !== undefined &&
          player.score > previousScores[player.id]) {

        row.classList.add("score-up");

      }

      previousScores[player.id] = player.score;

      /* ===== TILE CLICK ===== */

      row.addEventListener('click', () => {

        row.classList.add("open");

        row.innerHTML = `
          <div>${player.name} <span class="score">₩${player.score.toLocaleString()}</span></div>
        `;

      });

      row.addEventListener('mouseleave', () => {

        row.classList.remove("open");

        row.textContent = player.id;

      });

      board.appendChild(row);

    });

  })

  .catch(error => {

    console.error("Error loading leaderboard:", error);

  });

}

/* initial load */

loadLeaderboard();

/* refresh every 10 seconds */

setInterval(loadLeaderboard, 10000);
