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

    const days = Math.floor(difference / (1000*60*60*24));
    const hours = Math.floor((difference / (1000*60*60)) % 24);
    const minutes = Math.floor((difference / (1000*60)) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    countdownElement.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
  }, 1000);
}
startCountdown();

// Leaderboard
function loadLeaderboard() {
  fetch('./data.json?t=' + new Date().getTime()) // prevent cache
    .then(res => res.json())
    .then(data => {

      // Sort: non-eliminated first, then descending score
      data.sort((a, b) => {
        if(a.eliminated && !b.eliminated) return 1;
        if(!a.eliminated && b.eliminated) return -1;
        if(b.score !== a.score) return b.score - a.score;
        return a.id.localeCompare(b.id);
      });

      const board = document.getElementById('leaderboard');
      board.innerHTML = "";

      data.forEach(player => {
        const tile = document.createElement('div');
        tile.className = 'tile';

        // Zero score red vs positive green
        if(player.score === 0) tile.classList.add('zero-score');
        else tile.classList.add('positive');

        tile.textContent = player.id; // front ID

        // Reveal on click
        tile.addEventListener('click', () => {
          tile.innerHTML = `
            <span class="name">${player.name}</span>
            <span class="points">₩<span class="won-flicker">${player.score.toLocaleString()}</span></span>
          `;
        });

        // Return to ID on mouse leave
        tile.addEventListener('mouseleave', () => {
          tile.textContent = player.id;
        });

        board.appendChild(tile);
      });
    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

// Initial load
loadLeaderboard();

// Refresh every 10 seconds
setInterval(loadLeaderboard, 10000);
