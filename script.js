// ===== COUNTDOWN =====

function startCountdown() {

  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2026-03-13T13:00:00+09:00").getTime();

  setInterval(() => {

    const now = new Date().getTime();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownElement.textContent = "TIME'S UP";
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const minutes = Math.floor((diff / (1000*60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownElement.textContent =
      `${days}D ${hours}H ${minutes}M ${seconds}S`;

  },1000);

}

startCountdown();



/* ===== LOAD LEADERBOARD ===== */

async function loadLeaderboard(){

  const response = await fetch('./data.json?t=' + Date.now());
  const data = await response.json();

  /* SORT */

  data.sort((a,b)=>{

    if(a.eliminated && !b.eliminated) return 1;
    if(!a.eliminated && b.eliminated) return -1;

    if(b.score !== a.score) return b.score - a.score;

    return a.id.localeCompare(b.id);

  });

  const board = document.getElementById("leaderboard");
  board.innerHTML = "";

  /* CALCULATE TOTAL */

  let total = 0;

  data.forEach(player => {

    total += player.score;

    const tile = document.createElement("div");
    tile.className = "player";

    if(player.score === 0){
      tile.classList.add("zero-score");
    }

    if(player.eliminated){
      tile.classList.add("eliminated");
    }

    tile.textContent = player.id;

    /* CLICK REVEAL */

    tile.addEventListener("click", ()=>{

      tile.classList.add("open");

      tile.innerHTML =
      `<div class="scoreText">
        ${player.name} 
        <span class="won">₩</span>${player.score.toLocaleString()}
      </div>`;

    });

    /* AUTO CLOSE */

    tile.addEventListener("mouseleave", ()=>{

      tile.classList.remove("open");
      tile.textContent = player.id;

    });

    board.appendChild(tile);

  });

  /* UPDATE PRIZE POOL */

  const prize = document.getElementById("prizePool");

  if(prize){
    prize.textContent =
      `TOTAL PRIZE POOL : ₩${total.toLocaleString()}`;
  }

}

/* INITIAL LOAD */

loadLeaderboard();

/* AUTO REFRESH EVERY 10s */

setInterval(loadLeaderboard,10000);
