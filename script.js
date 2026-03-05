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

    countdownElement.textContent =
      `${days}D ${hours}H ${minutes}M ${seconds}S`;

  },1000);
}

startCountdown();



/* ===== LEADERBOARD ===== */

function loadLeaderboard() {

fetch('./data.json?t=' + new Date().getTime())
.then(response => response.json())
.then(data => {

data.sort((a,b)=>{

if(a.eliminated && !b.eliminated) return 1;
if(!a.eliminated && b.eliminated) return -1;

if(b.score !== a.score) return b.score - a.score;

return a.id.localeCompare(b.id);

});

const board = document.getElementById('leaderboard');
board.innerHTML="";

data.forEach(player=>{

const row = document.createElement('div');
row.className='player';

row.textContent=player.id;

if(player.score===0){
row.classList.add("zero-score");
}

if(player.eliminated===true){
row.classList.add("eliminated");
}

row.addEventListener('click',()=>{

row.classList.add("show-score");

row.innerHTML=`
<div class="reveal">
<span class="initials">${player.name}</span>
<span class="score"><span class="won">₩</span>${player.score.toLocaleString()}</span>
</div>
`;

});

/* close on mouse leave */

row.addEventListener('mouseleave',()=>{
row.classList.remove("show-score");
row.textContent=player.id;
});

board.appendChild(row);

});

})
.catch(error=>{
console.error("Error loading leaderboard:",error);
});

}

/* initial load */

loadLeaderboard();

/* auto refresh every 10 seconds */

setInterval(loadLeaderboard,10000);
