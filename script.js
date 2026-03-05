// Countdown Timer
function startCountdown() {
  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2026-03-13T13:00:00+09:00").getTime();

  setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if (diff <= 0) {
      countdownElement.textContent = "TIME'S UP.";
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    countdownElement.textContent = `${days}D ${hours}H ${minutes}M ${seconds}S`;
  }, 1000);
}
startCountdown();

// Fetch and render leaderboard
function loadLeaderboard() {
  fetch('./data.json?t=' + Date.now())
    .then(res => res.json())
    .then(data => {
      // Sort: non-eliminated first, then highest score, then id
      data.sort((a,b) => {
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
        if(player.score === 0) tile.classList.add('zero-score');
        if(player.eliminated) tile.classList.add('eliminated');

        tile.textContent = player.id;

        tile.addEventListener('click', () => {
          tile.innerHTML = `<span class="reveal">${player.name} ₩${player.score.toLocaleString()}</span>`;
        });

        tile.addEventListener('mouseleave', () => {
          tile.textContent = player.id;
        });

        board.appendChild(tile);
      });
    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

// Initial load and every 10 seconds
loadLeaderboard();
setInterval(loadLeaderboard, 10000);
