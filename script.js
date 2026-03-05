async function loadLeaderboard(){

try{

const response = await fetch("leaderboard.json?t=" + Date.now());
const data = await response.json();

const board = document.getElementById("leaderboard");

board.innerHTML = "";

/* sort by score */

data.sort((a,b)=>b.score-a.score);

/* find leader */

const topScore = data[0].score;

data.forEach(player=>{

const tile = document.createElement("div");

tile.classList.add("tile");

/* eliminated */

if(player.eliminated){
tile.classList.add("eliminated");
}

/* leader */

if(player.score === topScore && player.score > 0){
tile.classList.add("winner");
}

/* tile layout */

tile.innerHTML = `

<div class="name">${player.name}</div>

<div class="points">₩${player.score.toLocaleString()}</div>

`;

board.appendChild(tile);

});

}

catch(err){

console.log("JSON load error:",err);

}

}

/* load immediately */

loadLeaderboard();

/* refresh every 10 seconds */

setInterval(loadLeaderboard,10000);


/* countdown timer */

function startCountdown(){

const target = new Date("2026-04-01T20:00:00");

function update(){

const now = new Date();
const diff = target-now;

if(diff<=0){
document.getElementById("countdown").innerText="LIVE";
return;
}

const d=Math.floor(diff/(1000*60*60*24));
const h=Math.floor((diff/(1000*60*60))%24);
const m=Math.floor((diff/(1000*60))%60);
const s=Math.floor((diff/1000)%60);

document.getElementById("countdown").innerText=
`${d}d ${h}h ${m}m ${s}s`;

}

update();

setInterval(update,1000);

}

startCountdown();
