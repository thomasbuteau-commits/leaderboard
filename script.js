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

      data.forEach(player=>{
        const row = document.createElement('div');
        row.className = 'tile';

        row.innerHTML = `
          <div class="name">${player.name}</div>
          <div class="points">₩${player.score.toLocaleString()}</div>
        `;

        if(player.score === data[0].score && !player.eliminated){
          row.classList.add('winner');
        }
        if(player.score === 0 && !player.eliminated){
          row.classList.add('zero-score');
        }
        if(player.eliminated){
          row.classList.add('eliminated');
        }

        board.appendChild(row);
      });

    })
    .catch(err=>console.error("Error loading leaderboard:",err));
}

// initial fetch
fetchLeaderboard();

// repeat every 10 seconds
setInterval(fetchLeaderboard, 10000);
