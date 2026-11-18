const colors=[
 ['#ef3b53','Rubi'],['#ff8a22','Laranja'],['#ffd72e','Sol'],['#57d65a','Verdão'],['#27c6dd','Ciano'],
 ['#2774ed','Azul'],['#7c3fe4','Roxo'],['#e84fbb','Pink'],['#ffffff','Branco'],['#2e2e42','Noite']
];
const lobby=document.getElementById('lobby'), canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const pc=document.getElementById('previewCanvas'), pctx=pc.getContext('2d');
let W,H,DPR,selected=0,running=false,started=false,keys={},last=0;
function resize(){DPR=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*DPR;canvas.height=H*DPR;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(DPR,0,0,DPR,0,0);pc.width=Math.floor(pc.clientWidth*DPR);pc.height=Math.floor(pc.clientHeight*DPR);pctx.setTransform(DPR,0,0,DPR,0,0)}
addEventListener('resize',resize);resize();

const playerList=document.getElementById('playerList');
function renderLobby(){
 playerList.innerHTML='';
 for(let i=0;i<10;i++){
  const used=i===0||i<1;
  const card=document.createElement('div');card.className='player-card'+(i===0?' you':'');
  if(i<1){card.innerHTML=`<div class="avatar" style="background:${colors[selected][0]}"></div><div><div class="player-name">Você · P1</div><div class="player-status ready">${i===0?'PRONTO':'AGUARDANDO'}</div></div>`}
  else{card.innerHTML=`<div class="avatar" style="opacity:.18;background:#8ba1c9"></div><div><div class="player-name" style="opacity:.32">Slot vazio</div><div class="player-status">ENTRADA P${i+1}</div></div>`}
  playerList.appendChild(card)
 }
 document.getElementById('playerCount').textContent='1/10';
}
const grid=document.getElementById('colorGrid');
colors.forEach((c,i)=>{const b=document.createElement('button');b.className='color-option'+(i===0?' selected':'');b.style.setProperty('--color',c[0]);b.title=c[1];b.onclick=()=>{selected=i;document.querySelectorAll('.color-option').forEach((e,j)=>e.classList.toggle('selected',j===i));renderLobby();};grid.appendChild(b)});
renderLobby();

function drawRunnerPreview(t){
 const w=pc.width/DPR,h=pc.height/DPR;pctx.clearRect(0,0,w,h);
 // small parade of 10 colored silhouettes
 for(let i=0;i<10;i++){const x=w*.16+i*(w*.075),y=h*.73-Math.sin(t*.003+i*.8)*8;drawHero(pctx,x,y,16+i*.25,colors[i][0],t+i*120,false)}
}
function drawHero(c,x,y,s,color,t,outline=true){
 c.save();c.translate(x,y);const bob=Math.sin(t*.008)*2;c.translate(0,bob);
 c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(0,s*.9,s*.8,s*.22,0,0,Math.PI*2);c.fill();
 c.strokeStyle='#24243a';c.lineWidth=Math.max(2,s*.12);
 c.fillStyle='#6a3823';c.fillRect(-s*.42,s*.05,s*.25,s*.85);c.fillRect(s*.17,s*.05,s*.25,s*.85);c.strokeRect(-s*.42,s*.05,s*.25,s*.85);c.strokeRect(s*.17,s*.05,s*.25,s*.85);
 c.fillStyle=color;c.beginPath();c.ellipse(0,s*.05,s*.62,s*.78,0,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle='#ffe1b5';c.beginPath();c.arc(0,-s*.65,s*.48,0,Math.PI*2);c.fill();c.stroke();
 c.fillStyle='#25253a';c.beginPath();c.arc(-s*.22,-s*.72,s*.07,0,Math.PI*2);c.arc(s*.22,-s*.72,s*.07,0,Math.PI*2);c.fill();
 c.fillStyle=color;c.beginPath();c.moveTo(-s*.48,-s*.82);c.quadraticCurveTo(0,-s*1.45,s*.48,-s*.82);c.quadraticCurveTo(0,-s*1.15,-s*.48,-s*.82);c.fill();c.stroke();
 c.fillStyle='#fff';c.beginPath();c.arc(-s*.23,-s*.82,s*.13,0,Math.PI*2);c.fill();c.fillStyle='#24243a';c.beginPath();c.arc(-s*.23,-s*.82,s*.06,0,Math.PI*2);c.fill();
 c.restore()
}

const course=[
 {x:-400,y:430,w:900,h:250},{x:600,y:430,w:500,h:250},{x:1220,y:370,w:700,h:310},{x:2050,y:430,w:650,h:250},{x:2820,y:360,w:500,h:320},{x:3460,y:430,w:900,h:250},{x:4520,y:430,w:1000,h:250}
];
const player={x:180,y:300,vx:0,vy:0,w:42,h:58,ground:false,cam:0,lap:1};
const coins=[];for(let i=0;i<28;i++)coins.push({x:520+i*150,y:330-Math.sin(i*.8)*90,taken:false});
function platformAt(x,y){return course.find(p=>x>p.x&&x<p.x+p.w&&y>=p.y&&y< p.y+45)}
function startGame(){
 lobby.classList.add('hidden');document.getElementById('hud').classList.remove('hidden');document.getElementById('mobileControls').classList.remove('hidden');running=true;
 player.x=160;player.y=300;player.vx=0;player.vy=0;player.cam=0;player.lap=1;coins.forEach(c=>c.taken=false);
 const cd=document.getElementById('countdown');cd.classList.remove('hidden');let n=3;
 cd.textContent=n;const timer=setInterval(()=>{n--;cd.textContent=n>0?n:'GO!';if(n<0){clearInterval(timer);cd.classList.add('hidden')}},650);
}
document.getElementById('readyBtn').onclick=startGame;
document.getElementById('replayBtn').onclick=()=>{document.getElementById('raceEnd').classList.add('hidden');startGame()};
document.getElementById('lobbyBtn').onclick=()=>{document.getElementById('raceEnd').classList.add('hidden');document.getElementById('hud').classList.add('hidden');document.getElementById('mobileControls').classList.add('hidden');lobby.classList.remove('hidden')};
document.getElementById('copyBtn').onclick=()=>navigator.clipboard?.writeText('#RAIN-10');
document.getElementById('soundBtn').onclick=e=>{e.currentTarget.textContent=e.currentTarget.textContent==='♪'?'×':'♪'};
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(['arrowleft','arrowright','arrowup',' '].includes(e.key.toLower()))e.preventDefault()});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll('[data-control]').forEach(b=>{const k=b.dataset.control==='jump'?'arrowup':b.dataset.control==='left'?'arrowleft':'arrowright';const on=e=>{e.preventDefault();keys[k]=true};const off=e=>{keys[k]=false};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off)});

