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

// Fetch leaderboard every 10 seconds
function fetchLeaderboard() {
  fetch('./data.json?t=' + Date.now())
    .then(response => response.json())
    .then(data => {

      // sort by eliminated + score
      data.sort((a,b)=>{
        if(a.eliminated && !b.eliminated) return 1;
        if(!a.eliminated && b.eliminated) return -1;
        return b.score - a.score;
      });

      const board = document.getElementById('leaderboard');
      board.innerHTML = "";

      data.forEach(player => {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.textContent = player.id;

        if(player.eliminated) tile.classList.add('eliminated');
        if(player.score === 0 && !player.eliminated) tile.classList.add('zero-score');

        // Winner tile gets flickering W
        if(player.score === data[0].score && !player.eliminated) tile.classList.add('winner');

        // On click, reveal name + score on same line
        tile.addEventListener('click', () => {
          tile.innerHTML = `<span class="name">${player.name}</span> <span class="points">₩${player.score.toLocaleString()}</span>`;
        });

        // On mouse leave, return to showing ID
        tile.addEventListener('mouseleave', () => {
          tile.textContent = player.id;
        });

        board.appendChild(tile);
      });

    })
    .catch(err => console.error("Error loading leaderboard:", err));
}

// initial fetch
fetchLeaderboard();
// repeat every 10 seconds
setInterval(fetchLeaderboard, 10000);
