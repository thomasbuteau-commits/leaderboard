// COUNTDOWN TIMER

function startCountdown() {

  const countdownElement = document.getElementById("countdown");
  const targetDate = new Date("2026-03-20T13:00:00+09:00").getTime();

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
      `Countdown to Bullet Points: ${days}D ${hours}H ${minutes}M ${seconds}S`;

  }, 1000);

}

startCountdown();



// LOAD LEADERBOARD

function loadLeaderboard(){

fetch('./data.json?t='+new Date().getTime())
.then(response=>response.json())
.then(data=>{

data.sort((a,b)=>{

if(a.eliminated && !b.eliminated) return 1
if(!a.eliminated && b.eliminated) return -1

if(b.score !== a.score) return b.score-a.score

return a.id.localeCompare(b.id)

})

const topPlayer=data.find(p=>!p.eliminated && p.score>0)

const board=document.getElementById("leaderboard")

board.innerHTML=""

data.forEach(player=>{

const row=document.createElement("div")

row.className="player"

row.textContent=player.id

if(player.score===0) row.classList.add("zero-score")
if(player.eliminated) row.classList.add("eliminated")
if(topPlayer && player.id===topPlayer.id) row.classList.add("rank1")

row.addEventListener("click",()=>{

row.classList.add("revealed")

row.innerHTML=`
<div class="reveal">
<span class="initials">${player.name}</span>
<span class="score"><span class="won">₩</span>${player.score.toLocaleString()}</span>
</div>
`

})

row.addEventListener("mouseleave",()=>{

row.classList.remove("revealed")

row.textContent=player.id

})

board.appendChild(row)

})

})

}

loadLeaderboard()

setInterval(loadLeaderboard,10000)



// IO PREP RANDOM GLITCH

function randomGlitch(){

const prep=document.querySelector(".prep")

prep.classList.add("glitch")

setTimeout(()=>{
prep.classList.remove("glitch")
},350)

const next=5000+Math.random()*10000

setTimeout(randomGlitch,next)

}

randomGlitch()



// RANDOM ₩ GLITCH

function randomWonGlitch(){

const symbols=document.querySelectorAll(".won")

if(symbols.length===0){
setTimeout(randomWonGlitch,4000)
return
}

const symbol=symbols[Math.floor(Math.random()*symbols.length)]

symbol.classList.add("glitch")

setTimeout(()=>{
symbol.classList.remove("glitch")
},350)

const next=3000+Math.random()*8000

setTimeout(randomWonGlitch,next)

}

randomWonGlitch()
