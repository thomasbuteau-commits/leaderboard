/* COUNTDOWN */

function startCountdown(){

const el=document.getElementById("countdown")

const target=new Date("2026-03-20T13:00:00+09:00").getTime()

setInterval(()=>{

const now=new Date().getTime()
const diff=target-now

if(diff<=0){
el.textContent="TIME'S UP."
return
}

const d=Math.floor(diff/(1000*60*60*24))
const h=Math.floor((diff/(1000*60*60))%24)
const m=Math.floor((diff/(1000*60))%60)
const s=Math.floor((diff/1000)%60)

el.textContent=`Countdown to Bullet Points: ${d}D ${h}H ${m}M ${s}S`

},1000)

}

startCountdown()



/* LEADERBOARD */

function loadLeaderboard(){

fetch('./data.json?t='+new Date().getTime())

.then(r=>r.json())

.then(data=>{

data.sort((a,b)=>{

if(a.eliminated&&!b.eliminated) return 1
if(!a.eliminated&&b.eliminated) return -1

if(b.score!==a.score)
return b.score-a.score

return a.id.localeCompare(b.id)

})

const top=data.find(p=>!p.eliminated&&p.score>0)

const board=document.getElementById("leaderboard")

board.innerHTML=""

data.forEach(player=>{

const row=document.createElement("div")
row.className="player"
row.textContent=player.id

if(player.score===0)
row.classList.add("zero-score")

if(player.eliminated)
row.classList.add("eliminated")

if(top&&player.id===top.id)
row.classList.add("rank1")

row.addEventListener("click",()=>{

row.classList.add("revealed")

row.innerHTML=`
<div class="reveal">
<span>${player.name}</span>
<span><span class="won">₩</span>${player.score.toLocaleString()}</span>
</div>
`

startWonFlicker()

})

row.addEventListener("mouseleave",()=>{
row.classList.remove("revealed")
row.textContent=player.id
})

board.appendChild(row)

})

startWonFlicker()

})

}

loadLeaderboard()

setInterval(loadLeaderboard,10000)



/* RANDOM TEXT GLITCH */

function randomGlitch(el,min,max){

function trigger(){

el.classList.add("glitch")

setTimeout(()=>{
el.classList.remove("glitch")
},300)

schedule()

}

function schedule(){

const delay=Math.random()*(max-min)+min

setTimeout(trigger,delay)

}

schedule()

}

randomGlitch(document.querySelector(".prep"),5000,15000)
randomGlitch(document.getElementById("countdown"),6000,18000)



/* WON SYMBOL FLICKER */

function startWonFlicker(){

document.querySelectorAll(".won").forEach(symbol=>{

function flicker(){

symbol.style.opacity=0

setTimeout(()=>{
symbol.style.opacity=1
},80+Math.random()*120)

schedule()

}

function schedule(){

const delay=2000+Math.random()*8000

setTimeout(flicker,delay)

}

schedule()

})

}



/* SCANLINE */

function animateGlobalScanline(){

const scan=document.querySelector('.global-scanline')

function move(){

const duration=6000+Math.random()*9000

scan.style.transition=`top ${duration}ms linear`
scan.style.top='100%'

scan.addEventListener('transitionend',reset,{once:true})

}

function reset(){

scan.style.transition='none'
scan.style.top='-4px'

setTimeout(move,100+Math.random()*700)

}

setTimeout(move,500)

}

animateGlobalScanline()