function update(dt){
 if(!running)return;
 const left=keys.arrowleft||keys.a,right=keys.arrowright||keys.d,jump=keys.arrowup||keys.w||keys[' '];
 if(left)player.vx-=900*dt;if(right)player.vx+=900*dt;player.vx*=Math.pow(.001,dt);player.vx=Math.max(-320,Math.min(420,player.vx));
 if(jump&&player.ground){player.vy=-760;player.ground=false}
 player.vy+=1800*dt;player.x+=player.vx*dt;player.y+=player.vy*dt;
 player.ground=false;
 course.forEach(p=>{if(player.x+player.w/2>p.x&&player.x-player.w/2<p.x+p.w&&player.y+player.h/2>=p.y&&player.y+player.h/2-player.vy*dt<=p.y+15&&player.vy>=0){player.y=p.y-player.h/2;player.vy=0;player.ground=true}});
 if(player.y>800){player.x=Math.max(180,player.x-250);player.y=300;player.vy=0}
 player.x=Math.max(20,player.x);
 if(player.x>5200)player.lap=3;
 if(player.x>5400){running=false;document.getElementById('raceEnd').classList.remove('hidden')}
 player.cam+=(player.x-W*.38-player.cam)*Math.min(1,dt*5);
 coins.forEach(c=>{if(!c.taken&&Math.hypot(player.x-c.x,player.y-c.y)<55)c.taken=true});
 document.getElementById('lapText').textContent=`VOLTAS ${Math.min(3,player.lap)}/3`;
 const pos=Math.max(1,Math.min(10,10-Math.floor(player.x/700)));document.getElementById('positionText').textContent=pos+'º LUGAR';
}
function drawGame(t){
 ctx.clearRect(0,0,W,H);
 const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#58bdf2');g.addColorStop(.58,'#b4e9ef');g.addColorStop(.58,'#45a7c8');g.addColorStop(1,'#14789d');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
 ctx.fillStyle='#fff7b0';ctx.beginPath();ctx.arc(W*.82-player.cam*.05,120,55,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#5da783';ctx.beginPath();ctx.moveTo(-200,430);for(let x=-200;x<W+400;x+=180)ctx.lineTo(x,430-Math.sin(x*.01)*55-100);ctx.lineTo(W+400,520);ctx.closePath();ctx.fill();
 ctx.save();ctx.translate(-player.cam,0);
 course.forEach((p,i)=>{ctx.fillStyle=i%2?'#c88e43':'#d99f4d';ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle='#f8e6a1';ctx.fillRect(p.x,p.y,p.w,18);ctx.fillStyle='#65b74d';ctx.fillRect(p.x,p.y-18,p.w,22);ctx.fillStyle='#fff';for(let x=p.x+20;x<p.x+p.w;x+=44){ctx.beginPath();ctx.arc(x,p.y-9,7,0,Math.PI*2);ctx.fill()}});
 coins.forEach(c=>{if(c.taken)return;ctx.save();ctx.translate(c.x,c.y+Math.sin(t*.006+c.x)*8);ctx.fillStyle='#ffd83d';ctx.beginPath();ctx.ellipse(0,0,15,21,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#bd751e';ctx.lineWidth=4;ctx.stroke();ctx.restore()});
 drawHero(ctx,player.x,player.y,28,colors[selected][0],t,true);
 ctx.restore();
}
function frame(t){const dt=Math.min(.032,(t-last)/1000||0);last=t;if(running){update(dt);drawGame(t)}else{drawRunnerPreview(t)}requestAnimationFrame(frame)}
requestAnimationFrame(frame);
